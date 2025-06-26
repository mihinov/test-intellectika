import * as Joi from 'joi';

export const getConfigJoi = (): Joi.ValidationOptions => {
	return {
		messages: {
			'any.required': 'Поле {#label} обязательно для заполнения.',
			'any.only': 'Значение должно быть одним из: {#valids}.',
			'any.allowOnly': 'Значение должно быть одним из: {#valids}.',
			'array.base': 'Поле {#label} должно быть массивом.',
			'array.includes':
				'Массив должен содержать один из следующих элементов: {#valids}.',
			'array.includesRequiredUnknowns':
				'Массив должен содержать хотя бы {#remaining} элемент(ов).',
			'array.length': 'Длина массива должна быть {#limit}.',
			'array.max': 'Массив не может содержать более {#limit} элементов.',
			'array.min': 'Массив должен содержать как минимум {#limit} элементов.',
			'boolean.base': 'Поле {#label} должно быть логическим значением.',
			'date.base': 'Поле {#label} должно быть датой.',
			'date.format': 'Поле {#label} должно быть в формате {#format}.',
			'date.min': 'Дата должна быть не раньше {#limit}.',
			'date.max': 'Дата должна быть не позже {#limit}.',
			'number.base': 'Поле {#label} должно быть числом.',
			'number.min': 'Число должно быть не меньше {#limit}.',
			'number.max': 'Число должно быть не больше {#limit}.',
			'number.integer': 'Число должно быть целым.',
			'string.base': 'Поле {#label} должно быть строкой.',
			'string.empty': 'Поле {#label} не может быть пустым.',
			'string.min': 'Строка должна содержать как минимум {#limit} символов.',
			'string.max': 'Строка не может содержать более {#limit} символов.',
			'string.length': 'Строка должна содержать ровно {#limit} символов.',
			'string.alphanum': 'Строка должна содержать только буквы и цифры.',
			'string.token':
				'Строка должна содержать только символы, пробелы и знаки препинания.',
			'string.email':
				'Поле {#label} должно быть валидным адресом электронной почты.',
			'string.uri': 'Поле {#label} должно быть валидным URI.',
			'string.regex': 'Поле {#label} не соответствует требуемому формату.',
			'string.guid': 'Поле {#label} должно быть валидным идентификатором GUID.',
			'string.hex': 'Строка должна содержать только шестнадцатеричные символы.',
			'string.base64': 'Строка должна быть в формате base64.',
			'string.isoDate': 'Поле {#label} должно быть в формате ISO 8601.',
			'string.uuid': 'Поле {#label} должно быть валидным UUID.',
			'phone.invalid': 'Поле {#label} должно быть корректным номером телефона',
		},
		abortEarly: false, // Продолжить валидацию, даже если найдены ошибки
		allowUnknown: true // / Разрешить неизвестные поля
	};
};
