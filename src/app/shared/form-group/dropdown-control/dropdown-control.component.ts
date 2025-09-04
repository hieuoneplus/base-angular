import { Component, ViewChild } from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.scss']
})
export class DropdownControlComponent extends FormGroupAbstractComponent {

  @ViewChild('selectElement') selectElement: any;
  constructor() {
    super();
  }

  makeChoice(e) {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.item.type !== 'multiple') {
      const totalOptions = this.selectElement.options._results;
      for (let i = 0; i < totalOptions.length; i++) {
        if (totalOptions[i]._active === true) {
          this.f[this.item.key].patchValue(this.item.options[i].value);
        }
      }
    }
  }
}
