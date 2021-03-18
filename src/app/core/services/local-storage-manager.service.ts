import { environment } from './../../../environments/environment';
import { ScheduleItem } from './../models/schedule-item';
import { Injectable } from '@angular/core';

const scheduleDataPrefix = 'scheduledata__';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {

  constructor() { }

  public setSchedule(url: string, data: ScheduleItem[]): void {
    localStorage.setItem(scheduleDataPrefix + this.urlToKey(url), JSON.stringify(data));
    this.checkStorageToClear();
  }
  public getSchedule(url: string): ScheduleItem[] {
    return JSON.parse(localStorage.getItem(scheduleDataPrefix + this.urlToKey(url)));
  }

  public setDirection(value: string): void {
    localStorage.setItem('direction', value);
  }
  public getDirection(): string {
    return localStorage.getItem('direction');
  }

  // public setSelectedDate(value: string): void {
  //   localStorage.setItem('selectedDate', value);
  // }
  // public getSelectedDate(): string {
  //   return localStorage.getItem('selectedDate');
  // }

  private urlToKey(url: string): string {
    return url.split('/').join('').replace('https:', '');
  }

  private checkStorageToClear(): void {
    const len = localStorage.length;
    const keys = [];
    for (let i = 0; i < len; i++) {
      const currentKey = localStorage.key(i);
      if (currentKey.includes(scheduleDataPrefix)) {
        keys.push(currentKey);
      }
    }
    if (keys.length > environment.localStorageLimit) {
      for (let i = 0; i < keys.length / 2; i++) {
        localStorage.removeItem(keys[i]);
        console.log(keys[i]);

      }
    }
  }

}
