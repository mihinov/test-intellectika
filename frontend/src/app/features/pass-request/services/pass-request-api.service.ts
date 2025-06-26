import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PassRequest, PassRequestCreateDto } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassRequestApiService {
  constructor(
		private readonly _http: HttpClient
	) { }

	create(passRequestCreateDto: PassRequestCreateDto): Observable<PassRequest> {
		return this._http.post<PassRequest>('/api/pass-requests', passRequestCreateDto);
	}

	get(): Observable<PassRequest> {
		return this._http.get<PassRequest>('/api/pass-requests');
	}
}
