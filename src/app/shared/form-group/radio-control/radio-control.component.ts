import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss']
})
export class RadioControlComponent extends FormGroupAbstractComponent  implements AfterViewInit {
  @ViewChild('inputElement') inputElement: any;
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
}
