import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastService } from '../features/toast/services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { CustomEventSource } from '../utils/custom-event-source';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private _eventSource: CustomEventSource | null = null;
  private readonly _timeoutThreshold = 60000; // время переподключения в мс, если не приходят новые данные
  private _lastDataReceivedTime: number | null = null;
  private _retryTimeout: any;
  private _url: string | null = null;

  private _dataSubject = new Subject<any>();
  public data$ = this._dataSubject.asObservable();

  constructor(
    private readonly _zone: NgZone,
    private readonly _toastService: ToastService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  private _resetRetryTimeout(): void {
    if (this._retryTimeout) {
      clearTimeout(this._retryTimeout);
    }

    this._retryTimeout = setTimeout(() => {
      if (this._lastDataReceivedTime && Date.now() - this._lastDataReceivedTime > this._timeoutThreshold) {
        console.log('No data received in time, reconnecting...');
        this._retryConnection();
      }
    }, this._timeoutThreshold);
  }

  private _retryConnection(): void {
    if (this._eventSource) {
      console.log('Closing previous SSE connection and reopening...');
      this._eventSource.close();
      this._eventSource = null;
    }

    if (this._url) {
      this._openSseConnection(this._url);
    } else {
      console.warn('No URL stored for reconnecting');
    }
  }

  private _openSseConnection(url: string): void {
    this._url = url;
    const token = this._localStorageService.getItem(AuthService.LOCAL_STORAGE_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    console.log(`Attempting to connect to SSE at ${url} with token: ${token ? 'present' : 'not present'}`);

    if (this._eventSource) {
      console.log('Closing previous SSE connection...');
      this._eventSource.close();
    }

    this._eventSource = new CustomEventSource(url, headers);
    this._eventSource.open();

    this._eventSource.onmessage = (event) => {
      console.log('Received SSE message:', event.data);
      this._zone.run(() => {
        this._dataSubject.next(event.data);
      });
      this._lastDataReceivedTime = Date.now();
      this._resetRetryTimeout();
    };
  }

  public connect<T>(url: string): Observable<T> {
    console.log(`Starting SSE connection to: ${url}`);
    this._resetRetryTimeout();
    this._openSseConnection(url);
    return this.data$;
  }

  public disconnect(): void {
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }
    this._dataSubject.complete();
  }
}
