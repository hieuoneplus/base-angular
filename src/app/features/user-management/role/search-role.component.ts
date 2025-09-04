import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { ROLE_CODE, ROLE_NAME, STATUS_ROLE, TYPE_ROLE_SELECT } from '../../data-form/role-data-form';
import { IPutRoleBody, IRoleContent } from '../../model/role';
import { RoleService } from '../service/RoleService';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'search-role-page',
  templateUrl: './search-role.component.html',
  styleUrls: ['./search-role.component.scss']
})
export class SearchRoleComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'roleCode', 'roleType', 'roleName', 'status', 'actions'
  ];

  // For search

  $roleCode = ROLE_CODE();
  $roleName = ROLE_NAME();
  $roleType = TYPE_ROLE_SELECT();
  $status = STATUS_ROLE();


  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private roleService: RoleService) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.role);
    this.form = this.itemControl.toFormGroup([
      this.$roleCode, this.$roleName, this.$roleType, this.$status
    ]);
    this.search();
  }


  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {}),
    )
    this.options = {
      params: {
        ...params,
        page: this.pageIndex,
        size: this.pageSize,
        sort: 'updatedAt:DESC'
      }
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();

    this.roleService.getRoles(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.content.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });
        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log("ERROR", error)
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
        page: this.pageIndex,
        sort: 'updatedAt:DESC'
      }
    };
    this.QueryData();
  }

  onClickCreateRole() {
    this.goTo('/pmp_admin/admin/roles/add')
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/admin/roles/detail', { role: element.id });
  }

  editRole(element) {
    this.goTo('/pmp_admin/admin/roles/edit', { id: element.id });
  }


  onClickChangeStatus(event: MatSlideToggleChange, element: IRoleContent) {
    console.log(event, element);
    const newStatus = event.checked;
    const onOff = !newStatus ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái vai trò`;
    this.dialogService.dformconfirm({
      label: `${ON_OFF} trạng thái vai trò`,
      title: 'Lý do',
      description: description,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
    }, (result) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {

        const keys = Object.keys(element.permissions);
        const permissionIds = [];
        for (const key of keys) {
          element.permissions[key].forEach(p => {
            permissionIds.push(p.id)
          });
        }
        console.log("permissionIds", element.permissions, permissionIds);

        const body: IPutRoleBody = {
          active: newStatus,
          reason: result.data,
          name: element.name,
          description: element.description,
          permissionIds: permissionIds
        }
        console.log("BODY", body);

        this.roleService.updateRole(body, element.id).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          console.log("RESPONSE", res)
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.toastr.showToastr(
              `Chuyển trạng thái vai trò thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
          } else {
            event.source.checked = !newStatus;
            this.toastr.showToastr(
              `Chuyển trạng thái vai trò thất bại`,
              res.soaErrorCode,
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        }, error => {
          event.source.checked = !newStatus;
          console.log("ERROR-500", error);
          // const message = error.error && error?.error?.soaErrorDesc ? error?.error?.soaErrorDesc : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
          // this.toastr.showToastr(
          //   `Chuyển trạng thái vai trò thất bại`,
          //   message,
          //   MessageSeverity.error,
          //   TOAST_DEFAULT_CONFIG
          // );
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

  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  getRoleTypeName(element: IRoleContent) {
    return this.roleService.getRoleTypeName(element.type);
  }

}
