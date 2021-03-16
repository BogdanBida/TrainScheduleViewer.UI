import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public set currentDate(value: string) {
    this.$currentDate = value;
    localStorage.setItem('currentDate', value);
  }
  public get currentDate(): string { return this.$currentDate; }

  public set direction(value: string) {
    this.$direction = value;
    localStorage.setItem('direction', value);
  }
  public get direction(): string { return this.$direction; }

  private $currentDate: string;
  private $direction: string;

  constructor() {
    this.$currentDate = localStorage.getItem('currentDate') || moment().format('DD.MM.YYYY');
    this.$direction = localStorage.getItem('direction') || null;
  }

}
