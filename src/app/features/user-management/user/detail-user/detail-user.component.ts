
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, LocalStoreEnum, MessageSeverity } from '@shared-sm';
import { UserService } from '../../service/UserService';
import { IUserContent } from 'src/app/features/model/user';
import { MatTableDataSource } from '@angular/material/table';
import { BUTTON_EDIT, BUTTON_UNDO, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'detail-user-page',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})

export class DetailUserComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'stt', 'roleCode', 'roleType', 'name',
  ];

  userDetail: IUserContent;
  // userNameLoCal: string

  constructor(
    protected injector: Injector,
    private userService: UserService) {
    super(injector);
  }

  protected componentInit(): void {
    // this.userNameLoCal = localStorage.getItem(LocalStoreEnum.USER_NAME);
    this.enableActions(ModuleKeys.user);
    if (this.enableUpdate)
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT);
    else {
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    }
    this.getDetailUser();
  }

  getDetailUser() {
    this.indicator.showActivityIndicator();

    this.userService.getUserDetail(this.queryParams.user).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.userDetail = res.data;
        if (this.userDetail.roles) {
          this.hasDataSource = true;
          const rolesData = this.userDetail.roles.map((obj, index) => {
            return {
              ...obj,
              stt: index + 1
            };
          })
          this.dataSource = new MatTableDataSource(rolesData);
          this.totalItem = rolesData.length;
        }
        // if (res.data.username === this.userNameLoCal) {
        //   this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
        // }
      }
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


  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/admin/users');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('/pmp_admin/admin/users/edit', { idUserNameEdit: this.queryParams.user });
        break;
    }
  }
}
