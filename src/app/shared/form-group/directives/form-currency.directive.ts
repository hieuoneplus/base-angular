import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { D_CURRENCY } from './../../constants';

/**
 * nhập liệu text
 * @description directive common for number input
 */

@Directive({
  selector: 'input[dformItem], textarea[dformItem]'
})
export class FormCurrencyDirective {
  private thousandSeperator = ',';
  private decimalPoint = '.';
  @Input() libDiretiveItem: any;

  constructor(private _el: ElementRef,
              private control: NgControl) { }

  @HostListener('paste', ['$event']) onPaste(event: KeyboardEvent) {
  }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    if (this.libDiretiveItem === D_CURRENCY) {
      if (!event) {
        return;
      }
      this._el.nativeElement.value = this._el.nativeElement.value.replace(/\./g, '');
      const initalValue = this._el.nativeElement.value;
      this._el.nativeElement.value = initalValue.replace(/[^0-9,]*/g, '');
      if (initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      } else {
        const cursorPositionToEnd = this._el.nativeElement.value.length - this._el.nativeElement.selectionStart;
        this._el.nativeElement.value = this.formatInput(this._el.nativeElement.value);
        const cursorPosition = this._el.nativeElement.value.length - cursorPositionToEnd;
        if (this._el.nativeElement.value[cursorPosition - 1] === this.thousandSeperator) {
          this._el.nativeElement.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        } else {
          this._el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    }
  }

  private formatInput(value: string): string {
    if (!value) return '';
    value = value.toString().replace(new RegExp(this.thousandSeperator, 'g'), '');
    const parts = value.split(this.decimalPoint);
    if (Number(parts[0]) == 0) {
      parts[0] = '0';
    } else if (parts[0].startsWith('0')) {
      parts[0] = parts[0].substring(1);
    }
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeperator);
    if (parts[1]) {
      parts[1] = parts[1].length > 2 ? parts[1].slice(0, 2) : parts[1];
    }
    return parts.join(this.decimalPoint);
  }
}
