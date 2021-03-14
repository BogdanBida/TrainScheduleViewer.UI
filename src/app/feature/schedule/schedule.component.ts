import { ScheduleItem } from '../../core/models/schedule-item';
import { StateService } from './../../core/state.service';
import { ParserService } from './../../core/parser.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

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
  public connectionTimer: number;

  constructor(
    private parser: ParserService,
    private stateService: StateService,
  ) { }

  ngOnInit(): void {
    this.direction = this.stateService.direction || this.options[0].value;
  }

  public parse(): void {
    this.parser.getSchedule(this.direction + '/' + this.currentDate).pipe(take(1)).subscribe(responce => {
      this.info = responce;
    }, error => {
      console.error(error);
      this.isError = true;
      this.connectionTimer = this.connectionTimerSec;
      this.startTimer();
      setTimeout(() => {
        this.parse();
      }, this.connectionTimerSec * 1000);
    });
  }

  public startTimer(): void {
    setTimeout(() => {
      if (this.connectionTimer > 1) {
        this.connectionTimer--;
        this.startTimer();
      } else {
        this.isError = false;
      }
    }, 1000);
  }

}
