import { Station } from './../../core/models/station';
import { ParserService } from '../../core/services/parser.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit, OnDestroy {

  public data: Station[];
  private destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private parseService: ParserService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      switchMap((paramMap) => {
        return this.parseService.getRoute('https://poezdato.net' + paramMap.get('url'));
      })).subscribe(data => {
        this.data = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
