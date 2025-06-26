import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem<T>(key: string, value: T): void {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const json = localStorage.getItem(key);
      if (json === null) return null;
      return JSON.parse(json) as T;
    } catch (error) {
      console.error('Ошибка чтения из localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
