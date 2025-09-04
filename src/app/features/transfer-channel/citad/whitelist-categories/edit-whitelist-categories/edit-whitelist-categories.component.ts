import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  CATEGORY,
  CODE,
  ACTIVE_SLIDE,
  SUB_PRODUCT_SLIDE,
  SUBPRODUCT,
} from 'src/app/features/data-form/whitelist-categories-form';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import {
  BUTTON_CANCEL,
  TYPE_BTN_FOOTER,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from 'src/app/public/constants';
import { PageEvent } from '@angular/material/paginator';
import { WhitelistCategoriesService } from '../../services/whitelist-categories';
import { IRequestPutWhitelistCategory } from 'src/app/features/model/citad';
import { IWhitelistCategoryContent } from 'src/app/features/model/citad';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
@Component({
  selector: 'edit-special-account-page',
  templateUrl: './edit-whitelist-categories.component.html',
  styleUrls: ['./edit-whitelist-categories.component.scss'],
})
export class EditWhitelistCategoriesComponent extends ComponentAbstract {
  whitelistDetail: IWhitelistCategoryContent;

  $category = CATEGORY();
  $code = CODE();
  $subProduct = SUBPRODUCT();
  $subProductSlide = SUB_PRODUCT_SLIDE();
  $activeSlide = ACTIVE_SLIDE();

  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();
  validInputMap: Map<string, boolean> = new Map();

  constructor(
    protected injector: Injector,
    protected toastService: ToastService,
    protected whitelistCategoriesService: WhitelistCategoriesService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.trackEditWhitelistCategory();
    this.getWhitelistCategoryDetail();
    this.form = this.itemControl.toFormGroup([
      this.$category,
      this.$code,
      this.$activeSlide,
      this.$subProduct,
      this.$subProductSlide,
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE);
  }
  handleRestrictSpecialChars(content: string): boolean {
    const field = this.form.get(content).value;
    var isInvalidContent: boolean =   /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<.>\/?]/.test(field) ||
      /[\x0A\x0D]/.test(field);
      this.validInputMap[content]=!isInvalidContent
    return isInvalidContent
  }
  checkInputMap(mapInput: Map<string, boolean>): boolean {
    return mapInput["category"]&&mapInput["code"]&& mapInput["subProduct"]
  }
  trackEditWhitelistCategory() {
    this.$category.required = true;
    this.$activeSlide.required = true;
  }

  getWhitelistCategoryDetail() {
    this.indicator.showActivityIndicator();

    this.whitelistCategoriesService
      .getWhitelistCategoryDetail(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.whitelistDetail = res.data;
            this.form.patchValue({
              category: res.data.category,
              code: res.data.code,
              subProduct: res.data.subProduct,
              activeSlide: res.data.active,
              subProductSlide: res.data.subProductRequired,
            });

            this.hasDataSource = true;
          }
        },
        (error) => {
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error
          );
        }
      );
  }

  saveWhitelistCategory() {
    if (this.form.valid && this.checkInputMap(this.validInputMap)) {
      this.dialogService.dformconfirm(
        {
          label: 'Chỉnh sửa Cấu hình Category List',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa Cấu hình Category List',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          maxLength: 1024
        },
        (result: any) => {
          if (result && result.data.length > 1024) {
            this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          } else
          if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPutWhitelistCategory = {
              category: values.category?.trim() || '', 
            code: values.code?.trim() || '', 
            subProduct: values.subProduct?.trim() || '', 
              active: values.activeSlide,
              deleted: null,
              subProductRequired: values.subProductSlide,
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.whitelistCategoriesService
              .putWhitelistCategories(body, this.queryParams.id)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.indicator.hideActivityIndicator())
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Chỉnh sửa cấu hình thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo(
                      '/pmp_admin/transfer-channel/citad/whitelist-categories'
                    );
                  }
                },
                (error) => {
                  const errMessage = ErrorUtils.getErrorMessage(error);
                  this.toastService.showToastr(
                    errMessage.join('\n'),
                    'Thông báo',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              );
          }
        }
      );
    } else if (!this.form.valid) {
      this.toastr.showToastr(
        'Category bắt buộc nhập',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.saveWhitelistCategory();
        break;
    }
  }
}
