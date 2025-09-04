import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-textarea-control',
  templateUrl: './textarea-control.component.html',
  styleUrls: ['./textarea-control.component.scss']
})
export class TextareaControlComponent extends FormGroupAbstractComponent implements AfterViewInit {
  @Input() typeForm = 'vertical';
  @Input() maxLengthView = false;
  @Input() rowSize: number = 2;

  @Output() focusOutEvent = new EventEmitter();
  @Output() focusEvent = new EventEmitter();
  @ViewChild('inputElement') inputElement: any;
  showTooltip: boolean = false;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.item.focus) {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 100);
    }
  }

  /**
   * Event out focus
   * @param $event
   */
  focusOutFunction($event: any) {
    this.focusOutEvent.emit($event);
  }

  /**
   * Event focus
   * @param $event
   */
  focusFunction($event: any) {
    this.focusEvent.emit($event);
  }
}
