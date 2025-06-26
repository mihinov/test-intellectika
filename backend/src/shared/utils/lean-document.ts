/**
 * Проверяет, является ли объект документом Mongoose (содержит свойство $locals).
 *
 * Если объект не содержит $locals, возвращается сам объект без изменений.
 *
 * Если объект содержит $locals, возвращается строка с рекомендацией конвертировать документ
 * в обычный объект с помощью `JSON.parse(JSON.stringify(object))`.
 *
 * @template T - Тип, который проверяется.
 */
export type PlainMongoObject<T> = T extends { $locals: any }
	? 'Please convert the document to a plain object via `JSON.parse(JSON.stringify(object))`'
	: {
			[K in keyof T as T[K] extends Function ? never : K]: T[K];
		};
