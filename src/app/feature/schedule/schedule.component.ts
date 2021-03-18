import { LocalStorageManagerService } from './../../core/services/local-storage-manager.service';
import { ScheduleItem } from '../../core/models/schedule-item';
import { StateService } from '../../core/services/state.service';
import { ParserService } from '../../core/services/parser.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public info: ScheduleItem[];
  public options = [
    { name: 'Харьков - Красноград', value: 'https://poezdato.net/raspisanie-poezdov/harkov--krasnograd' },
    { name: 'Красноград - Харьков', value: 'https://poezdato.net/raspisanie-poezdov/krasnograd--harkov' },
    { name: 'Красноград - Балки', value: 'https://poezdato.net/raspisanie-poezdov/krasnograd--balki' },
    { name: 'Балки - Красноград', value: 'https://poezdato.net/raspisanie-poezdov/balki--krasnograd' }
  ];

  public set currentDate(value: string) {
    this.info = null;
    this.stateService.currentDate = /\d{4}-\d{2}-\d{2}/.test(value) ? value.split('-').reverse().join('.') : value;
    this.parse();
  }
  public get currentDate(): string { return this.stateService.currentDate; }
  public set direction(value: string) {
    this.info = null;
    this.stateService.direction = value;
    this.parse();
  }
  public get direction(): string { return this.stateService.direction; }
  public isError = false;

  public readonly connectionTimerSec = 10;
  public readonly today = moment().format('DD.MM.YYYY');
  public connectionTimer: number;
  private timerId: number;


  constructor(
    private parser: ParserService,
    private stateService: StateService,
    private localStorageManager: LocalStorageManagerService,
  ) { }

  ngOnInit(): void {
    this.direction = this.stateService.direction || this.options[0].value;
  }

  public parse(): void {
    this.isError = false;

    const url = this.direction + '/' + this.currentDate;
    const savedSchedule = this.localStorageManager.getSchedule(url);
    if (savedSchedule) {
      this.info = savedSchedule;
      return;
    }

    this.parser.getSchedule(url).pipe(take(1)).subscribe(responce => {
      this.info = responce;
    }, error => {
      console.error(error);
      this.isError = true;
      this.connectionTimer = this.connectionTimerSec;
      this.startTimer(this.parse.bind(this));
    });
  }

  public startTimer(callback: () => void): void {
    clearInterval(this.timerId);
    this.timerId = window.setInterval(() => {
      if (!this.isError) { return; }
      if (this.connectionTimer > 1) {
        this.connectionTimer--;
      } else {
        clearInterval(this.timerId);
        callback();
      }
    }, 1000);
  }

}
