
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { USER_NAME, EMPLOYEE_CODE, FUll_NAME, PHONE_NUMBER, EMAIL, A_TITLE, UNIT, ACTIVE_SLIDE, SELECTED_SEARCH_VALUE_ROLE } from 'src/app/features/data-form/user-data-form';
import { UserService } from '../../service/UserService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BUTTON_CANCEL, BUTTON_EDIT, TYPE_BTN_FOOTER, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { displayedColumns, displayedColumnsSelect } from 'src/app/public/constants-user';
import { MatTableDataSource } from '@angular/material/table';
import { IRequestPostUser, IUserContentRole } from 'src/app/features/model/user';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'edit-user-page',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent extends ComponentAbstract {

  $userName = USER_NAME();
  $employeeCode = EMPLOYEE_CODE();
  $fullName = FUll_NAME();
  $phoneNumber = PHONE_NUMBER();
  $email = EMAIL();
  $aTitle = A_TITLE();
  $unit = UNIT();
  $activeSlide = ACTIVE_SLIDE();
  $selectedSearchValueRole = SELECTED_SEARCH_VALUE_ROLE();

  searchRoleForm: FormGroup;

  isViewRole: boolean = false;

  displayedColumnsArr = displayedColumns;
  displayedColumnsArrSelect = displayedColumnsSelect;
  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  activeData: boolean = false;

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);
  groupListChangeInitialization: IUserContentRole[] = [];
  selectedIndex = '0';

  requestPuttUser: IRequestPostUser = {
    username: '',
    roleIds: ['role1', 'role2'],
    active: true,
    reason: ''
  };


  constructor(
    protected injector: Injector,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$userName, this.$employeeCode, this.$fullName, this.$phoneNumber, this.$email, this.$aTitle, this.$unit, this.$activeSlide, this.$selectedSearchValueRole
    ]);
    this.searchRoleForm = this.fb.group({
      searchRole: ['']
    });
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_EDIT);

    this.trackOutputSearchUser();
    this.getUserDetail();
  }

  trackOutputSearchUser() {
    this.$userName.readOnly = true;
    this.$employeeCode.readOnly = true;
    this.$fullName.readOnly = true;
    this.$phoneNumber.readOnly = true;
    this.$email.readOnly = true;
    this.$aTitle.readOnly = true;
    this.$unit.readOnly = true;
  }

  getUserDetail() {
    this.indicator.showActivityIndicator();
    this.userService.getUserDetail(this.queryParams?.idUserNameEdit).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.isViewRole = true;
        this.form.patchValue({
          username: res.data.username,
          employeeCode: res.data.employeeCode,
          fullName: res.data.fullName,
          phoneNumber: res.data.phoneNumber,
          email: res.data.email,
          aTitle: res.data.jobName,
          unit: res.data.orgName,
          active: res.data.active,
        })
        this.activeData = res.data.active;
        if (res.data.roles && res.data.roles.length > 0) {
          res.data.roles.forEach((element: any) => {
            element.isChecked = true;
            if (!this.groupListChangeInitialization.some(item => item.roleId === element.roleId)) {
              this.groupListChangeInitialization.push(element);
            }
          });
          this.groupList = this.groupListChangeInitialization
          this.groupList = this.getTransformedGroupList(this.groupList)
        } else {
          this.groupList = []
        }
        this.onSearchRole('');
      }
    }, error => {
      console.log("ERROR", error)
      this.isViewRole = false;
      this.dialogService.error({
        title: 'dialog.notification',
        message: error.error.soaErrorDesc ? error.error.soaErrorDesc : 'Lỗi hệ thống.'
      }, resp => { });
    });
  }

  getTransformedGroupList(groupList: any[]): any[] {
    let stt = 0;
    return groupList.map((role) => {
      stt++;
      return {
        stt,
        active: role.isChecked,
        code: role.roleCode,
        id: role.roleId.toString(),
        isChecked: role.isChecked,
        name: role.roleName,
        type: role.roleType,
        permissions: {
          role: role.roleId,
        },
      };
    });
  }

  onSearchRole(searchRole: string) {
    this.pageIndex = 0;
    this.pageSize = 10;
    if (this.form.get('selectedSearchValueRole')?.value === 'name') {
      this.options = {
        params: Object.assign(
          {
            active: true,
            name: searchRole.trim(),
            page: this.pageIndex,
            size: this.pageSize,
            service: this.selectedIndex
          })
      };
    } else {
      this.options = {
        params: Object.assign(
          {
            active: true,
            code: searchRole.trim(),
            page: this.pageIndex,
            size: this.pageSize,
            service: this.selectedIndex
          })
      };

    }
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  handleGetRoleByRoleName() {
    this.indicator.showActivityIndicator();
    this.userService.getRoles(this.options.params).pipe(
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
        if (this.options.params.service.toString() === '0') {
          data.forEach((e: any) => {
            const roleExists = this.groupList.some(item => item.id === e.id);
            e.isChecked = roleExists
          });
          this.dataSource = new MatTableDataSource(data);
        } else {
          if (this.searchRoleForm.value.searchRole === '') {
            this.groupList.forEach((e: any, index: number) => {
              e.stt = index + 1;
            });
            this.dataSource = new MatTableDataSource(this.groupList);
          } else {
            const filteredGroupList = this.groupList.filter((e: any) => {
              if (this.form.get('selectedSearchValueRole')?.value === 'name') {
                return e.name.toString() === this.searchRoleForm?.value?.searchRole.toString();
              } else {
                return e.code.toString() === this.searchRoleForm?.value?.searchRole.toString();
              }
            });
            filteredGroupList.forEach((e: any, index: number) => {
              e.stt = index + 1;
            });
            this.dataSource = new MatTableDataSource(filteredGroupList);
          }
        }
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
        this.dialogService.error({
          title: 'dialog.notification',
          message: res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.'
        }, resp => {
          if (res) {
          }
        });
      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log("ERROR", error)
      this.dialogService.error({
        title: 'dialog.notification',
        message: error.error.soaErrorDesc ? error.error.soaErrorDesc : 'Lỗi hệ thống.'
      }, resp => { });
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
    this.handleGetRoleByRoleName();
  }

  onChange() {
    // if (this.checked) {
    //   this.dataSource.data.forEach((element: any) => {
    //     element.isChecked = true;
    //     if (!this.groupList.some(item => item.id === element.id)) {
    //       this.groupList.push(element);
    //     }
    //   });
    // } else {
    //   this.dataSource.data.forEach((element: any) => {
    //     element.isChecked = false;
    //     this.groupList = [];
    //   });
    // }

    // this.dataSource = new MatTableDataSource(this.groupList)
  }

  onChangeRegister(element: any) {
    if (element.isChecked) {
      if (!this.groupList.some(item => item.id === element.id)) {
        this.groupList.push({
          ...element, stt: this.groupList.length + 1
        });
      }
    } else {
      const index = this.groupList.findIndex(item => item.id === element.id);
      if (index > -1) {
        this.groupList.splice(index, 1);
      }
      let stt = 0;
      this.groupList = this.groupList.map((r) => {
        stt++;
        return {
          ...r,
          stt
        };
      });
    }
    if (this.options.params.service.toString() === '0') {
      this.dataSource.data.forEach((e: any) => {
        const roleExists = this.groupList.some(item => item.id === e.id);
        e.isChecked = roleExists
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      if (this.searchRoleForm.value.searchRole === '') {
        this.groupList.forEach((e: any, index: number) => {
          e.stt = index + 1;
        });
        this.dataSource = new MatTableDataSource(this.groupList);
      } else {
        const filteredGroupList = this.groupList.filter((e: any) => {
          if (this.form.get('selectedSearchValueRole')?.value === 'name') {
            return e.name.toString() === this.searchRoleForm?.value?.searchRole.toString();
          } else {
            return e.code.toString() === this.searchRoleForm?.value?.searchRole.toString();
          }
        });
        filteredGroupList.forEach((e: any, index: number) => {
          e.stt = index + 1;
        });
        this.dataSource = new MatTableDataSource(filteredGroupList);
      }
    }
  }

  modalEditUser() {
    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa người dùng',
      title: 'Lý do',
      description: 'Nhập lý do chỉnh sửa người dùng',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        const role = this.groupList.map(item => item.id);
        this.requestPuttUser.roleIds = role
        this.requestPuttUser.reason = result.data;
        this.requestPuttUser.username = this.form.get('username')?.value
        this.requestPuttUser.active = this.form.get('active')?.value
        this.indicator.showActivityIndicator();
        this.userService.putUsers(this.requestPuttUser, this.queryParams?.idUserNameEdit).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe({
          next: (res: any) => {
            if (res && res.status === 200) {
              this.goTo('/pmp_admin/admin/users');
              this.toastr.showToastr(
                `Chỉnh sửa người dùng thành công`,
                'Thông báo!',
                MessageSeverity.success,
                TOAST_DEFAULT_CONFIG
              );
            }
          },
          error: (error) => {
            console.log("ERROR", error)
            const messsageError = ErrorUtils.getErrorMessage(error);
            this.toastr.showToastr(
              messsageError.join('\n'),
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          },
        });

      }
    })
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/admin/users');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        if (this.hasGroupListChangeInitializationd() || this.form.get('active')?.value !== this.activeData) {
          this.modalEditUser()
        }
        break;
    }
  }

  hasGroupListChangeInitializationd(): boolean {
    const groupListDataSourceIds = this.groupList.map((item: any) => item.id.toString());
    const groupListChangeInitializationIds = this.groupListChangeInitialization.map((item: any) => item.roleId.toString());
    const hasChanged = !this.arraysEqual(groupListDataSourceIds, groupListChangeInitializationIds);

    return hasChanged;
  }

  arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }

  searchWait($event) {
    this.options.params.service = $event.index
    this.searchRoleForm.patchValue({ searchRole: '' });
    this.onSearchRole('');
  }
}
