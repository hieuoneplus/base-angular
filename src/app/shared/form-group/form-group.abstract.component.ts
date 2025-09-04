import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IFormControls } from '../models/form-control.model';
import { FormType } from '../models/form-type.model';
import * as _ from 'lodash';

@Directive()
export abstract class FormGroupAbstractComponent {
  get f(): IFormControls { return this.form.controls; }
  @Input()
  item!: FormType<string>;
  @Input()
  form!: FormGroup;

  constructor() {}

  /**
   * Xử lý valid input
   * @param formGroup
   * @param controlName
   * @returns
   */
  public static isInvalidInput(formGroup: FormGroup, controlName: string): boolean {
    if (formGroup == null) {
      return false;
    }
    const control = formGroup.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.invalid;
  }

  /**
   * Xử lý kiểm tra valid control
   * @param controlName
   * @param error
   * @returns
   */
  isValidControl(controlName: string, error: string = '') {
    const control = this.f[controlName];
    if (!error) { return control?.touched && control?.invalid; }
    return control?.touched && control.hasError(error);
  }

  /**
   * Xử lý kiểm tra valid input date
   * @param controlName
   * @param error
   * @returns
   */
  isValidControlDate(controlName: string, error: string = '') {
    const control = this.f[controlName];
    // Kiểm tra nếu có 2 lỗi thì hiển thị 1 lỗi
    if (_.values(control.errors).length > 1 && control.hasError('matDatepickerParse')) {
      if (error === 'matDatepickerParse') {
        if (!error) { return control?.touched && control?.invalid; }
        return control?.touched && control.hasError(error);
      }
      return false;
    } else {
      if (!error) { return control?.touched && control?.invalid; }
      return control?.touched && control.hasError(error);
    }
  }

  /**
   * Xử lý kiểm tra custom validate của item
   * @param controlName
   * @param error
   * @returns
   */
  isValidCustom(controlName: string, error: string | string[] = '') {
    const control = this.f[controlName];
    // Kiểm tra nếu có lỗi khác thì không hiển thị lỗi custom nữa
    if (typeof error === 'string') {
      if (_.values(control.errors).length > 1) {
        return { key: false, value: '' };
      }
      if (!error) return { key: control.touched && control.invalid, value: '' };
      return { key: control?.touched && control.hasError(error), value: error == 'customMesegeError' ? control.errors.errorValue : error };
    } else {
      let err;
      let isErr = 0;
      error.forEach(val => {
        if (control?.touched && control.hasError(val)) {
          err = { key: true, value: val == 'customMesegeError' ? control.errors.errorValue : val };
          isErr++;
        }
      });
      const errorLength = _.values(control.errors).filter((x: boolean) => x == true).length;
      if (errorLength > 1 && isErr != errorLength) {
        return { key: false, value: '' };
      }
      return err ? err : { key: control.touched && control.invalid, value: '' };
    }
  }

  /**
   *  Xử lý kiểm tra custom validate của input
   * @param formGroup
   * @param controlName
   * @returns
   */
  public isValidInput(formGroup: FormGroup, controlName: string): boolean {
    if (formGroup == null) {
      return false;
    }
    const control = formGroup.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && !control.invalid;
  }
}
