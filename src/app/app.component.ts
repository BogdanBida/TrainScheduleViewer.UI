import { StateService } from './core/state.service';
import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scheduleViewer';
  constructor(stateService: StateService) {
    stateService.currentDate = moment().format('DD.MM.YYYY');
  }
}
