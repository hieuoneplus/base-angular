
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, LocalStoreEnum, MessageSeverity } from '@shared-sm';
import { IProfile, IUserContent } from 'src/app/features/model/user';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../service/UserService';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { AuthService } from '../../auth/service/AuthService';

@Component({
  selector: 'my-profile-page',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'stt', 'roleCode', 'roleType', 'name',
  ];

  userDetail: IProfile;

  constructor(
    protected injector: Injector,
    private userService: UserService,
    private authService: AuthService,
    ) {
    super(injector);
  }

  protected componentInit(): void {
    this.getDetailUser();
    this.getBilateralUser();
  }

  getBilateralUser() {
    this.authService.getBilateralUser().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => { })
    ).subscribe((res) => {
      if (res && res.status == 200) {
        console.log("========= GET BILATERAL USER ========", res.data);
        this.localStore.saveSessionData(res.data, LocalStoreEnum.Bilateral_User_Infor);
      } else {

      }
    }, (error) => {
      console.log("error", error);

    });
  }

  getDetailUser() {
    this.indicator.showActivityIndicator();
    
    this.userService.me().pipe(
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

      }
    }, error => {
      console.log("ERROR", error)
      this.toastr.showToastr(
        `Lấy thông tin thất bại`,
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

}
