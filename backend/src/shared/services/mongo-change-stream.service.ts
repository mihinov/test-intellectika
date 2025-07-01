/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ObjectId } from 'mongoose';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class MongoChangeStreamService {
  private _streams = new Map<string, ReplaySubject<any>>();

  constructor(@InjectConnection() private readonly _connection: Connection) {}

  watchCollection<TSchema extends Record<string, any> = any>(
    collectionName: string,
    populateHandler?: (doc: TSchema) => Promise<TSchema>,
  ): Observable<TSchema | null> {
    console.log(`watchCollection: Начинаю наблюдение за коллекцией ${collectionName}`);

    const existing = this._streams.get(collectionName);
    if (existing) {
      console.log(`watchCollection: Поток для ${collectionName} уже существует. Возвращаю.`);
      return existing.asObservable();
    }

    const subject = new ReplaySubject<TSchema | null>(1);
    this._streams.set(collectionName, subject);
    console.log(`watchCollection: Создаю новый поток для ${collectionName}`);

    const collection = this._connection.collection<TSchema>(collectionName);

    const changeStream = collection.watch([], {
      fullDocument: 'updateLookup',
    });

    changeStream.on('change', async (change) => {
      console.log(`watchCollection: Изменение в ${collectionName}:`, change);

      try {
        if (change.operationType === 'delete') {
          console.log(`watchCollection: Удалён документ. Отправляю null`);
          subject.next(null);
        } else if (hasFullDocument<TSchema>(change)) {
          console.log(`watchCollection: Найден полный документ`);

          const populated = populateHandler
            ? await populateHandler(change.fullDocument)
            : change.fullDocument;

          subject.next(populated);
        } else {
          console.log(`watchCollection: Полный документ отсутствует — пропускаю`);
        }
      } catch (err) {
        console.error(`watchCollection: Ошибка обработки:`, err);
      }
    });

    changeStream.on('error', (err) => {
      console.error(`watchCollection: Ошибка наблюдения за ${collectionName}:`, err);
      subject.error(err);
      this._streams.delete(collectionName);
    });

    changeStream.on('close', () => {
      console.log(`watchCollection: Поток закрыт для ${collectionName}`);
      subject.complete();
      this._streams.delete(collectionName);
    });

    return subject.asObservable();
  }
}

function hasFullDocument<T>(change: any): change is { fullDocument: T } {
  return 'fullDocument' in change && change.fullDocument !== undefined;
}
