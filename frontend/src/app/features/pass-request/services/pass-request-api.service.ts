import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PassRequest, PassRequestCreateDto } from '../models/interfaces';
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

	create(passRequestCreateDto: PassRequestCreateDto): Observable<PassRequest> {
		return this._http.post<PassRequest>('/api/pass-requests', passRequestCreateDto);
	}

	get(): Observable<PassRequest | null> {
		return this._http.get<PassRequest | null>('/api/pass-requests');
	}

	getSse(): Observable<PassRequest | null> {
		return this._sseService.connect<PassRequest | null>('/api/pass-requests/sse').pipe(
			//tap(data => console.log('Данные в this._sseService.connect', data)), // Для отладки;
		);
	}
}
