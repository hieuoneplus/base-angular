import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import {
  CATEGORY,
  CODE,
  ACTIVE_SLIDE,
  SUB_PRODUCT_SLIDE,
  SUBPRODUCT,
} from 'src/app/features/data-form/whitelist-categories-form';
import {
  BUTTON_CANCEL,
  BUTTON_ADD,
  TYPE_BTN_FOOTER,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
} from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WhitelistCategoriesService } from '../../services/whitelist-categories';
import { IRequestPostWhitelistCategory } from 'src/app/features/model/citad';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'add-special-account-page',
  templateUrl: './add-whitelist-categories.component.html',
  styleUrls: ['./add-whitelist-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWhitelistCategoriesComponent extends ComponentAbstract {
  $category = CATEGORY();
  $code = CODE();
  $subProduct = SUBPRODUCT();
  $subProductSlide = SUB_PRODUCT_SLIDE();
  $activeSlide = ACTIVE_SLIDE();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  isValid: boolean = true;
  validInputMap: Map<string, boolean> = new Map();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);

  constructor(
    protected injector: Injector,
    private whitelistCategoriesService: WhitelistCategoriesService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.trackInputAddWhitelist();
    this.form = this.itemControl.toFormGroup([
      this.$activeSlide,
      this.$category,
      this.$code,
      this.$subProduct,
      this.$subProductSlide,
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD);
  }

  trackInputAddWhitelist() {
    this.$category.required = true;
    this.$activeSlide.required = true;
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

  modalAddWhitelistCategory() {
    if (this.form.valid && this.checkInputMap(this.validInputMap)) {
      this.dialogService.dformconfirm(
        {
          label: 'Thêm mới Category ',
          title: 'Lý do',
          description: 'Nhập lý do thêm mới Category',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          maxLength: 1024,
        },
        (result: any) => {
          if (result && result.data.length > 1024) {
            this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          } else
          if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPostWhitelistCategory = {
              category: values.category.trim(),
              code: values.code.trim(),
              subProduct: values.subProduct.trim(),
              active: values.activeSlide,
              deleted: null,
              subProductRequired: values.subProductSlide,
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.whitelistCategoriesService
              .postWhitelistCategories(body)
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
                      'Thêm mới cấu hình thành công',
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
                  const messsageError = ErrorUtils.getErrorMessage(error);
                  this.toastService.showToastr(
                    messsageError.join('\n'),
                    'Thông báo!',
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
        this.modalAddWhitelistCategory();
        break;
    }
  }
}
