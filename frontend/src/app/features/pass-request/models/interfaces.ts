import { User } from "../../auth/model/interfaces"

export interface PassRequestCreateDto {
	visitPurpose: string
}

export enum PassRequestStatus {
	InProgress = 'в обработке',
	UnderReview = 'на согласовании',
	Ready = 'пропуск готов',
	Rejected = 'отклонён',
	Issued = 'пропуск выдан',
}

export interface PassRequestStatusHistory {
	status: PassRequestStatus
	changedAt: Date
}

export interface PassRequest {
	user: User
	visitPurpose: string
	status: PassRequestStatus
	statusHistory: PassRequestStatusHistory[]
	_id: string
}
