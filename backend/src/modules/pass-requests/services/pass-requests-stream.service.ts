import { Injectable } from "@nestjs/common";
import { MongoChangeStreamService } from "src/shared/services/mongo-change-stream.service";
import { PassRequests } from "../pass-requests.schema";
import { UserService } from "src/modules/user/user.service";
import { PassStatusesService } from "src/modules/pass-statuses/pass-statuses.service";
import { catchError, filter, from, merge, Observable, of, race, share, skip, startWith, switchMap, take, timeout } from "rxjs";
import { PassRequestsService } from "./pass-requests.service";

@Injectable()
export class PassRequestsStreamService {
	private _isFirstRequest: boolean = true; // Флаг для отслеживания первого запроса

	constructor(
		private readonly _mongoChangeStreamService: MongoChangeStreamService,
		private readonly _userService: UserService,
		private readonly _passStatusesService: PassStatusesService,
		private readonly _passRequestsService: PassRequestsService
	) { }

	// Метод для подгрузки данных с отдельными запросами для каждого поля
	private _populateFields = async (document: any): Promise<any> => {
		try {
			const user = await this._userService.getUserById(document.user);
			const status = await this._passStatusesService.getById(document.status);
			const statusHistory = await Promise.all(
				document.statusHistory.map(async (historyRecord: any) => {
					const statusRecord = await this._passStatusesService.getById(historyRecord.status);
					if (!statusRecord) {
						console.warn(`Status not found for history record: ${historyRecord.status}`);
						return { ...historyRecord, status: {} };
					}
					return { ...historyRecord, status: statusRecord };
				})
			);

			return {
				...document,
				user,
				status,
				statusHistory,
			};
		} catch (error) {
			console.error('Error in populateFields:', error);
			throw new Error('Error during populate operation');
		}
	}

	// Метод для отслеживания изменений в коллекции pass-requests
	private _watch() {
		return this._mongoChangeStreamService.watchCollection<PassRequests>('pass-requests', this._populateFields);
	}

	getByUserId(userId: string): Observable<PassRequests | null> {
		const changeStream$ = this._watch().pipe(
			filter((passRequest: PassRequests | null) => {
				// Если null — значит удаление, пропускаем в поток
				if (passRequest === null) return true;

				// Фильтруем только документы текущего пользователя
				return passRequest.user._id.toString() === userId;
			}),
			share()
		);

		return from(this._passRequestsService.getByUserId(userId)).pipe(
			switchMap(data =>
				merge(
					of(data),
					changeStream$
				)
			)
		);
	}
}
