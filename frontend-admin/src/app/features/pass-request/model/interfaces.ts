import { User } from "../../auth/model/interfaces";

export interface PassStatus {
	type: string;
	value: string;
}

export interface PassRequest {
	_id: string;
	visitPurpose: string;
	user: User;
	status: PassStatus;
	statusHistory: PassRequestStatusHistory[];
}

export interface PassRequestStatusHistory {
	status: PassStatus;
	changedAt: Date;
}

export interface ChangeStatusRequest {
	id: string;
	status: string;
}

