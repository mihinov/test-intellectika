import { inject, Injectable } from '@angular/core';
import { PassRequestApiService } from './pass-request-api.service';
import { EMPTY, Observable, shareReplay, switchMap } from 'rxjs';
import { PassRequest, PassRequestCreateDto } from '../models/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PassRequestService {
	private readonly _authService = inject(AuthService);
	private readonly _isAuth$ = this._authService.isAuth$;
	private readonly _passRequestApiService = inject(PassRequestApiService);
	private readonly _sseCached$ = this._isAuth$.pipe(
		switchMap(isAuth => {
    	return isAuth
				? this._passRequestApiService.getSse()
				: EMPTY;
  	}),
		shareReplay(1)
	);

  get(): Observable<PassRequest | null> {
    return this._passRequestApiService.get();
  }

	getSse(): Observable<PassRequest | null> {
		return this._sseCached$;
	}

  // Метод создания с триггером обновления
  create(passRequestCreateDto: PassRequestCreateDto): Observable<PassRequest> {
		return this._passRequestApiService.create(passRequestCreateDto);
  }
}
