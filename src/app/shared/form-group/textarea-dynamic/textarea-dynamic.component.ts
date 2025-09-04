import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-textarea-dynamic',
  templateUrl: './textarea-dynamic.component.html',
  styleUrls: ['./textarea-dynamic.component.scss']
})
export class TextareaDynamicComponent extends FormGroupAbstractComponent implements AfterViewInit {
  @Input() maxLengthView = false

  @ViewChild('inputElement') inputElement: any;
  thecontents: any;

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

  onChangeData(event: any) {
  }
}
