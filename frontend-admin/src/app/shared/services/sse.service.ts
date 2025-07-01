import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastService } from '../features/toast/services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { LocalStorageService } from './local-storage.service';
import { CustomEventSource } from '../utils/custom-event-source';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private _eventSource: CustomEventSource | null = null;
  private _url: string | null = null;
  private _retryTimeout: any;
  private _lastDataReceivedTime: number | null = null;

  // 🔁 Единый интервал ожидания: и для ошибок, и для "тишины"
  private readonly _reconnectInterval = 500_000;

  private _dataSubject = new Subject<any>();
  public data$ = this._dataSubject.asObservable();

  constructor(
    private readonly _zone: NgZone,
    private readonly _toastService: ToastService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  connect<T>(url: string): Observable<T> {
    console.log(`Starting SSE connection to: ${url}`);
    this._url = url;
    this._lastDataReceivedTime = Date.now();
    this._connect();
    return this.data$;
  }

  private _connect(): void {
    if (!this._url) {
      console.warn('No URL available for SSE connection');
      return;
    }

    const token = this._localStorageService.getItem(AuthService.LOCAL_STORAGE_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }

    this._eventSource = new CustomEventSource(this._url, headers);
    this._eventSource.open();

    this._eventSource.onmessage = (event) => {
      this._zone.run(() => {
        this._dataSubject.next(event.data);
      });

      this._lastDataReceivedTime = Date.now();
      this._scheduleInactivityCheck(); // перезапускаем таймер
    };

    this._eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
			this._toastService.show(`${error.status} ${error.body?.message || error.statusText} ${error.body?.path}`, 'error');
      this._scheduleReconnect();
    };

    this._scheduleInactivityCheck(); // первый запуск
  }

  private _scheduleReconnect(): void {
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }

    clearTimeout(this._retryTimeout);
    console.warn(`Retrying SSE connection in ${this._reconnectInterval} ms...`);

    this._retryTimeout = setTimeout(() => {
      this._connect();
    }, this._reconnectInterval);
  }

  private _scheduleInactivityCheck(): void {
    clearTimeout(this._retryTimeout);
    this._retryTimeout = setTimeout(() => {
      if (
        this._lastDataReceivedTime &&
        Date.now() - this._lastDataReceivedTime > this._reconnectInterval
      ) {
        console.warn('No SSE data received in time. Reconnecting...');
        this._scheduleReconnect();
      } else {
        this._scheduleInactivityCheck(); // ждём дальше
      }
    }, this._reconnectInterval + 100); // небольшой запас
  }

  disconnect(): void {
		//console.log(`Closing SSE connection to: ${this._url}`);
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }
    clearTimeout(this._retryTimeout);
    this._dataSubject.next(null);
  }
}
