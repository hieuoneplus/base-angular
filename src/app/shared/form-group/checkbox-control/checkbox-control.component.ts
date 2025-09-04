import {Component, OnInit} from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  styleUrls: ['./checkbox-control.component.scss']
})
export class CheckboxControlComponent extends FormGroupAbstractComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form.get(this.item.key).valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.item.options.map(element => {
        element.checked = this.checkdata(element.key, val);
        return element;
      });
    });
  }

  onCheckboxChange(e) {
    const value = this.form.get(this.item.key).value;
    let checked = value && value != '' ? value.split(',') : [];
    if (e.checked) {
      checked.push(e.source.value);
    } else {
      checked = checked.filter(res => res != e.source.value);
    }
    this.form.get(this.item.key).patchValue(checked.toString());
  }

  checkdata(key, checkboxValue) {
    const checked = checkboxValue && checkboxValue != '' ? checkboxValue.split(',') : [];
    return checked.indexOf(key.toString()) >= 0;
  }
}
