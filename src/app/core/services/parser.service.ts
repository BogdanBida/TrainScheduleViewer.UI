import { LocalStorageManagerService } from './local-storage-manager.service';
import { Station } from '../models/station';
import { ScheduleItem } from '../models/schedule-item';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  public data = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private localStorageManager: LocalStorageManagerService
  ) { }

  public getSchedule(url: string): Observable<ScheduleItem[]> {
    const params = new HttpParams().set('url', `${url}/`);
    return this.http.get<ScheduleItem[]>(environment.api + '/schedule', { params }).pipe(tap(data => {
      this.localStorageManager.setSchedule(url, data);
    }));
  }

  public getRoute(url: string): Observable<Station[]> {
    const params = new HttpParams().set('url', `${url}/`);
    return this.http.get<Station[]>(environment.api + '/route', { params });
  }
}
