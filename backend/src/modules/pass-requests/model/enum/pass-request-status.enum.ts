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
