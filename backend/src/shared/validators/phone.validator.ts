import * as Joi from 'joi';

export const JoiPhoneValidator = Joi.string()
  .pattern(/^(\+7|8)?[\s\\-]?\(?\d{3}\)?[\s\\-]?\d{3}[\s\\-]?\d{2}[\s\\-]?\d{2}$/)
  .messages({
    'string.pattern.base': 'Неверный формат номера телефона',
    'string.empty': 'Телефон обязателен',
  });
