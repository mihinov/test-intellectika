/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class MongoChangeStreamService {
  private _streams = new Map<string, ReplaySubject<any>>(); // Потоки изменений для каждой коллекции

  constructor(@InjectConnection() private readonly _connection: Connection) {}

  watchCollection<TSchema extends Record<string, any> = any>(
    collectionName: string,
    populateHandler?: (doc: TSchema) => Promise<TSchema>, // необязательный колбэк
  ): Observable<TSchema> {
    console.log(`watchCollection: Начинаю наблюдение за коллекцией ${collectionName}`);

    const existing = this._streams.get(collectionName) as ReplaySubject<TSchema> | undefined;
    if (existing) {
      console.log(`watchCollection: Для коллекции ${collectionName} уже существует поток изменений. Возвращаю существующий.`);
      return existing.asObservable();
    }

    const subject = new ReplaySubject<TSchema>(1); // Задаём размер буфера 1
    this._streams.set(collectionName, subject);
    console.log(`watchCollection: Создаю новый поток изменений для коллекции ${collectionName}`);

    const collection = this._connection.collection<TSchema>(collectionName);

    const changeStream = collection.watch([], {
      fullDocument: 'updateLookup',
    });

    changeStream.on('change', async (change) => {
      console.log(`watchCollection: Изменение в коллекции ${collectionName}:`, change);

      if (hasFullDocument(change)) {
        console.log(`watchCollection: Полный документ найден.`);

        // Если передан обработчик, вызываем его для подгрузки данных
        if (populateHandler) {
          const populatedDocument = await populateHandler(change.fullDocument);
          console.log(`watchCollection: Документ с подгруженными данными:`, populatedDocument);
          subject.next(populatedDocument); // Прокидываем данные в поток
        } else {
          console.log(`watchCollection: Обработчик не передан, отправляю документ как есть.`);
          subject.next(change.fullDocument); // Прокидываем данные без изменений
        }
      } else {
        console.log(`watchCollection: Полный документ не найден. Пропускаю изменения.`);
      }
    });

    changeStream.on('error', (err) => {
      console.error(`watchCollection: Ошибка при наблюдении за коллекцией ${collectionName}:`, err);
      subject.error(err);
      this._streams.delete(collectionName);
    });

    changeStream.on('close', () => {
      console.log(`watchCollection: Поток для коллекции ${collectionName} закрыт.`);
      subject.complete();
      this._streams.delete(collectionName);
    });

    return subject.asObservable();
  }
}

function hasFullDocument<T>(
  change: any,
): change is { fullDocument: T } {
  return 'fullDocument' in change && change.fullDocument !== undefined;
}
