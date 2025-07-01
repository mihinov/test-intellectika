import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeStatusRequest, PassRequest } from '../model/interfaces';
import { Observable } from 'rxjs';
import { SseService } from '../../../shared/services/sse.service';

@Injectable({
  providedIn: 'root'
})
export class PassRequestApiService {

  constructor(
    private readonly _http: HttpClient,
		private readonly _sseService: SseService
  ) { }

  getAll(): Observable<PassRequest[]> {
    return this._http.get<PassRequest[]>('/api/pass-requests/all');
  }

	getAllSse(): Observable<PassRequest[]> {
		return this._sseService.connect<PassRequest[]>('/api/pass-requests/sse/all');
	}

  changeStatusRequest(changeStatusRequest: ChangeStatusRequest): Observable<PassRequest> {
    return this._http.patch<PassRequest>(`/api/pass-requests/change-status/${changeStatusRequest.id}`, {
      status: changeStatusRequest.status
    });
  }

	deleteById(id: string): Observable<PassRequest> {
		return this._http.delete<PassRequest>(`/api/pass-requests/${id}`);
	}
}
