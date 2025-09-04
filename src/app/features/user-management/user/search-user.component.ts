import { Component, Injector } from '@angular/core';
import { ComponentAbstract, LocalStoreEnum, MessageSeverity } from '@shared-sm';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { FUll_NAME, ROLES_SELECT, STATUS_USER, USER_NAME, ROLE_NAME } from '../../data-form/user-data-form';
import { UserService } from '../service/UserService';
import { IGetRolesParams } from '../../model/role';
import { IRequestPutUser, IUserContent } from '../../model/user';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
@Component({
  selector: 'search-user-page',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'userName', 'employeeCode', 'fullName', 'role', 'status', 'actions'
  ];

  // For search

  $userName = USER_NAME();
  $fullName = FUll_NAME();
  $status = STATUS_USER();
  $role = ROLES_SELECT();
  $roleName = ROLE_NAME();


  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  // userName: string

  constructor(
    protected injector: Injector,
    private userService: UserService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    // this.userName = localStorage.getItem(LocalStoreEnum.USER_NAME);
    this.enableActions(ModuleKeys.user);
    this.form = this.itemControl.toFormGroup([
      this.$userName, this.$fullName, this.$roleName, this.$status, this.$role,
    ]);
    this.search();
    this.getRoles()
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign(
        {},
        Object.entries(this.form.value).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {}),
        {
          page: this.pageIndex,
          size: this.pageSize,
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.userService.getUsers(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.content.map((obj, index) => {
          obj.stt = page + index + 1;

          return {
            ...obj,
            rolesText: obj.roles ? obj.roles.map(o => { return o.roleCode + ' - ' + o.roleName }).join(";") : ""
          };
        });
        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
       
      }
      this.dataSource.sort = this.sort;
    }, error => {
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex
      }
    };
    this.QueryData();
  }

  getRoles() {
    const paramsRoles: IGetRolesParams = {
      page: 0,
      size: 1000,
    }
    this.indicator.showActivityIndicator();
    this.userService.getRoles(paramsRoles).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        const roleSelectOptions = res.data.content.map(role => {
          return {
            value: role.code,
            key: role.code,
          }
        });

        this.$role.options = roleSelectOptions;
      } else {

      }
    }, error => {

    });
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: IUserContent) {
    const newStatus = event.checked;
    const onOff = !newStatus ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái người dùng`;

    this.dialogService.dformconfirm({
      label: `${ON_OFF} trạng thái người dùng`,
      title: 'Lý do',
      description: description,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
    }, (result) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        const body: IRequestPutUser = {
          reason: result.data,
          active: newStatus,
        }
        this.userService.putUsers(body, element.id).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          // Gọi API thành công và có data trả về
          // this.QueryData();
          if (res && res.status === 200) {

            this.toastr.showToastr(
              `Chuyển trạng thái người dùng thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            // if (res.data.username === this.userName) {

            // }
          } else {
            event.source.checked = !newStatus;
            this.toastr.showToastr(
              `Chuyển trạng thái người dùng thất bại`,
              res.soaErrorDesc,
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        }, error => {
          event.source.checked = !newStatus;
          const messsageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        });
      } else {
        //RESET STATUS 
        event.source.checked = !newStatus;
      }
    })
  }

  onSwitchAddUser() {
    this.goTo('/pmp_admin/admin/users/add');
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/admin/users/detail', { user: element.id });
  }

  onClickDelete(element) {
    this.dialogService.dformconfirm({
      title: 'Lý do',
      description: 'Nhập lý do xóa người dùng',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {

      }
    })

  }

  onClickEdit(element) {
    this.goTo('/pmp_admin/admin/users/edit', { idUserNameEdit: element.id });
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }
}
