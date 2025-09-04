import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { D_NUMBER_PHONE } from '../../constants';
import { turnAlphanumberic } from '../../utils/utils.function';

/**
 * check sđt mobie chỉ được nhập số và có số 0 đầu tiên
 * @description directive common for number input
 */

@Directive({
  selector: 'input[dformItem], textarea[dformItem]'
})
export class FormNunberPhoneDirective {
  phone = /[^0-9]*/g;
  @Input() libDiretiveItem: any;

  constructor(private _el: ElementRef,
              private control: NgControl) { }

  @HostListener('paste', ['$event']) onPaste(event: KeyboardEvent) {
  }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    if (this.libDiretiveItem === D_NUMBER_PHONE) {
      const initalValue = this._el.nativeElement.value;
      if (initalValue.length === 1) {
        this._el.nativeElement.value = turnAlphanumberic(this._el.nativeElement.value, /^[^0]*/g);
      } else {
        this._el.nativeElement.value = turnAlphanumberic(this._el.nativeElement.value, this.phone);
        this.control?.control?.setValue(turnAlphanumberic(this._el.nativeElement.value, this.phone));
      }
    }
  }
}
