import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { AuthLogin, AuthRegistationDto, User } from '../model/interfaces';
import { AuthApiService } from './auth-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly LOCAL_STORAGE_KEY = 'access_token';
  private readonly _token$$ = new BehaviorSubject<string | null>(null);
  private readonly _user$$ = new BehaviorSubject<User | null>(null);

  constructor(
    private readonly _authApiService: AuthApiService,
    private readonly _localStorageService: LocalStorageService
  ) {
    this._init();
  }

  private _init(): void {
    this._token$$.next(this._localStorageService.getItem(AuthService.LOCAL_STORAGE_KEY));
  }

  /**
   * Авторизует пользователя
   */
  login(authLogin: AuthLogin) {
    return this._authApiService.login(authLogin).pipe(
      tap(({ access_token }) => {
        this._setToken(access_token);
      })
    );
  }

  logout(): void {
    this._token$$.next(null);
    this._user$$.next(null);
    this._localStorageService.removeItem(AuthService.LOCAL_STORAGE_KEY);
  }

	registrationAndLogin(authRegistationDto: AuthRegistationDto) {
		return this._registation(authRegistationDto).pipe(
			switchMap(() => this.login({
				email: authRegistationDto.email,
				password: authRegistationDto.password
			}))
		);
	}

	private _registation(authRegistationDto: AuthRegistationDto): Observable<User> {
		return this._authApiService.registation(authRegistationDto);
	}

  me(): Observable<User | null> {
    return this._user$$.asObservable();
  }

  private _me(): Observable<User> {
    return this._authApiService.me();
  }

  getMeAndSaveUser(): Observable<User> {
    return this._me().pipe(
      switchMap((user) => {
        this._setUser(user);
        return of(user);
      })
    );
  }

  private _setUser(user: User): void {
    this._user$$.next(user);
  }

  private _setToken(accessToken: string): void {
    this._token$$.next(accessToken);
    this._localStorageService.setItem(AuthService.LOCAL_STORAGE_KEY, accessToken);
  }
}
