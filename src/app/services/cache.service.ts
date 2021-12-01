import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  getItem(key: string): Promise<object | any[]> {
    return new Promise((resolve, reject) => {

      const item = sessionStorage.getItem(key);
      if (item === null) { reject('Key not found'); }
      resolve(JSON.parse(item || ''));
    });
  }

  setItem(key: string, value: object | any[]): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {

      this.getItem(key)
        .then(() => {sessionStorage.removeItem(key); resolve() })
        .catch(() => reject());
    });
  }

  clear(): void {
    sessionStorage.clear();
  }


}
