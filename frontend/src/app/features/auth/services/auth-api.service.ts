import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthLogin, AuthLoginResponse, AuthRegistationDto, User } from '../model/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  login(authLogin: AuthLogin): Observable<AuthLoginResponse> {
    return this._http.post<AuthLoginResponse>('/api/auth/login', authLogin);
  }

  me(): Observable<User> {
    return this._http.get<User>('/api/auth/me');
  }

	registation(authRegistationDto: AuthRegistationDto): Observable<User> {
		return this._http.post<User>('/api/auth/registration', authRegistationDto);
	}
}
