import {Component} from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-slide-toggle-control',
  templateUrl: './slide-toggle-control.component.html',
  styleUrls: ['./slide-toggle-control.component.scss']
})
export class SlideToggleControlComponent extends FormGroupAbstractComponent {
  constructor() {
    super();
  }
}
