import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-date-control',
  templateUrl: './date-control.component.html',
  styleUrls: ['./date-control.component.scss']
})
export class DateControlComponent extends FormGroupAbstractComponent implements OnInit, AfterViewInit {
  minDate: moment.Moment;
  maxDate: moment.Moment;
  @ViewChild('inputElement') inputElement: any;

  @Input() notRequired: boolean = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.minDate = this.item.minDate ? moment(this.item.minDate) : moment('1900-01-01');
    this.maxDate = moment(this.item.maxDate)
  }

  ngAfterViewInit() {
    if (this.item.focus) {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 100);
    }
  }

  formatItemDate(date: string){
    return moment(date).format('DD/MM/YYYY')
  }
}

