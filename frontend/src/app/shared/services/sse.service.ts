import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from '../features/toast/services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { CustomEventSource } from '../utils/custom-event-source';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private _eventSource: CustomEventSource | null = null;
  private readonly _timeoutThreshold = 60000; // Время без данных для переподключения (в миллисекундах)
  private _lastDataReceivedTime: number | null = null;
  private _retryTimeout: any;

  constructor(
    private readonly _zone: NgZone,
    private readonly _toastService: ToastService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  // Запускаем таймер для переподключения, если данных не пришло за _timeoutThreshold
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

  // Попытка переподключения
  private _retryConnection(): void {
    if (this._eventSource) {
      console.log('Closing previous SSE connection and reopening...');
      this._eventSource.close(); // Закрываем старое соединение
    }

    // Пытаемся открыть новое соединение
    this.connect(this._eventSource!.url).subscribe({
      error: (err) => {
        console.log('Error during reconnecting:', err);
        this._toastService.show('Ошибка переподключения', 'error');
      },
    });
  }

  // Метод для открытия SSE
  private _openSseConnection<T>(url: string): Observable<T> {
    return new Observable<T>((observer) => {
      const token = this._localStorageService.getItem(AuthService.LOCAL_STORAGE_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      console.log(`Attempting to connect to SSE at ${url} with token: ${token ? 'present' : 'not present'}`);

      // Закрываем старое соединение, если оно существует
      if (this._eventSource) {
        console.log('Closing previous SSE connection...');
        this._eventSource.close();
      }

      this._eventSource = new CustomEventSource(url, headers);
      console.log('Opening new SSE connection...');
      this._eventSource.open();

      // Обработчик сообщений
      this._eventSource.onmessage = (event) => {
        console.log('Received SSE message:', event.data);
        this._zone.run(() => {
          observer.next(event.data);
        });

        // Сбрасываем таймер, если данные пришли
        this._lastDataReceivedTime = Date.now();
        this._resetRetryTimeout();
      };

      // Закрытие соединения при завершении подписки
      return () => {
        if (this._eventSource) {
          console.log('Closing SSE connection...');
          this._eventSource.close();
          this._eventSource = null;
        }
      };
    });
  }

  connect<T = any>(url: string): Observable<T> {
    console.log(`Starting SSE connection to: ${url}`);
    this._resetRetryTimeout(); // Инициализируем таймер для повторных попыток
    return this._openSseConnection<T>(url);
  }
}
