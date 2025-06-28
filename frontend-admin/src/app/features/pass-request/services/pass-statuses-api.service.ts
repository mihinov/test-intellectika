import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PassStatus } from '../model/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassStatusesApiService {

  constructor(
		private readonly _http: HttpClient
	) { }

	getAll(): Observable<PassStatus[]> {
		return this._http.get<PassStatus[]>('/api/pass-statuses');
	}
}
