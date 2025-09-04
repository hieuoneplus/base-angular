import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';

import { MatTableDataSource } from '@angular/material/table';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  ICreateRoleBody,
  IModuleChildren,
  IModulePermission,
  IPermission,
  IPutRoleBody,
  IRoleDetail,
  IRolePermission,
} from 'src/app/features/model/role';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { IConfirmModel } from 'src/app/shared/dform-dialogs';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from '../../../../public/constants';
import * as roleData from '../../../data-form/role-data-form';
import { RoleService } from '../../service/RoleService';
import {
  BUTTON_BACK,
  BUTTON_CREATE_ROLE,
  BUTTON_UPDATE_ROLE,
  displayedColumns,
} from '../constant';

@Component({
  selector: 'add-role-page',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumns;
  $roleCode = roleData.ROLE_CODE();
  $roleName = roleData.ROLE_NAME();
  $roleSelectType = roleData.TYPE_ROLE_SELECT_CREATE();
  $activityStatus = roleData.ACTIVITY_STATUS();
  $description = roleData.DESCRIPTION();

  isEdit: boolean = false;
  modules: IModulePermission[] = [];
  selectedPermissionIds: number[] = [];
  detail: IRoleDetail = null;

  appPermissions: IPermission[] = [];

  constructor(protected injector: Injector, private roleService: RoleService) {
    super(injector);
  }

  protected componentInit(): void {
    this.isEdit = !!this.queryParams.id;

    this.handleActionState();
    this.dataSource = new MatTableDataSource([]);

    if (this.isEdit) {
      this.getDetailRole();
    } else {
      this.getAllPermissions();
    }
    this.tracking();
  }

  tracking() {
    this.form.get('type').valueChanges.subscribe((newType) => {
      this.onChaneRoleType(newType);
    });
  }

  handleActionState() {
    this.handleCreateForm();
    if (this.isEdit) {
      this.listButton = this.listButtonDynamic(
        '',
        BUTTON_BACK,
        BUTTON_UPDATE_ROLE
      );
    } else {
      this.listButton = this.listButtonDynamic(
        '',
        BUTTON_BACK,
        BUTTON_CREATE_ROLE
      );
    }
  }

  handleCreateForm() {
    this.$roleCode.required = true;
    this.$roleName.required = true;
    this.$roleSelectType.required = true;
    // this.$description.required = true;
    if (this.isEdit) {
      this.$roleSelectType.readOnly = true;
    }
    this.form = this.itemControl.toFormGroup([
      this.$roleCode,
      this.$roleName,
      this.$roleSelectType,
      this.$activityStatus,
      this.$description,
    ]);
  }

  getDetailRole() {
    this.indicator.showActivityIndicator();

    this.roleService
      .inquiry(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.detail = res.data;
            this.mappingDetailToFormValue();
            this.selectedPermissionDetail();

            this.getAllPermissions(this.detail.type);
          }
        },
        (error) => {
          const messsageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }

  selectedPermissionDetail() {
    // mapping trạng thái selected của detail vào module quyền hiển thị
    const permissions = this.detail.permissions;
    const keys = Object.keys(permissions);
    for (const key of keys) {
      const modulePermissions: IRolePermission[] = permissions[key];
      modulePermissions.map((p) => {
        if (p.selected) {
          this.selectedPermissionIds.push(p.id);
        }
      });
    }
  }

  mappingDetailToFormValue() {
    const data: any = {
      code: this.detail.code,
      name: this.detail.name,
      active: this.detail.active,
      type: this.detail.type,
      description: this.detail.description,
    };
    this.form.patchValue(data);
    this.form.get('code').disable();
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/admin/roles');
        break;
      case TYPE_BTN_FOOTER.TYPE_CREATE:
        this.createRole();
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.confirmUpdateRole();
        break;
    }
  }

  getAllPermissions(type?: string) {
    this.indicator.showActivityIndicator();
    this.roleService
      .getPermissions()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.appPermissions = res.data;
            if (type) {
              this.onChaneRoleType(type);
            }
          }
        },
        (error) => { }
      );
  }

  onChaneRoleType(type: string) {
    const permissionByType = this.appPermissions.filter((p) => {
      return p.type === type && this.hasPermission(p.module, p.action);
    });
    console.log('permissionByType', permissionByType);
    this.mappingModulePermissions(permissionByType);
  }

  createRole() {
    // validate form

    if (this.selectedPermissionIds.length === 0) {
      this.toastr.showToastr(
        'Vui lòng gán tối thiểu 01 quyền cho vai trò',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const dataConfirm: IConfirmModel = {
        label: 'Thêm mới vai trò',
        title: 'Lý do',
        description: 'Lý do thêm mới vai trò',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      };
      this.dialogService.dformconfirm(dataConfirm, (result) => {
        if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.callCreateRole(result.data);
        }
      });
      // end
    }
  }

  callCreateRole(reason: string) {
    //
    const values = this.form.value;
    const body: ICreateRoleBody = {
      code: values.code.trim(),
      name: values.name.trim(),
      type: values.type,
      description: values.description ? values.description.trim() : null,
      active: values.active,
      permissionIds: this.selectedPermissionIds,
      reason: reason,
    };

    this.indicator.showActivityIndicator();
    this.roleService
      .createRole(body)
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
              `Thêm vai trò thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            this.goTo('/pmp_admin/admin/roles');
          }
        },
        (error) => {
          const messsageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }

  confirmUpdateRole() {
    // validate form
    if (this.selectedPermissionIds.length === 0) {
      this.toastr.showToastr(
        'Vui lòng gán tối thiểu 01 quyền cho vai trò',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const dataConfirm: IConfirmModel = {
        label: 'Chỉnh sửa vai trò',
        title: 'Lý do',
        description: 'Lý do cập nhật vai trò',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      };
      this.dialogService.dformconfirm(dataConfirm, (result) => {
        if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.callUpdateRole(result.data);
        }
      });
      // end
    }
  }

  callUpdateRole(reason: string) {
    //
    const values = this.form.value;
    const body: IPutRoleBody = {
      name: values.name.trim(),
      description: values.description ? values.description.trim() : null,
      active: values.active,
      permissionIds: this.selectedPermissionIds,
      reason: reason,
    };

    this.indicator.showActivityIndicator();
    this.roleService
      .updateRole(body, this.queryParams.id)
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
              `Chỉnh sửa vai trò thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            this.goTo('/pmp_admin/admin/roles');
          }
        },
        (error) => {
          const messsageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }

  mappingModulePermissions(permissions: IPermission[]) {
    this.modules = [];
    this.selectedModuleItem = null;
    this.hasDataSource = false;
    this.dataSource = new MatTableDataSource([]);

    this.mappingUserModulePermissions(permissions);
    this.mappingGeneralModulePermissions(permissions);
    this.mappingRoutingPermissions(permissions);
    this.mappingTransferChannelPermissions(permissions);
    // TODO mapping them module khac

    if (this.modules.length > 0) this.onSelectModule(this.modules[0]);
  }

  // mapping Quản trị user
  mappingUserModulePermissions(permissions: IPermission[]) {
    const moduleUserPermissions: IModuleChildren[] = [];
    const usersP = permissions.filter((p) => ModuleKeys.user === p.module);
    const rolesP = permissions.filter((p) => ModuleKeys.role === p.module);
    const permissionP = permissions.filter(
      (p) => ModuleKeys.permission === p.module
    );
    //

    if (usersP.length > 0)
      moduleUserPermissions.push({
        key: ModuleKeys.user,
        name: 'Quản lý người dùng',
        permissions: usersP.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (rolesP.length > 0)
      moduleUserPermissions.push({
        key: ModuleKeys.role,
        name: 'Quản lý vai trò',
        permissions: rolesP.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (permissionP.length > 0)
      moduleUserPermissions.push({
        key: ModuleKeys.permission,
        name: 'Danh sách quyền',
        permissions: permissionP.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (moduleUserPermissions.length > 0)
      this.modules.push({
        moduleName: 'Quản trị người dùng',
        key: 'user_management',
        children: moduleUserPermissions,
      });
  }

  // mapping Cấu hình các kênh chuyển tiền
  mappingTransferChannelPermissions(permissions: IPermission[]) {
    const transferChannelPermissions: IModuleChildren[] = [];

    // ACH
    const achTktg = permissions.filter(
      (p) => ModuleKeys.ach_tktg_config === p.module
    );
    const achCommon = permissions.filter(
      (p) => ModuleKeys.ach_common_config === p.module
    );

    if (achTktg.length > 0 || achCommon.length > 0) {
      transferChannelPermissions.push({
        key: 'ACH',
        name: 'ACH',
        type: 'menu',
        permissions: [],
      });
    }

    if (achTktg.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.ach_tktg_config,
        name: 'Cấu hình tài khoản chung gian ACH',
        permissions: achTktg.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (achCommon.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.ach_common_config,
        name: 'Cấu hình chung ACH',
        permissions: achCommon.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    // CITAD
    const citadGw = permissions.filter(
      (p) => ModuleKeys.citad_gateway === p.module
    );
    const citadConfig = permissions.filter(
      (p) => ModuleKeys.citad_config === p.module
    );
    const citadTransactionAbbreviation = permissions.filter(
      (p) => ModuleKeys.citad_transaction_abbreviation === p.module
    );
    const citadRefundPattern = permissions.filter(
      (p) => ModuleKeys.citad_refund_pattern === p.module
    );
    const citadPartnerPattern = permissions.filter(
      (p) => ModuleKeys.citad_partner_pattern === p.module
    );
    const citadHoldReceiverAccount = permissions.filter(
      (p) => ModuleKeys.citad_hold_receiver_account === p.module
    );
    const citadHoldReceiverNamePattern = permissions.filter(
      (p) => ModuleKeys.citad_hold_receiver_name_pattern === p.module
    );
    const citadAccountParameter = permissions.filter(
      (p) => ModuleKeys.citad_account_parameter === p.module
    );
    const citadBlacklistAccounts = permissions.filter(
      (p) => ModuleKeys.citad_blacklist_accounts === p.module
    );
    const citadWhitelistAccounts = permissions.filter(
      (p) => ModuleKeys.citad_whitelist_accounts === p.module
    );
    const citadWhitelistCategories = permissions.filter(
      (p) => ModuleKeys.citad_whitelist_categories === p.module
    );
    const citadStateTreasury = permissions.filter(
      (p) => ModuleKeys.citad_state_treasuries === p.module
    );
    const citadTransactionsIn = permissions.filter(
      (p) => ModuleKeys.citad_transactions_inward === p.module
    );
    const citadTransactionsOut = permissions.filter(
      (p) => ModuleKeys.citad_transactions_outward === p.module
    );
    const wireTransferErrorMessages = permissions.filter(
      (p) => ModuleKeys.wire_transfer_error_messages === p.module
    );
    const citadTransactionReplacement = permissions.filter(
      (p) => ModuleKeys.citad_transaction_replacement === p.module
    );

    if (
      citadGw.length > 0 ||
      citadConfig.length > 0 ||
      citadTransactionAbbreviation.length > 0 ||
      citadRefundPattern.length > 0 ||
      citadPartnerPattern.length > 0 ||
      citadHoldReceiverAccount.length > 0 ||
      citadHoldReceiverNamePattern.length > 0 ||
      citadAccountParameter.length > 0 ||
      citadBlacklistAccounts.length > 0 ||
      citadWhitelistAccounts.length > 0 ||
      citadWhitelistCategories.length > 0 ||
      citadStateTreasury.length > 0 ||
      citadTransactionsIn.length > 0 ||
      citadTransactionsOut.length > 0 ||
      wireTransferErrorMessages.length > 0 ||
      citadTransactionReplacement.length > 0

    ) {
      transferChannelPermissions.push({
        key: 'CITAD',
        name: 'CITAD',
        type: 'menu',
        permissions: [],
      });
    }

    if (citadGw.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_gateway,
        name: 'Cấu hình bật/tắt cổng CITAD',
        permissions: citadGw.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    // if (citadConfig.length > 0) {
    //   transferChannelPermissions.push({
    //     key: ModuleKeys.citad_config,
    //     name: 'Cấu hình CITAD',
    //     permissions: citadConfig.map((p) => {
    //       return {
    //         id: p.id,
    //         action: p.action,
    //         selected: false,
    //       };
    //     }),
    //   });
    // }

    if (citadTransactionAbbreviation.length > 0) {
      //Cấu hình từ điển viết tắt
      transferChannelPermissions.push({
        key: ModuleKeys.citad_transaction_abbreviation,
        name: 'Cấu hình từ điển viết tắt',
        permissions: citadTransactionAbbreviation.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadRefundPattern.length > 0) {
      // cấu hình dấu hiệu hoàn tra
      transferChannelPermissions.push({
        key: ModuleKeys.citad_refund_pattern,
        name: 'Cấu hình dấu hiệu hoàn trả',
        permissions: citadRefundPattern.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadPartnerPattern.length > 0) {
      // Cấu hình dấu hiệu tài khoản thu hộ định danh
      transferChannelPermissions.push({
        key: ModuleKeys.citad_partner_pattern,
        name: 'Cấu hình dấu hiệu tài khoản thu hộ định danh',
        permissions: citadPartnerPattern.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadHoldReceiverAccount.length > 0) {
      // Cấu hình tài khoản không được phép ghi có tự động vào tài khoản trung gian
      transferChannelPermissions.push({
        key: ModuleKeys.citad_hold_receiver_account,
        name: 'Cấu hình tài khoản không đủ điều kiện AUTO treo',
        permissions: citadHoldReceiverAccount.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadHoldReceiverNamePattern.length > 0) {
      // Cấu hình dấu hiệu tên người nhận không được phép ghi có tự động vào tài khoản trung gian
      transferChannelPermissions.push({
        key: ModuleKeys.citad_hold_receiver_name_pattern,
        name: 'Cấu hình tên DV hưởng không đủ điều kiện AUTO treo',
        permissions: citadHoldReceiverNamePattern.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadAccountParameter.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_account_parameter,
        name: 'Cấu hình tài khoản tham số điện hoàn trả',
        permissions: citadAccountParameter.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadBlacklistAccounts.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_blacklist_accounts,
        name: 'Cấu hình tài khoản không được ghi có tự động',
        permissions: citadBlacklistAccounts.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadWhitelistAccounts.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_whitelist_accounts,
        name: 'Cấu hình tài khoản được ghi có tự động',
        permissions: citadWhitelistAccounts.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadWhitelistCategories.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_whitelist_categories,
        name: 'Cấu hình category được phép ghi có tự động',
        permissions: citadWhitelistCategories.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }
    if (citadStateTreasury.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_state_treasuries,
        name: 'Cấu hình tài khoản ghi có kho bạc nhà nước',
        permissions: citadStateTreasury.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadTransactionsOut.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_transactions_outward,
        name: 'Quản lý giao dịch đi',
        permissions: citadTransactionsOut.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (citadTransactionsIn.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_transactions_inward,
        name: 'Quản lý giao dịch đến',
        permissions: citadTransactionsIn.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (wireTransferErrorMessages.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.wire_transfer_error_messages,
        name: 'Retry message lỗi',
        permissions: wireTransferErrorMessages.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }
    if (citadTransactionReplacement.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.citad_transaction_replacement,
        name: 'Cấu hình replace ký tự đặc biệt',
        permissions: citadTransactionReplacement.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    // SONG PHUONG
    const bilateral = permissions.filter(
      (p) => ModuleKeys.bilateral === p.module
    );

    if (bilateral.length > 0) {
      transferChannelPermissions.push({
        key: 'BILATERAL',
        name: 'SONG PHUONG',
        type: 'menu',
        permissions: [],
      });
      transferChannelPermissions.push({
        key: ModuleKeys.bilateral,
        name: 'Quản lý Song Phương',
        permissions: bilateral.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    // INHOUSE TRANSFER
    const inhouse = permissions.filter(
      (p) => ModuleKeys.inhouse_transfer_channel_state === p.module
    );
    const t24Protection = permissions.filter(p => ModuleKeys.inhouse_config === p.module);
    if (inhouse.length > 0 || t24Protection.length > 0) {
      transferChannelPermissions.push({
        key: 'INHOUSE TRANSFER',
        name: 'INHOUSE TRANSFER',
        type: 'menu',
        permissions: [],
      })
    }

    if (inhouse.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.inhouse_transfer_channel_state,
        name: 'Cấu hình bật/tắt luồng hạch toán GD BĐB vào T24',
        permissions: inhouse.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    }

    if (t24Protection.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.inhouse_config,
        name: 'Cấu hình tham số bảo vệ T24',
        permissions: t24Protection.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    //NAPAS
    const napas_ibft_reconcile_dispute = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_dispute === p.module);
    const napas_ibft_reconcile_transaction = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_transaction === p.module);
    // const napas_ibft_reconcile_charge_credit = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_charge_credit === p.module);
    const napas_ibft_reconcile_transaction_flag = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_transaction_flag === p.module);
    // const napas_ibft_reconcile_return = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_return === p.module);
    // const napas_ibft_reconcile_additional_accounting_config = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_additional_accounting === p.module);
    const napas_ibft_reconcile_flag_report = permissions.filter(p => ModuleKeys.napas_ibft_reconcile_flag_report === p.module);

    // if (napas_ibft_reconcile_dispute.length > 0 || napas_ibft_reconcile_transaction.length > 0 || napas_ibft_reconcile_charge_credit.length > 0 || napas_ibft_reconcile_transaction_flag.length > 0 || napas_ibft_reconcile_additional_accounting_config.length > 0 || napas_ibft_reconcile_flag_report.length > 0) {
    //   transferChannelPermissions.push({
    //     key: 'NAPAS 2.0',
    //     name: 'NAPAS 2.0',
    //     type: 'menu',
    //     permissions: [],
    //   })
    // }
    if (napas_ibft_reconcile_dispute.length > 0 || napas_ibft_reconcile_transaction.length > 0 || napas_ibft_reconcile_transaction_flag.length > 0) {
      transferChannelPermissions.push({
        key: 'NAPAS 2.0',
        name: 'NAPAS 2.0',
        type: 'menu',
        permissions: [],
      })
    }

    if (napas_ibft_reconcile_dispute.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.napas_ibft_reconcile_dispute,
        name: 'Quản lý giao dịch tra soát',
        permissions: napas_ibft_reconcile_dispute.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    if (napas_ibft_reconcile_transaction.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.napas_ibft_reconcile_transaction,
        name: 'Tra cứu thông tin giao dịch',
        permissions: napas_ibft_reconcile_transaction.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    // if (napas_ibft_reconcile_charge_credit.length > 0) {
    //   transferChannelPermissions.push({
    //     key: ModuleKeys.napas_ibft_reconcile_charge_credit,
    //     name: 'Quản lý thông tin báo có',
    //     permissions: napas_ibft_reconcile_charge_credit.map(p => {
    //       return {
    //         id: p.id,
    //         action: p.action,
    //         selected: false,
    //       }
    //     }),
    //   })
    // }

    if (napas_ibft_reconcile_transaction_flag.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.napas_ibft_reconcile_transaction_flag,
        name: 'Cấu hình dựng cờ giao dịch chiều về',
        permissions: napas_ibft_reconcile_transaction_flag.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    // if (napas_ibft_reconcile_return.length > 0) {
    //   transferChannelPermissions.push({
    //     key: ModuleKeys.napas_ibft_reconcile_return,
    //     name: 'Cấu hình giao dịch hoàn trả',
    //     permissions: napas_ibft_reconcile_return.map(p => {
    //       return {
    //         id: p.id,
    //         action: p.action,
    //         selected: false,
    //       }
    //     }),
    //   })
    // }

    // if (napas_ibft_reconcile_additional_accounting_config.length > 0) {
    //   transferChannelPermissions.push({
    //     key: ModuleKeys.napas_ibft_reconcile_additional_accounting,
    //     name: 'Quản lý yêu cầu hạch toán bổ sung',
    //     permissions: napas_ibft_reconcile_additional_accounting_config.map(p => {
    //       return {
    //         id: p.id,
    //         action: p.action,
    //         selected: false,
    //       }
    //     }),
    //   })
    // }

    if (napas_ibft_reconcile_flag_report.length > 0) {
      transferChannelPermissions.push({
        key: ModuleKeys.napas_ibft_reconcile_flag_report,
        name: 'Quản lý file và thông tin đối soát',
        permissions: napas_ibft_reconcile_flag_report.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
    }

    console.log('transferChannelPermissions', transferChannelPermissions);
    if (transferChannelPermissions.length > 0) {
      this.modules.push({
        moduleName: 'Cấu hình các kênh chuyển tiền',
        key: 'transfer_channel_management',
        children: transferChannelPermissions,
      });
    }
  }

  // mapping Cấu hình định tuyến routing
  mappingRoutingPermissions(permissions: IPermission[]) {
    const moduleRoutingPermissions: IModuleChildren[] = [];
    const blacklist = permissions.filter(
      (p) => ModuleKeys.routing_blacklist === p.module
    );
    const whitelist = permissions.filter(
      (p) => ModuleKeys.routing_whitelist === p.module
    );
    const transferChannelBankConfig = permissions.filter(
      (p) => ModuleKeys.routing_transfer_channel_bank_config === p.module
    );
    const routingChannelConfig = permissions.filter(
      (p) => ModuleKeys.routing_channel_config === p.module
    );
    const routingChannelLimit = permissions.filter(
      (p) => ModuleKeys.routing_channel_limit === p.module
    );
    //

    if (blacklist.length > 0)
      moduleRoutingPermissions.push({
        key: ModuleKeys.routing_blacklist,
        name: 'Cấu hình blacklist',
        permissions: blacklist.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (whitelist.length > 0)
      moduleRoutingPermissions.push({
        key: ModuleKeys.routing_whitelist,
        name: 'Cấu hình whitelist',
        permissions: whitelist.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (transferChannelBankConfig.length > 0)
      moduleRoutingPermissions.push({
        key: ModuleKeys.routing_transfer_channel_bank_config,
        name: 'Cấu hình định tuyến mã ngân hàng và CardBin',
        permissions: transferChannelBankConfig.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (routingChannelConfig.length > 0)
      moduleRoutingPermissions.push({
        key: ModuleKeys.routing_channel_config,
        name: 'Danh sách kênh chuyển tiền định tuyến',
        permissions: routingChannelConfig.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    if (routingChannelLimit.length > 0)
      moduleRoutingPermissions.push({
        key: ModuleKeys.routing_channel_limit,
        name: 'Cấu hình định mức chuyển tiền',
        permissions: routingChannelLimit.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });

    //Cấu hình định tuyến chuyển tiền thường
    const condition = permissions.filter(
      (p) => ModuleKeys.switching_condition === p.module
    );
    const accounts = permissions.filter(
      (p) => ModuleKeys.switching_credit_inter_accounts === p.module
    );
    const amount = permissions.filter(
      (p) => ModuleKeys.switching_transaction_amount === p.module
    );
    if (condition.length > 0 || accounts.length > 0 || amount.length > 0) {
      moduleRoutingPermissions.push({
        key: 'ROUTING_REGULAR',
        name: 'Cấu hình định tuyến chuyển tiền thường',
        type: 'menu',
        permissions: [],
      });
      if (amount.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.switching_transaction_amount,
          name: 'Cấu hình số tiền giao dịch',
          permissions: amount.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });

      if (condition.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.switching_condition,
          name: 'Cấu hình điều kiện định tuyến',
          permissions: condition.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });

      if (accounts.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.switching_credit_inter_accounts,
          name: 'Cấu hình tài khoản trung gian ghi có',
          permissions: accounts.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });
    }

    //Cấu hình định tuyến chuyển tiền nhanh 247
    const errors = permissions.filter(
      (p) => ModuleKeys.error_configs === p.module
    );
    const total_transactions = permissions.filter(
      (p) => ModuleKeys.total_transactions === p.module
    );
    const switching_transaction_amount = permissions.filter(
      (p) => ModuleKeys.switching_transaction_amount_fast === p.module
    );
    if (
      errors.length > 0 ||
      total_transactions.length > 0 ||
      switching_transaction_amount.length > 0
    ) {
      moduleRoutingPermissions.push({
        key: 'ROUTING_FAST',
        name: 'Cấu hình định tuyến chuyển tiền nhanh 247',
        type: 'menu',
        permissions: [],
      });
      if (errors.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.error_configs,
          name: 'Cấu hình mã lỗi',
          permissions: errors.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });
      if (total_transactions.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.total_transactions,
          name: 'Cấu hình tổng số lượng giao dịch trong ngày',
          permissions: errors.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });
      if (switching_transaction_amount.length > 0)
        moduleRoutingPermissions.push({
          key: ModuleKeys.switching_transaction_amount_fast,
          name: 'Cấu hình số tiền giao dịch định tuyến',
          permissions: switching_transaction_amount.map((p) => {
            return {
              id: p.id,
              action: p.action,
              selected: false,
            };
          }),
        });
    }

    if (moduleRoutingPermissions.length > 0)
      this.modules.push({
        moduleName: 'Cấu hình định tuyến Routing',
        key: 'routing_management',
        children: moduleRoutingPermissions,
      });
  }

  mappingGeneralModulePermissions(permissions: IPermission[]) {
    const moduleGeneralPermissions: IModuleChildren[] = [];
    const aliasP = permissions.filter(
      (p) => ModuleKeys.alias_account === p.module
    );
    // const bankP = permissions.filter((p) => ModuleKeys.bank === p.module);
    const integrationChannelPermission = permissions.filter(
      (p) => ModuleKeys.routing_integration_channel === p.module
    );
    const provinceP = permissions.filter(p => ModuleKeys.city === p.module);

    if (aliasP.length > 0)
      moduleGeneralPermissions.push({
        key: ModuleKeys.alias_account,
        name: 'Danh mục tài khoản đặc biệt',
        permissions: aliasP.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    if (integrationChannelPermission.length > 0)
      moduleGeneralPermissions.push({
        key: ModuleKeys.routing_integration_channel,
        name: 'Cấu hình kênh tích hợp',
        permissions: integrationChannelPermission.map((p) => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          };
        }),
      });
    // if (bankP.length > 0)
    //   moduleGeneralPermissions.push({
    //     key: ModuleKeys.bank,
    //     name: 'Danh sách ngân hàng',
    //     permissions: bankP.map((p) => {
    //       return {
    //         id: p.id,
    //         action: p.action,
    //         selected: false,
    //       };
    //     }),
    //   });
    if (moduleGeneralPermissions.length > 0)
      this.modules.push({
        moduleName: 'Cấu hình chung',
        key: 'general_config',
        children: moduleGeneralPermissions
      });

    if (provinceP.length > 0) {
      moduleGeneralPermissions.push({
        key: ModuleKeys.city,
        name: 'Quản lý tỉnh thành',
        permissions: provinceP.map(p => {
          return {
            id: p.id,
            action: p.action,
            selected: false,
          }
        }),
      })
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

  onSelectPermission(checked: boolean, item: IModuleChildren, action: string) {
    const permissionCheckedId = item.permissions.find(
      (p) => p.action === action
    ).id;
    if (checked) {
      this.selectedPermissionIds.push(permissionCheckedId);
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(
        (id) => id !== permissionCheckedId
      );
    }
  }

  isChecked(item: IModuleChildren, action: string) {
    const id = item.permissions.find((p) => p.action === action)?.id;

    return id ? this.selectedPermissionIds.includes(id) : false;
  }

  getRowColor(element: IModuleChildren) {
    return element.type === 'menu' ? '#F7F8FA' : 'none';
  }

  isDisplayCheckboxAction(item: IModuleChildren, action: string) {
    const id = item.permissions.find((p) => p.action === action)?.id;
    return item.type !== 'menu' && !!id;
  }
}
