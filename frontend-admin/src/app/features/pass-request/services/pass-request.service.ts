import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable, shareReplay, switchMap } from 'rxjs';
import { PassRequestApiService } from './pass-request-api.service';
import { ChangeStatusRequest, PassRequest } from '../model/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PassRequestService {
	private readonly _authService = inject(AuthService);
	private readonly _isAuth$ = this._authService.isAuth$;
	private readonly _passRequestApiService = inject(PassRequestApiService);
	private readonly _sseAllCached$ = this._isAuth$.pipe(
		switchMap(isAuth => {
    	return isAuth
				? this._passRequestApiService.getAllSse()
				: EMPTY;
  	}),
		shareReplay(1)
	);


  getAll(): Observable<PassRequest[]> {
    return this._passRequestApiService.getAll();
  }

	getAllSse(): Observable<PassRequest[]> {
		return this._sseAllCached$;
	}

	deleteById(id: string): Observable<PassRequest> {
		return this._passRequestApiService.deleteById(id);
	}

  /**
   * Изменение статуса запроса и обновление списка
   */
  changeStatusRequest(changeStatusRequest: ChangeStatusRequest): Observable<PassRequest> {
    return this._passRequestApiService.changeStatusRequest(changeStatusRequest);
  }

}
