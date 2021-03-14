import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public currentDate: string;
  public direction: string;

  constructor() { }

}
