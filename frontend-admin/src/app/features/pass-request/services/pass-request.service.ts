import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { PassRequestApiService } from './pass-request-api.service';
import { ChangeStatusRequest, PassRequest } from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PassRequestService {
  private readonly _refreshTrigger$$ = new BehaviorSubject<void>(undefined);

  readonly all$: Observable<PassRequest[]> = this._refreshTrigger$$.pipe(
    switchMap(() => this._passRequestApiService.getAll())
  );

  constructor(
    private readonly _passRequestApiService: PassRequestApiService
  ) { }


  getAll(): Observable<PassRequest[]> {
    return this.all$;
  }

  /**
   * Изменение статуса запроса и обновление списка
   */
  changeStatusRequest(changeStatusRequest: ChangeStatusRequest): Observable<PassRequest> {
    return this._passRequestApiService.changeStatusRequest(changeStatusRequest).pipe(
      tap(() => this.refresh())
    );
  }

  /**
   * Принудительное обновление
   */
  refresh(): void {
    this._refreshTrigger$$.next();
  }
}
