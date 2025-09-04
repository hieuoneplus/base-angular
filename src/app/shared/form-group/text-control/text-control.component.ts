import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextControlComponent extends FormGroupAbstractComponent implements AfterViewInit {
  @Input() typeForm = 'vertical';
  @Input() maxLengthView = false;

  @Output() focusOutEvent = new EventEmitter();
  @Output() focusEvent = new EventEmitter();
  @ViewChild('inputElement')
  inputElement!: ElementRef;
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
