import { AfterViewInit, Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityIndicatorSingletonService, HttpClientService, IFormControls, ItemControlService, LocalStoreManagerService, ToastService } from '@shared-sm';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { DformDialogService } from '../dform-dialogs/dialog.service';

@Directive()
export abstract class ComponentBaseAbstract implements OnInit, AfterViewInit, OnDestroy {

  get f(): IFormControls { return this.form.controls; }
  public form: FormGroup = new FormGroup({});
  public formDirty = false;
  public ngUnsubscribe = new Subject();
  public baseData;

  // Khai báo injector các service
  protected translateService: TranslateService;
  protected dialogService: DformDialogService;
  protected dialog: MatDialog;
  protected httpClient: HttpClientService;
  protected itemControl: ItemControlService;
  protected indicator: ActivityIndicatorSingletonService;
  protected localStore: LocalStoreManagerService;
  protected router: Router;
  protected route: ActivatedRoute;
  protected toastr: ToastService;
  
  protected constructor(protected injector: Injector) {
    this.translateService = injector.get(TranslateService);
    this.dialogService = injector.get(DformDialogService);
    this.dialog = injector.get(MatDialog);
    this.httpClient = injector.get(HttpClientService);
    this.itemControl = injector.get(ItemControlService);
    this.indicator = injector.get(ActivityIndicatorSingletonService);
    this.localStore = injector.get(LocalStoreManagerService);
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.toastr = injector.get(ToastService);
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    this.afterView();
  }

  protected initData(): void { }

  protected afterView(): void { }

  // Validate input required.
  public isInvalidInput(formGroup: FormGroup, controlName: string): boolean {
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
   * Kiểm tra control đã valid chưa
   * @param controlName;
   * @param error;
   */
  public isValidControl(controlName: string, error: string = null) {
    const control = this.f[controlName];
    if (!error) { return control?.touched && control?.invalid; }
    return control?.touched && control.hasError(error);
  }


  /**
   * Xử lý set data vào form
   * @param formData
   */
  protected patchValue(formData) {
    this.form.patchValue(formData);
    this.baseData = this.form.getRawValue();
  }


  // Validate all fields in FormGroup
  protected validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        control.markAsTouched();
        Object.keys(control.controls).forEach((formArr: any) => {
          const formGroupArr = control.controls[formArr] as FormGroup;
          Object.keys(formGroupArr.controls).forEach(fieldArr => {
            const controlArr = formGroupArr.get(fieldArr);
            if (controlArr instanceof FormArray) {
              controlArr.markAsTouched();
              if (controlArr.controls && controlArr.controls.length > 0) {
                controlArr.controls.forEach(element => {
                  if (element instanceof FormGroup) {
                    this.validateAllFields(element);
                  }
                });
              }
            }
            if (controlArr instanceof FormControl) {
              if (controlArr.value && typeof controlArr.value === 'string' && controlArr.value?.trim() != controlArr.value) {
                controlArr.setValue(controlArr.value.trim());
              }
              controlArr.markAsTouched({
                onlySelf: true
              });
            } else if (controlArr instanceof FormGroup) {
              this.validateAllFields(controlArr);
            }
          });
        });

      }
      if (control instanceof FormControl) {
        if (control.value && typeof control.value === 'string' && control.value?.trim() != control.value) {
          control.setValue(control.value.trim());
        }
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }


  // Validate all fields in FormGroup
  protected clearAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.clearValidators();
      control.updateValueAndValidity();
    });
  }

  // Add requei all fields in FormGroup
  protected updateRequiredAllFields(formGroup: FormGroup, configForm: any[]) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      const formItem = configForm.find(x => x.key == field);
      if (formItem && formItem.required) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      }
    });
  }

  /**
   * Xử lý map giá trị list checkbox
   * @param lstCheckbox;
   * @param lstValue;
   */
  protected pathValueCheckBox(lstCheckbox: any[], lstValue: any[]) {
    lstCheckbox.map(x => {
      x.checked = lstValue.indexOf(x.key) >= 0 ? true : false;
    });
  }

  // Validate input required.
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

  /**
   * Xử lý so sánh 2 object
   * @param job: object so sánh thứ nhất
   * @param jobN: object so sánh thứ 2
   */
  protected jsonObjEqual(job: any, jobN: any): boolean {
    return _.isEqual(JSON.stringify(job), JSON.stringify(jobN));
  }

  /**
   * Kiểm tra tồn tại object
   * @param object;
   */
  protected isExistObject(object) {
    return _.isEmpty(object);
  }

  /**
   * Compare data
   * @param x
   * @param y
   * @returns
   */
  compareArrayObject(x: any, y: any) {
    return _.isEqual(JSON.stringify(x), JSON.stringify(y));
  }

  /**
   * Xử lý destroy data trên component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.destroyData();
  }

  protected destroyData(): void { }
}
