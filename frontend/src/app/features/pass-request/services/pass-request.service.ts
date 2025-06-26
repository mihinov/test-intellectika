import { Injectable } from '@angular/core';
import { PassRequestApiService } from './pass-request-api.service';
import { Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { PassRequest, PassRequestCreateDto } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PassRequestService {
  // Триггер для перезапроса данных
  private readonly _refreshTrigger$$ = new Subject<void>();

  // Поток с актуальными данными
  private readonly _passRequest$: Observable<PassRequest> = this._refreshTrigger$$.pipe(
    // при каждом новом триггере запрашиваем данные
    startWith(0), // запускаем сразу при первой подписке
    switchMap(() => this._passRequestApiService.get())
  );

  constructor(
    private readonly _passRequestApiService: PassRequestApiService
  ) {}

  // Подписка на поток актуальных данных
  get(): Observable<PassRequest> {
    return this._passRequest$;
  }

  // Метод создания с триггером обновления
  create(passRequestCreateDto: PassRequestCreateDto): Observable<PassRequest> {
		return this._passRequestApiService.create(passRequestCreateDto).pipe(
			tap(() => this._refreshTrigger$$.next()) // корректный побочный эффект
		);
  }

	refresh(): void {
		this._refreshTrigger$$.next();
	}
}
