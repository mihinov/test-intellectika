import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthLogin, AuthLoginResponse, User } from '../model/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  login(authLogin: AuthLogin): Observable<AuthLoginResponse> {
    return this._http.post<AuthLoginResponse>('/api/auth/login-admin', authLogin);
  }

  me(): Observable<User> {
    return this._http.get<User>('/api/auth/admin-me');
  }
}
