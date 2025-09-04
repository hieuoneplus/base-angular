import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { turnAlphanumberic } from '../../utils/utils.function';
import { D_TEXT } from './../../constants';

/**
 * nhập liệu text
 * @description directive common for number input
 */

@Directive({
  selector: 'input[dformItem], textarea[dformItem]'
})
export class FormTextDirective {
  characterPrevention = /[^A-Za-z ]/g;
  // D_NUMBER_AND_TEXT_ROLE_CODE = /[^A-Za-z0-9-_]*$/;
  @Input() dformItem: any;

  // tslint:disable-next-line:variable-name
  constructor(private _el: ElementRef,
              private control: NgControl) { }

  @HostListener('paste', ['$event']) onPaste(event: KeyboardEvent) {
  }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    if (this.dformItem === D_TEXT) {
      this._el.nativeElement.value = turnAlphanumberic(this._el.nativeElement.value, this.characterPrevention);
      this.control?.control?.setValue(turnAlphanumberic(this._el.nativeElement.value, this.characterPrevention));
    }

    //  if (this.dformItem === 'roleCode') {
    //   this._el.nativeElement.value = turnAlphanumberic(this._el.nativeElement.value, this.D_NUMBER_AND_TEXT_ROLE_CODE);
    //   this.control?.control?.setValue(turnAlphanumberic(this._el.nativeElement.value, this.D_NUMBER_AND_TEXT_ROLE_CODE));
    // }
  }
}
