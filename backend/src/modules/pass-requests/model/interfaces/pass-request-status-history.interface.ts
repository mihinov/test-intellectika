import { PassRequestStatusEnum, PassRequestStatusValueEnum } from "../enum/pass-request-status.enum";

export interface PassRequestStatusHistory {
	type: PassRequestStatusEnum;
	value: PassRequestStatusValueEnum;
	changedAt: Date;
}
