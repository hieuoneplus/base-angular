import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'dform-form-group-slide-toggle',
  templateUrl: './form-group-slide-toggle.component.html'
})
export class FormGroupSlideToggleComponent extends FormGroupAbstractComponent {
  @ViewChild('inputElement') inputElement: any;

  @Input() typeForm: 'vertical' | 'horizontal' = 'horizontal';
  @Input() disabled: boolean = false;
  constructor() {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      this.updateControlDisabledState();
    }
  }
  private updateControlDisabledState() {
    const control = this.form.get(this.item.key) as FormControl;
    if (control) {
      if (this.disabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

}
