import { PageEvent } from '@angular/material/paginator';
import { Directive, Injector, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { DformPaginationPlusComponent } from '../dform-pagination-plus/dform-pagination-plus.component';
import { HttpOptions } from '../models/request.base.dto';
import { APPROVER, MAKER } from './../constants';
import { ComponentBaseAbstract } from './component.base.abstract';
import { Observable, of } from 'rxjs';
import { BtnFooter } from '../services/model/footer.dto';
import { LocalStoreEnum } from '../enum/local-store.enum';
import { IUserPermissions } from 'src/app/features/model/auth';
import { PermissionsActions } from 'src/app/public/module-permission.utils';
import { DformPaginationRoleComponent } from '../dform-pagination-role/dform-pagination-role.component';

@Directive()
export abstract class ComponentAbstract extends ComponentBaseAbstract {

  public currenUser;
  public queryParams: Params;
  public isMaker: boolean;
  public isChecker: boolean;
  public isApprover: boolean;
  public options: HttpOptions;

  public enableView: boolean;
  public enableInsert: boolean;
  public enableUpdate: boolean;
  public enableDelete: boolean;
  public enableRetry: boolean;
  public enableApprove: boolean;
  public enableReply: boolean;

  // Khai báo cho role
  public roles;
  public typeInput = MAKER;
  public typeApprover = APPROVER;

  // Khai báo cho table
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pagePage', { static: true }) dformPagination: DformPaginationPlusComponent;
  @ViewChild('pagePageRole') dformPaginationRole: DformPaginationRoleComponent;

  public dataSource: MatTableDataSource<any>;
  hasDataSource = false;
  public pageSize = 10;
  public pageIndex = 0;
  public totalItem = 0;

  listButton = new Observable<BtnFooter[]>();

  constructor(protected injector: Injector) {
    super(injector);
  }

  initData() {
    this.getBilateralRoleUser();
    this.route.queryParams.subscribe((queryParams: Params) => {
      try {
        this.queryParams = queryParams;
        this.componentInit();
      } catch (e) {
        this.goTo404();
      }
    });
  }

  protected abstract componentInit(): void;

  protected initRole(typeInput: string, typeApprover: string) {
    this.typeInput = typeInput;
    this.typeApprover = typeApprover;
  }

  goTo(state: string, params?: any, replaceUrl?: boolean, relativeTo?: ActivatedRoute) {
    replaceUrl = replaceUrl == null ? false : replaceUrl;
    this.router.navigate([state], { queryParams: params, relativeTo, replaceUrl });
  }

  goTo404() {
    this.router.navigate(['error'], { replaceUrl: true });
  }

  back() {
    window.history.back();
  }

  protected cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Auto scroll to control validate false
   */
  scrollIntoViewErrorValidate() {
    const element = document.querySelector('.error');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  listButtonDynamic(status: string, ...list): Observable<any[]> {
    return of(list.filter(res => !res.status || (res.status && res.status.includes(status))));
  }

  private getBilateralRoleUser() {
    this.isMaker = true;
    this.isApprover = false;

    // Lấy thông tin quyền user
    this.currenUser = this.localStore.getData(LocalStoreEnum.Bilateral_User_Infor);
    console.log("LOAD BILATERL USER", this.currenUser)
    if (this.currenUser?.roles) {
      const listMaker = this.currenUser.roles.filter(x => x.toUpperCase() === this.typeInput);
      const listApprover = this.currenUser.roles.filter(x => x.toUpperCase() === this.typeApprover);
      const admin = this.currenUser.roles.filter(x => x.toUpperCase() === "ADMIN");
      this.isMaker = listMaker.length > 0 && listApprover.length == 0;
      this.isApprover = listApprover.length > 0;
      this.isChecker = listApprover.length > 0;
      if (admin.length > 0) {
        this.isMaker = false;
        this.isApprover = true;
        this.isChecker = false;
      }
      this.roles = this.currenUser.roles || [];
    }
    if (this.currenUser === null) {
    }
  }

  enableActions(module: string) {
    this.enableView = this.hasPermission(module, PermissionsActions.view);
    this.enableUpdate = this.hasPermission(module, PermissionsActions.update);
    this.enableInsert = this.hasPermission(module, PermissionsActions.insert);
    this.enableDelete = this.hasPermission(module, PermissionsActions.delete);
    this.enableRetry = this.hasPermission(module, PermissionsActions.retry);
    this.enableApprove = this.hasPermission(module, PermissionsActions.approve);
    this.enableReply = this.hasPermission(module, PermissionsActions.reply);
  }

  hasPermission(module: string, action: string) {
    const permissions: IUserPermissions[] = this.localStore.getData(LocalStoreEnum.pmp_permissions);
    const has = permissions.findIndex(p => p.module === module && p.actions.includes(action)) !== -1;
    // console.log(`has permission ${module} ${action} = ${has}`);
    return has;
  }
}
