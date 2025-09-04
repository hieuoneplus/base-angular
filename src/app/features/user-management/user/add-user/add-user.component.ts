
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { USER_NAME, EMPLOYEE_CODE, FUll_NAME, PHONE_NUMBER, EMAIL, A_TITLE, UNIT, ACTIVE_SLIDE, SELECTED_SEARCH_VALUE_ROLE } from 'src/app/features/data-form/user-data-form';
import { UserService } from '../../service/UserService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BUTTON_CANCEL, BUTTON_ADD, TYPE_BTN_FOOTER, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { IRoleContent } from '../../../model/role';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { displayedColumns } from 'src/app/public/constants-user';
import { MatTableDataSource } from '@angular/material/table';
import { IRequestPostUser } from 'src/app/features/model/user';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'add-user-page',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent extends ComponentAbstract {

  $userName = USER_NAME();
  $employeeCode = EMPLOYEE_CODE();
  $fullName = FUll_NAME();
  $phoneNumber = PHONE_NUMBER();
  $email = EMAIL();
  $aTitle = A_TITLE();
  $unit = UNIT();
  $activeSlide = ACTIVE_SLIDE();
  $selectedSearchValueRole = SELECTED_SEARCH_VALUE_ROLE();

  searchUserForm: FormGroup;
  searchRoleForm: FormGroup;

  isViewRole: boolean = false;

  displayedColumnsArr = displayedColumns;
  groupList: IRoleContent[] = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);
  selectedIndex = '0';

  requestPostUser: IRequestPostUser = {
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
    this.searchUserForm = this.fb.group({
      searchUser: ['']
    });
    this.searchRoleForm = this.fb.group({
      searchRole: ['']
    });
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD);

    this.trackOutputSearchUser();
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

  onSearchUser(searchUser: string) {
    this.indicator.showActivityIndicator();
    this.userService.getUserByUserName(searchUser.trim()).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.isViewRole = true;
        this.form.patchValue({
          username: searchUser,
          employeeCode: res.data.employeeCode,
          fullName: res.data.fullName,
          phoneNumber: res.data.mobileNumber,
          email: res.data.email,
          aTitle: res.data.jobName,
          unit: res.data.orgNameManage,
        })
        // this.searchRoleForm.reset();
        // this.dataSource = new MatTableDataSource([]);

      }
    }, error => {
      console.log("ERROR", error)
      this.isViewRole = false;
      this.form.patchValue({
        username: null,
        employeeCode: null,
        fullName: null,
        phoneNumber: null,
        email: null,
        aTitle: null,
        unit: null,
      })
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
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
    this.dformPaginationRole.goto(this.pageSize, this.pageIndex);
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
                return e.name.toString() === this.searchRoleForm.value.searchRole.toString();
              } else {
                return e.code.toString() === this.searchRoleForm.value.searchRole.toString();
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
        // const messsageError = ErrorUtils.getErrorMessage(error);
        // this.toastr.showToastr(
        //   messsageError.join('\n'),
        //   'Thông báo!',
        //   MessageSeverity.error,
        //   TOAST_DEFAULT_CONFIG
        // );
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

  modalAddUser() {
    console.log(this.form, "this.form");

    this.dialogService.dformconfirm({
      label: 'Thêm người dùng',
      title: 'Lý do',
      description: 'Nhập lý do thêm người dùng',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        const role = this.groupList.map(item => item.id);
        this.requestPostUser.roleIds = role
        this.requestPostUser.reason = result.data;
        this.requestPostUser.username = this.form.get('username')?.value
        this.requestPostUser.active = this.form.get('active')?.value

        console.log(this.requestPostUser, 'this.requestPostUser');
        this.indicator.showActivityIndicator();
        this.userService.postUsers(this.requestPostUser).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe({
          next: (res: any) => {
            if (res && res.status === 200) {
              this.goTo('/pmp_admin/admin/users');
              this.toastr.showToastr(
                `Thêm người dùng thành công`,
                'Thông báo!',
                MessageSeverity.success,
                TOAST_DEFAULT_CONFIG
              );
            } else {
              // this.toastr.showToastr(
              //   'Lỗi',
              //   'Thông báo!',
              //   MessageSeverity.error,
              //   TOAST_DEFAULT_CONFIG
              // );
            }
          },
          error: (error) => {
            // console.log("ERROR", error)
            // this.toastr.showToastr(
            //   `Thêm người dùng thất bại.`,
            //   'Thông báo!',
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
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.get('username')?.value) {
          this.modalAddUser()
        } else {
          this.toastr.showToastr(
            'Vui lòng nhập tên đăng nhập',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
        break;
    }
  }


  searchWait($event) {
    this.options.params.service = $event.index;
    this.searchRoleForm.patchValue({ searchRole: '' });
    this.onSearchRole('');
  }

  enableAssignRole = this.hasPermission(ModuleKeys.role, PermissionsActions.assign);
}
