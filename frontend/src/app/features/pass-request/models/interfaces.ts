import { User } from "../../auth/model/interfaces"

export enum PassRequestStatusEnum {
  InProgress = 'InProgress',
  UnderReview = 'UnderReview',
  Ready = 'Ready',
  Rejected = 'Rejected',
  Issued = 'Issued',
}

export enum PassRequestStatusValueEnum {
  InProgress = 'в обработке',
  UnderReview = 'на согласовании',
  Ready = 'пропуск готов',
  Rejected = 'отклонён',
  Issued = 'пропуск выдан',
}

export const PassRequestStatusMap: Record<PassRequestStatusEnum, PassRequestStatusValueEnum> = {
  [PassRequestStatusEnum.InProgress]: PassRequestStatusValueEnum.InProgress,
  [PassRequestStatusEnum.UnderReview]: PassRequestStatusValueEnum.UnderReview,
  [PassRequestStatusEnum.Ready]: PassRequestStatusValueEnum.Ready,
  [PassRequestStatusEnum.Rejected]: PassRequestStatusValueEnum.Rejected,
  [PassRequestStatusEnum.Issued]: PassRequestStatusValueEnum.Issued,
};

export interface PassRequestStatusObject {
  type: PassRequestStatusEnum;
  value: PassRequestStatusValueEnum;
}

export interface PassRequest {
	_id: string;
	visitPurpose: string;
	user: User;
	status: PassRequestStatusObject;
	statusHistory: PassRequestStatusHistory[];
}

export interface PassRequestStatusHistory {
	type: PassRequestStatusEnum;
	value: PassRequestStatusValueEnum;
	changedAt: Date;
}

export interface PassRequestCreateDto {
	visitPurpose: string;
}
