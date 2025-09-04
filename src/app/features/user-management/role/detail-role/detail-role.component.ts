import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract } from '@shared-sm';
import { MatTableDataSource } from '@angular/material/table';
import {
  BUTTON_EDIT,
  BUTTON_UNDO,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { RoleService } from '../../service/RoleService';
import {
  IModuleChildren,
  IModulePermission,
  IRoleDetail,
} from 'src/app/features/model/role';
import { displayedColumns } from '../constant';
import {
  GENERAL_CONFIG_MODULE_KEYS,
  ModuleKeys,
  NAPAS_MODULE_KEYS,
  PermissionsModuleName,
  ROUTING_CONFIG_FAST_MODULE_KEYS,
  ROUTING_CONFIG_MODULE_KEYS,
  ROUTING_CONFIG_REGULAR_MODULE_KEYS,
  TRANSFER_CHANNEL_ACH_KEYS,
  TRANSFER_CHANNEL_BILATERAL_KEY,
  TRANSFER_CHANNEL_CITAD_KEYS,
  TRANSFER_CHANNEL_INHOUSE,
  USER_MODULE_KEYS,
} from 'src/app/public/module-permission.utils';

@Component({
  selector: 'detail-role-page',
  templateUrl: './detail-role.component.html',
  styleUrls: ['./detail-role.component.scss'],
})
export class DetailRoleComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumns;
  detail: IRoleDetail;
  modules: IModulePermission[] = [];
  constructor(
    protected injector: Injector,
    private roleService: RoleService) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.role);

    this.getDetailRole().then(() => {
      if (this.enableUpdate && this.detail.type!= "ADMIN")
        this.listButton = this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT);
      else
        this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    });
  }


  getDetailRole(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.indicator.showActivityIndicator();

      this.roleService.inquiry(this.queryParams.role).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(
        (res) => {
          if (res && res.status === 200) {
            this.detail = res.data ;
            this.mapModulePermissionDataTable();
          }
          resolve();
        },
        (error) => {
          this.dialogService.error({
            title: 'dialog.notification',
            message: error.error.soaErrorDesc ? error.error.soaErrorDesc : 'Lỗi hệ thống.'
          }, () => {});
          reject(error);
        }
      );
    });
  }

  mapModulePermissionDataTable() {
    this.modules = [];
    const permissions = this.detail.permissions;
    const keys = Object.keys(permissions);

    // Khởi tạo các nhóm menu chính với header mặc định
    const moduleGroups: Record<string, { children: IModuleChildren[], header?: IModuleChildren[] }> = {
      userManagement: { children: [] },
      generalManagement: { children: [] },
      routingConfigManagement: { children: [], header: [] },
      routingConfigRegular: { children: [], header: [{ key: 'routing_regular', name: 'Cấu hình định tuyến các kênh chuyển tiền thường', type: 'menu', permissions: [] }] },
      routingConfigFast: { children: [], header: [{ key: 'routing_fast', name: 'Cấu hình định tuyến kênh chuyển tiền nhanh 247', type: 'menu', permissions: [] }] },
      transferChannelAchManagement: { children: [], header: [{ key: 'ACH', name: 'ACH', type: 'menu', permissions: [] }] },
      transferChannelCITADManagement: { children: [], header: [{ key: 'CITAD', name: 'CITAD', type: 'menu', permissions: [] }] },
      transferChannelBilateral: { children: [], header: [{ key: 'BILATERAL', name: 'SONG PHƯƠNG', type: 'menu', permissions: [] }] },
      transferChannelInhouse: { children: [], header: [{ key: 'INHOUSE TRANSFER', name: 'INHOUSE TRANSFER', type: 'menu', permissions: [] }] },
      transferChannelNapas: { children: [], header: [{ key: 'NAPAS 2.0', name: 'NAPAS 2.0', type: 'menu', permissions: [] }] },
    };

    // DANH SÁCH MODULE GÁN QUYỀN
    const pushPermissionToGroup = (key: string, permission: IModuleChildren) => {
      if (USER_MODULE_KEYS.includes(key)) moduleGroups.userManagement.children.push(permission);
      if (GENERAL_CONFIG_MODULE_KEYS.includes(key)) moduleGroups.generalManagement.children.push(permission);
      if (ROUTING_CONFIG_MODULE_KEYS.includes(key)) moduleGroups.routingConfigManagement.children.push(permission);
      if (ROUTING_CONFIG_REGULAR_MODULE_KEYS.includes(key)) moduleGroups.routingConfigRegular.children.push(permission);
      if (ROUTING_CONFIG_FAST_MODULE_KEYS.includes(key)) moduleGroups.routingConfigFast.children.push(permission);
      if (TRANSFER_CHANNEL_ACH_KEYS.includes(key)) moduleGroups.transferChannelAchManagement.children.push(permission);
      if (TRANSFER_CHANNEL_CITAD_KEYS.includes(key)) moduleGroups.transferChannelCITADManagement.children.push(permission);
      if (TRANSFER_CHANNEL_BILATERAL_KEY.includes(key)) moduleGroups.transferChannelBilateral.children.push(permission);
      if (TRANSFER_CHANNEL_INHOUSE.includes(key)) moduleGroups.transferChannelInhouse.children.push(permission);
      if (NAPAS_MODULE_KEYS.includes(key)) moduleGroups.transferChannelNapas.children.push(permission);
    }

    for (const key of keys) {
      const keyName = key.replace(/-/g, '_');
      const permission: IModuleChildren = {
        key,
        name: PermissionsModuleName[keyName],
        permissions: permissions[key]
      };
      pushPermissionToGroup(key, permission);
    }

    if (moduleGroups.routingConfigRegular.children.length > 0) {
      moduleGroups.routingConfigManagement.children.push(...moduleGroups.routingConfigRegular.header!, ...moduleGroups.routingConfigRegular.children);
    }
    if (moduleGroups.routingConfigFast.children.length > 0) {
      moduleGroups.routingConfigManagement.children.push(...moduleGroups.routingConfigFast.header!, ...moduleGroups.routingConfigFast.children);
    }

    if (moduleGroups.userManagement.children.length > 0) {
      this.modules.push({
        moduleName: 'Quản trị người dùng',
        key: 'user_management',
        children: moduleGroups.userManagement.children
      });
    }
    if (moduleGroups.generalManagement.children.length > 0) {
      this.modules.push({
        moduleName: 'Cấu hình chung',
        key: 'general_config_management',
        children: moduleGroups.generalManagement.children
      });
    }
    if (moduleGroups.routingConfigManagement.children.length > 0) {
      this.modules.push({
        moduleName: 'Cấu hình định tuyến Routing',
        key: 'routing_config_management',
        children: moduleGroups.routingConfigManagement.children
      });
    }

    const transferChannelChildren = [
      ...(moduleGroups.transferChannelAchManagement.children.length > 0 ? [...moduleGroups.transferChannelAchManagement.header!, ...moduleGroups.transferChannelAchManagement.children] : []),
      ...(moduleGroups.transferChannelCITADManagement.children.length > 0 ? [...moduleGroups.transferChannelCITADManagement.header!, ...moduleGroups.transferChannelCITADManagement.children] : []),
      ...(moduleGroups.transferChannelBilateral.children.length > 0 ? [...moduleGroups.transferChannelBilateral.header!, ...moduleGroups.transferChannelBilateral.children] : []),
      ...(moduleGroups.transferChannelInhouse.children.length > 0 ? [...moduleGroups.transferChannelInhouse.header!, ...moduleGroups.transferChannelInhouse.children] : []),
      ...(moduleGroups.transferChannelNapas.children.length > 0 ? [...moduleGroups.transferChannelNapas.header!, ...moduleGroups.transferChannelNapas.children] : []),
    ];

    if (transferChannelChildren.length > 0) {
      this.modules.push({
        moduleName: 'Cấu hình các kênh chuyển tiền',
        key: 'transfer_channel_management',
        children: transferChannelChildren
      });
    }

    if (this.modules.length > 0) {
      this.onSelectModule(this.modules[0]);
    }
  }


  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/admin/roles');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('/pmp_admin/admin/roles/edit', { id: this.queryParams.role });
        break;
    }
  }

  // Biến lưu trữ mục được chọn
  selectedModuleItem: string | null = null;

  // Hàm để thay đổi mục được chọn
  onSelectModule(item: IModulePermission): void {
    if (this.isSelectedModule(item)) return;

    this.selectedModuleItem = item.key;
    this.hasDataSource = true;
    this.dataSource = new MatTableDataSource(item.children);
  }

  // Kiểm tra mục nào đang được chọn
  isSelectedModule(item: IModulePermission): boolean {
    return this.selectedModuleItem === item.key;
  }

  onSelectPermission(item: IModulePermission) {
    console.log('onSelectPermission', item);
  }

  isChecked(item: IModuleChildren, action: string) {
    console.log(item, action);

    let isSelected = false;
    item.permissions.forEach((p) => {
      if (p.action === action) {
        isSelected = p.selected
        return;
      }
    })
    return isSelected;
  }

  getRowColor(element: IModuleChildren) {
    return element.type === 'menu' ? '#F7F8FA' : 'none';
  }

  isDisplayCheckboxAction(item: IModuleChildren, action: string) {
    const id = item.permissions.find(p => p.action === action)?.id;
    return item.type !== 'menu' && !!id;
  }

  getRoleTypeName() {
    return this.roleService.getRoleTypeName(this.detail?.type);
  }
}
