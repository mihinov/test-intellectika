import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusRequest, PassRequest } from '../model/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassRequestApiService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  getAll(): Observable<PassRequest[]> {
    return this._http.get<PassRequest[]>('/api/pass-requests/all');
  }

  changeStatusRequest(changeStatusRequest: ChangeStatusRequest): Observable<PassRequest> {
    return this._http.patch<PassRequest>(`/api/pass-requests/change-status/${changeStatusRequest.id}`, {
      status: changeStatusRequest.status
    });
  }
}
