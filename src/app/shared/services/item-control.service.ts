import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { FormType } from '../models/form-type.model';

@Injectable({
  providedIn: 'root'
})
export class ItemControlService {
  constructor() { }

  /**
   * Xử lý tạo mới Form Group
   * @param items;
   */
  toFormGroup(items: FormType<any>[]) {
    const group: any = {};
    items.forEach(item => {
      if (item.controlType === 'template') { return; }
      const validate: ValidatorFn[] = [];
      if (item.max) {
        validate.push(Validators.max(Number(item.max)));
      }
      if (item.min) {
        validate.push(Validators.min(Number(item.min)));
      }
      if (item.maxLength) {
        validate.push(Validators.maxLength(Number(item.maxLength)));
      }
      if (item.minLength) {
        validate.push(Validators.minLength(Number(item.minLength)));
      }
      if (item.required) {
        validate.push(Validators.required);
      }
      if (item.updateOn === 'blur') {
        group[item.key] = new FormControl(item.value, { validators: validate, updateOn: 'blur' });
      } else if (item.updateOn === 'submit') {
        group[item.key] = new FormControl(item.value, { validators: validate, updateOn: 'submit' });
      } else {
        group[item.key] = new FormControl(item.value, validate);
      }
    });
    return new FormGroup(group);
  }

  /**
   * Xử lý tạo mới Form Group
   * @param items;
   */
  toAddFormGroup(items: FormType<any>[], form: FormGroup) {
    items.forEach(item => {
      this.addFromGroup(item, form);
    });
  }

  /**
   * Xử lý add FormControl
   * @param item;
   * @param form;
   */
  addFromGroup(item: any, form: FormGroup) {
    let group: any;
    const validate: ValidatorFn[] = [];
    if (item.max) {
      validate.push(Validators.max(Number(item.max)));
    }
    if (item.min) {
      validate.push(Validators.min(Number(item.min)));
    }
    if (item.maxLength) {
      validate.push(Validators.maxLength(Number(item.maxLength)));
    }
    if (item.minLength) {
      validate.push(Validators.minLength(Number(item.minLength)));
    }
    if (item.required) {
      validate.push(Validators.required);
    }
    group = new FormControl(item.value || '', validate);
    return form.addControl(item.key, group);
  }

  /**
   * Xử lý add hidden item FormControl
   * @param item;
   * @param form;
   */
  addHiddenFromGroup(item: FormType<string>, form: FormGroup) {
    const group = new FormControl(item.value || '');
    form.addControl(item.key, group);
  }

  /**
   * Xử lý add hidden item FormControl
   * @param key;
   * @param form;
   */
  addFromArrayGroup(key: string, form: FormGroup) {
    const group = new FormArray([]);
    return form.addControl(key, group);
  }
}
