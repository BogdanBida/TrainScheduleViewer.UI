import { LocalStorageManagerService } from './local-storage-manager.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public set currentDate(value: string) {
    this.$currentDate = value;
    // this.localStorageManager.setSelectedDate(value);
  }
  public get currentDate(): string { return this.$currentDate; }

  public set direction(value: string) {
    this.$direction = value;
    this.localStorageManager.setDirection(value);
  }
  public get direction(): string { return this.$direction; }

  private $currentDate: string;
  private $direction: string;

  constructor(
    private localStorageManager: LocalStorageManagerService,
  ) {
    this.$currentDate = moment().format('DD.MM.YYYY');
    this.$direction = this.localStorageManager.getDirection() || null;
  }

}
