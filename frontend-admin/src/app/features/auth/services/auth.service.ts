import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthLogin, User } from '../model/interfaces';
import { AuthApiService } from './auth-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SseService } from '../../../shared/services/sse.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly LOCAL_STORAGE_KEY = 'admin_access_token';
  private readonly _token$$ = new BehaviorSubject<string | null>(null);
  private readonly _user$$ = new BehaviorSubject<User | null>(null);
	isAuth$ = this._token$$.pipe(map(token => !!token));

  constructor(
    private readonly _authApiService: AuthApiService,
    private readonly _localStorageService: LocalStorageService,
		private readonly _sseService: SseService
  ) {
    this._init();
  }

  /**
   * Авторизует пользователя
   */
  login(authLogin: AuthLogin) {
    return this._authApiService.login(authLogin).pipe(
      tap(({ access_token }) => this._setToken(access_token))
    );
  }

  logout(): void {
		this._localStorageService.removeItem(AuthService.LOCAL_STORAGE_KEY);
		this._sseService.disconnect();
    this._token$$.next(null);
    this._user$$.next(null);
  }

	getMeAndSaveUser(): Observable<User> {
    return this._me().pipe(
      switchMap((user) => {
        this._setUser(user);
        return of(user);
      })
    );
  }

  me(): Observable<User | null> {
    return this._user$$.asObservable();
  }

	getSyncToken(): string | null {
		return this._token$$.value;
	}

  private _init(): void {
    this._token$$.next(this._localStorageService.getItem(AuthService.LOCAL_STORAGE_KEY));
  }

  private _me(): Observable<User> {
    return this._authApiService.me();
  }

  private _setUser(user: User): void {
    this._user$$.next(user);
  }

  private _setToken(accessToken: string): void {
		this._localStorageService.setItem(AuthService.LOCAL_STORAGE_KEY, accessToken);
    this._token$$.next(accessToken);
  }
}
