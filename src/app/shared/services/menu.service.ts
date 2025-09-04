import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserPermissions } from 'src/app/features/model/auth';
import { URL } from 'src/app/features/transfer-channel/napas-configuration/constant';

import {
  GENERAL_CONFIG_MODULE_KEYS,
  ModuleKeys,
  NAPAS_MODULE_KEYS,
  PermissionsActions,
  ROUTING_CONFIG_FAST_MODULE_KEYS,
  ROUTING_CONFIG_MODULE_KEYS,
  ROUTING_CONFIG_REGULAR_MODULE_KEYS,
  TRANSFER_CHANNEL_ACH_KEYS,
  TRANSFER_CHANNEL_BILATERAL_KEY,
  TRANSFER_CHANNEL_CITAD_KEYS,
  TRANSFER_CHANNEL_INHOUSE,
  USER_MODULE_KEYS,
} from 'src/app/public/module-permission.utils';
import { LocalStoreEnum } from '../enum/local-store.enum';
import { LocalStoreManagerService } from './local-store-manager.service';
export interface MenuTag {
  color: string; // Background Color
  value: string;
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon?: string;
  children?: MenuChildrenItem[];
}

export interface Menu {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon?: string;
  label?: MenuTag;
  badge?: MenuTag;
  children?: MenuChildrenItem[];
}

export interface MenuParam {
  pId: number;
  customerCode: number;
  menuActive: MenuActive[];
}
export interface MenuActive {
  key: string;
  number: number;
  menuParam?: any[];
}

export const AppMenus = [
  {
    id: 1,
    route: 'pmp_admin/admin',
    name: 'Quản trị người dùng',
    parentId: 0, // MENU CẤP 1
    position: 1,
    icon: 'mbb-icon ic-user',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [...USER_MODULE_KEYS],
  },
  {
    id: 2,
    route: 'pmp_admin/general-config',
    name: 'Cấu hình chung',
    parentId: 0, // MENU CẤP 1
    position: 2,
    icon: 'mbb-icon ic-settings',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [...GENERAL_CONFIG_MODULE_KEYS],
  },

  // Quản lý người dùng
  {
    id: 3,
    route: 'pmp_admin/admin/users',
    name: 'Quản lý người dùng',
    parentId: 1, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.user],
  },
  {
    id: 3000,
    route: 'pmp_admin/admin/users/edit',
    name: 'Chỉnh sửa người dùng',
    parentId: 3, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.user, ModuleKeys.role],
  },
  {
    id: 3001,
    route: 'pmp_admin/admin/users/add',
    name: 'Thêm mới người dùng',
    parentId: 3, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.user, ModuleKeys.role],
  },
  {
    id: 3002,
    route: 'pmp_admin/admin/users/detail',
    name: 'Chi tiết người dùng',
    parentId: 3, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.user, ModuleKeys.role],
  },

  // Quản lý vai trò
  {
    id: 4,
    route: 'pmp_admin/admin/roles',
    name: 'Quản lý vai trò',
    parentId: 1, // MENU CẤP 2
    position: 2,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.role],
  },
  {
    id: 4000,
    route: 'pmp_admin/admin/roles/add',
    name: 'Thêm mới vai trò',
    parentId: 4, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.role],
  },
  {
    id: 4001,
    route: 'pmp_admin/admin/roles/edit',
    name: 'Chỉnh sửa vai trò',
    parentId: 4, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.role],
  },
  {
    id: 4002,
    route: 'pmp_admin/admin/roles/detail',
    name: 'Chi tiết vai trò',
    parentId: 4, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.role],
  },

  // Cấu hình chung
  {
    id: 5,
    route: 'pmp_admin/general-config/special-account',
    name: 'Danh mục tài khoản đặc biệt',
    parentId: 2, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 5001,
    route: 'pmp_admin/general-config/special-account/add',
    name: 'Thêm mới tài khoản đặc biệt',
    parentId: 5, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 5002,
    route: 'pmp_admin/general-config/special-account/edit',
    name: 'Chỉnh sửa tài khoản đặc biệt',
    parentId: 5, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 5003,
    route: 'pmp_admin/general-config/special-account/detail',
    name: 'Chi tiết tài khoản đặc biệt',
    parentId: 5, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 5004,
    route: 'pmp_admin/general-config/special-account/history',
    name: 'Lịch sử thay đổi',
    parentId: 5,
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 5005,
    route: 'pmp_admin/general-config/special-account/history/detail',
    name: 'Chi tiết lịch sử thay đổi',
    parentId: 5004,
    position: 5,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.alias_account],
  },
  {
    id: 61,
    route: 'pmp_admin/general-config/integration-channels',
    name: 'Cấu hình kênh tích hợp',
    parentId: 2, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_integration_channel],
  },
  {
    id: 61001,
    route: 'pmp_admin/general-config/integration-channels/add',
    name: 'Thêm mới cấu hình kênh tích hợp',
    parentId: 61, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_integration_channel],
  },
  {
    id: 61002,
    route: 'pmp_admin/general-config/integration-channels/edit',
    name: 'Chỉnh sửa cấu hình kênh tích hợp',
    parentId: 61, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_integration_channel],
  },
  {
    id: 62,
    route: 'pmp_admin/general-config/bank',
    name: 'Danh sách ngân hàng',
    parentId: 2, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bank],
  },
  {
    id: 62001,
    route: 'pmp_admin/general-config/bank/add',
    name: 'Thêm ngân hàng',
    parentId: 62, // MENU CẤP3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bank],
  },
  {
    id: 63,
    route: 'pmp_admin/general-config/province',
    name: 'Quản lý tỉnh thành',
    parentId: 2, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.city],
  },
  {
    id: 63001,
    route: 'pmp_admin/general-config/province/detail',
    name: 'Chi tiết tỉnh thành',
    parentId: 63, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.city],
  },
  {
    id: 63002,
    route: 'pmp_admin/general-config/province/add',
    name: 'Thêm mới tỉnh thành',
    parentId: 63, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.city],
  },
  {
    id: 63003,
    route: 'pmp_admin/general-config/province/edit',
    name: 'Chỉnh sửa tỉnh thành',
    parentId: 63, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.city],
  },
  {
    id: 63004,
    route: 'pmp_admin/general-config/province/history',
    name: 'Lịch sử thay đổi',
    parentId: 63,
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.city],
  },


  // Cấu hình Routing
  {
    id: 6,
    route: 'pmp_admin/routing',
    name: 'Cấu hình định tuyến Routing',
    parentId: 0, // MENU CẤP 1
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    // module: ["routing-blacklist", "routing-whitelist", "fast-transfer-247"]
    module: [
      ...ROUTING_CONFIG_MODULE_KEYS,
      ...ROUTING_CONFIG_FAST_MODULE_KEYS,
      ...ROUTING_CONFIG_REGULAR_MODULE_KEYS,
    ],
  },
  {
    id: 7,
    route: 'pmp_admin/routing/blacklist',
    name: 'Cấu hình Blacklist',
    parentId: 6, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    // module: ["routing-blacklist"]
    module: [ModuleKeys.routing_blacklist],
  },
  {
    id: 7001,
    route: 'pmp_admin/routing/blacklist/add',
    name: 'Thêm mới tài khoản Blacklist',
    parentId: 7, // MENU CẤP3
    position: 7001,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_blacklist],
  },
  {
    id: 7002,
    route: 'pmp_admin/routing/blacklist/edit',
    name: 'Chỉnh sửa tài khoản Blacklist',
    parentId: 7, // MENU CẤP3
    position: 7002,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_blacklist],
  },
  {
    id: 7003,
    route: 'pmp_admin/routing/blacklist/detail',
    name: 'Chi tiết tài khoản Blacklist',
    parentId: 7, // MENU CẤP3
    position: 7003,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_blacklist],
  },
  {
    id: 7004,
    route: 'pmp_admin/routing/blacklist/history',
    name: 'Lịch sử thay đổi',
    parentId: 7,
    position: 7004,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_blacklist],
  },
  {
    id: 8,
    route: 'pmp_admin/routing/whitelist',
    name: 'Cấu hình Whitelist',
    parentId: 6, // MENU CẤP 2
    position: 2,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },
  {
    id: 8001,
    route: 'pmp_admin/routing/whitelist/add',
    name: 'Thêm mới tài khoản Whilelist',
    parentId: 8, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },
  {
    id: 8002,
    route: 'pmp_admin/routing/whitelist/edit',
    name: 'Chỉnh sửa tài khoản Whilelist',
    parentId: 8, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },
  {
    id: 8003,
    route: 'pmp_admin/routing/whitelist/detail',
    name: 'Chi tiết tài khoản Whilelist',
    parentId: 8, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },
  {
    id: 8004,
    route: 'pmp_admin/routing/whitelist/history',
    name: 'Lịch sử thay đổi',
    parentId: 8, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },
  {
    id: 8005,
    route: 'pmp_admin/routing/whitelist/detail-history',
    name: 'Chi tiết lịch sử thay đổi tài khoản Whilelist',
    parentId: 8004, // MENU CẤP 3
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_whitelist],
  },

  // // Cấu hình kênh chuyển tiền thường
  // {
  //   id: 13,
  //   route: 'pmp_admin/routing/regular-transfer',
  //   name: 'Cấu hình định tuyến các kênh chuyển tiền thường',
  //   parentId: 6, // MENU CẤP 2
  //   position: 3,
  //   icon: null,
  //   active: true,
  //   activeService: true,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: ROUTING_CONFIG_REGULAR_MODULE_KEYS,
  // },

  // {
  //   id: 13001,
  //   route: 'pmp_admin/routing/regular-transfer/amount',
  //   name: 'Cấu hình Số tiền giao dịch',
  //   parentId: 13, // MENU CẤP 3
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount],
  // },

  // {
  //   id: 130011,
  //   route: 'pmp_admin/routing/regular-transfer/amount/add',
  //   name: 'Thêm mới cấu hình số tiền giao dịch',
  //   parentId: 13001, // MENU CẤP 4
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount],
  // },
  // {
  //   id: 130012,
  //   route: 'pmp_admin/routing/regular-transfer/amount/detail',
  //   name: 'Chi tiết cấu hình số tiền giao dịch định tuyến',
  //   parentId: 13001, // MENU CẤP 4
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount],
  // },
  // {
  //   id: 130013,
  //   route: 'pmp_admin/routing/regular-transfer/amount/edit',
  //   name: 'Chỉnh sửa cấu hình số tiền giao dịch định tuyến',
  //   parentId: 13001, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount],
  // },
  // {
  //   id: 13002,
  //   route: 'pmp_admin/routing/regular-transfer/tkgt-credit',
  //   name: 'Cấu hình tài khoản trung gian ghi có',
  //   parentId: 13, // MENU CẤP 3
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_credit_inter_accounts],
  // },
  // {
  //   id: 130021,
  //   route: 'pmp_admin/routing/regular-transfer/tkgt-credit/add',
  //   name: 'Thêm mới cấu hình tài khoản trung gian',
  //   parentId: 13002, // MENU CẤP 4
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_credit_inter_accounts],
  // },
  // {
  //   id: 130022,
  //   route: 'pmp_admin/routing/regular-transfer/tkgt-credit/detail',
  //   name: 'Thêm mới cấu hình tài khoản trung gian',
  //   parentId: 13002, // MENU CẤP 4
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_credit_inter_accounts],
  // },
  // {
  //   id: 130023,
  //   route: 'pmp_admin/routing/regular-transfer/tkgt-credit/edit',
  //   name: 'Chỉnh sửa cấu hình tài khoản trung gian',
  //   parentId: 13002, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_credit_inter_accounts],
  // },

  // {
  //   id: 13003,
  //   route: 'pmp_admin/routing/regular-transfer/condition',
  //   name: 'Cấu hình các điều kiện định tuyến',
  //   parentId: 13, // MENU CẤP 3
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_condition],
  // },
  // {
  //   id: 130031,
  //   route: 'pmp_admin/routing/regular-transfer/condition/edit',
  //   name: 'Chỉnh sửa cấu hình các điều kiện định tuyến',
  //   parentId: 13003, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_condition],
  // },

  // // Cấu hình kênh chuyển tiền nhanh 247
  // {
  //   id: 14,
  //   route: 'pmp_admin/routing/fast-transfer',
  //   name: 'Cấu hình định tuyến các kênh chuyển tiền nhanh 247',
  //   parentId: 6, // MENU CẤP 2
  //   position: 4,
  //   icon: null,
  //   active: true,
  //   activeService: true,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: ROUTING_CONFIG_FAST_MODULE_KEYS,
  // },
  // {
  //   id: 14001,
  //   route: 'pmp_admin/routing/fast-transfer/total-transactions',
  //   name: 'Cấu hình tổng số lượng giao dịch trong ngày',
  //   parentId: 14, // MENU CẤP 3
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   // module: ["total-transaction"]
  //   module: [ModuleKeys.total_transactions],
  // },
  // {
  //   id: 140011,
  //   route: 'pmp_admin/routing/fast-transfer/total-transactions/add',
  //   name: 'Thêm mới cấu hình tổng số lượng giao dịch trong ngày',
  //   parentId: 14001, // MENU CẤP 4
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.total_transactions],
  // },
  // {
  //   id: 140012,
  //   route: 'pmp_admin/routing/fast-transfer/total-transactions/detail',
  //   name: 'Chi tiết cấu hình tổng số lượng giao dịch trong ngày',
  //   parentId: 14001, // MENU CẤP 4
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.total_transactions],
  // },
  // {
  //   id: 140013,
  //   route: 'pmp_admin/routing/fast-transfer/total-transactions/edit',
  //   name: 'Cập nhật cấu hình tổng số lượng giao dịch trong ngày',
  //   parentId: 14001, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.total_transactions],
  // },
  // {
  //   id: 14002,
  //   route: 'pmp_admin/routing/fast-transfer/amount',
  //   name: 'Cấu hình số tiền giao dịch định tuyến',
  //   parentId: 14, // MENU CẤP 3
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   // module: ["switching-transaction-amount"]
  //   module: [ModuleKeys.switching_transaction_amount_fast],
  // },
  // {
  //   id: 140021,
  //   route: 'pmp_admin/routing/fast-transfer/amount/add',
  //   name: 'Thêm mới cấu hình số tiền giao dịch định tuyến',
  //   parentId: 14002, // MENU CẤP 4
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount_fast],
  // },
  // {
  //   id: 140022,
  //   route: 'pmp_admin/routing/fast-transfer/amount/detail',
  //   name: 'Chi tiết cấu hình số tiền giao dịch định tuyến',
  //   parentId: 14002, // MENU CẤP 4
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount_fast],
  // },
  // {
  //   id: 140023,
  //   route: 'pmp_admin/routing/fast-transfer/amount/edit',
  //   name: 'Cập nhật cấu hình số tiền giao dịch định tuyến',
  //   parentId: 14002, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_transaction_amount_fast],
  // },
  // {
  //   id: 14003,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors',
  //   name: 'Cấu hình tỷ lệ lỗi theo kênh chuyển tiền và bankcode',
  //   parentId: 14, // MENU CẤP 3
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   // module: ["error-configs"]
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 140031,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/error-codes',
  //   name: 'Cấu hình danh sách mã lỗi',
  //   parentId: 14003, // MENU CẤP 4
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 1400311,
  //   route:
  //     'pmp_admin/routing/fast-transfer/percentage-errors/error-codes/detail',
  //   name: 'Chi tiết cấu hình mã lỗi',
  //   parentId: 140031, // MENU CẤP 5
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 1400312,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/error-codes/add',
  //   name: 'Thêm mới cấu hình mã lỗi',
  //   parentId: 140031, // MENU CẤP 5
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 1400313,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/error-codes/edit',
  //   name: 'Chỉnh sửa cấu hình mã lỗi',
  //   parentId: 140031, // MENU CẤP 5
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 140032,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/add',
  //   name: 'Cấu hình thêm mới tỷ lệ lỗi theo kênh chuyển tiền và bankcode',
  //   parentId: 14003, // MENU CẤP 4
  //   position: 2,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 140033,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/edit',
  //   name: 'Cấu hình chỉnh sửa tỷ lệ lỗi theo kênh chuyển tiền và bankcode',
  //   parentId: 14003, // MENU CẤP 4
  //   position: 3,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 140034,
  //   route: 'pmp_admin/routing/fast-transfer/percentage-errors/detail',
  //   name: 'Cấu hình chi tiết tỷ lệ lỗi theo kênh chuyển tiền và bankcode',
  //   parentId: 14003, // MENU CẤP 4
  //   position: 4,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.error_configs],
  // },
  // {
  //   id: 14004,
  //   route: 'pmp_admin/routing/fast-transfer/routing-condition',
  //   name: 'Cấu hình các điều kiện định tuyến',
  //   parentId: 14, // MENU CẤP 3
  //   position: 1,
  //   icon: null,
  //   active: false,
  //   activeService: false,
  //   type: 'FUNCTION',
  //   typeLink: 'angularLink',
  //   module: [ModuleKeys.switching_condition],
  // },

  {
    id: 16,
    route: 'pmp_admin/routing/bankcode-cardbin',
    name: 'Định tuyền theo mã ngân hàng và cardbin',
    parentId: 6,
    position: 5,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_transfer_channel_bank_config],
  },
  {
    id: 16001,
    route: 'pmp_admin/routing/bankcode-cardbin/add',
    name: 'Thêm mới cấu hình',
    parentId: 16,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_transfer_channel_bank_config],
  },
  {
    id: 16002,
    route: 'pmp_admin/routing/bankcode-cardbin/history',
    name: 'Lịch sử thay đổi',
    parentId: 16,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_transfer_channel_bank_config],
  },

  {
    id: 18,
    route: 'pmp_admin/routing/transfer-channel-config',
    name: 'Danh sách kênh chuyển tiền định tuyến',
    parentId: 6, // MENU CẤP 2
    position: 6,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_config],
  },

  {
    id: 18001,
    route: 'pmp_admin/routing/transfer-channel-config/edit',
    name: 'Chỉnh sửa độ ưu tiên kênh chuyển tiền định tuyến',
    parentId: 18, // MENU CẤP 2
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_config],
  },

  {
    id: 19,
    route: 'pmp_admin/routing/transfer-channel-limit',
    name: 'Cấu hình định mức chuyển tiền',
    parentId: 6,
    position: 7,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_limit],
  },
  {
    id: 19001,
    route: 'pmp_admin/routing/transfer-channel-limit/detail',
    name: 'Chi tiết cấu hình định mức chuyển tiền',
    parentId: 19,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_limit],
  },
  {
    id: 19002,
    route: 'pmp_admin/routing/transfer-channel-limit/add',
    name: 'Thêm mới cấu hình định mức chuyển tiền',
    parentId: 19,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_limit],
  },
  {
    id: 19003,
    route: 'pmp_admin/routing/transfer-channel-limit/edit',
    name: 'Chỉnh sửa cấu hình định mức chuyển tiền',
    parentId: 19,
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_limit],
  },
  {
    id: 19004,
    route: 'pmp_admin/routing/transfer-channel-limit/history',
    name: 'Lịch sử thay đổi',
    parentId: 19,
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.routing_channel_limit],
  },

  // Cấu hình các kênh chuyển tiền
  {
    id: 9,
    route: 'pmp_admin/transfer-channel',
    name: 'Cấu hình các kênh chuyển tiền',
    parentId: 0, // MENU CẤP 1
    position: 4,
    icon: 'mbb-icon ic-settings',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [
      ...TRANSFER_CHANNEL_ACH_KEYS,
      ...TRANSFER_CHANNEL_BILATERAL_KEY,
      ...TRANSFER_CHANNEL_CITAD_KEYS,
      ...TRANSFER_CHANNEL_INHOUSE,
      ...NAPAS_MODULE_KEYS
    ],
  },

  // Cấu hình kênh ACH
  {
    id: 11,
    route: 'pmp_admin/transfer-channel/ach',
    name: 'ACH',
    parentId: 9, // MENU CẤP 2
    position: 1,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: TRANSFER_CHANNEL_ACH_KEYS,
  },

  {
    id: 11001,
    route: 'pmp_admin/transfer-channel/ach/tktg',
    name: 'Cấu hình tài khoản trung gian',
    parentId: 11, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    // module: ["ach-tktg-config"]
    module: [ModuleKeys.ach_tktg_config],
  },
  {
    id: 110011,
    route: 'pmp_admin/transfer-channel/ach/tktg/add',
    name: 'Thêm mới tài khoản trung gian',
    parentId: 11001, // MENU CẤP 4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_tktg_config],
  },
  {
    id: 110012,
    route: 'pmp_admin/transfer-channel/ach/tktg/edit',
    name: 'Chỉnh sửa tài khoản trung gian',
    parentId: 11001, // MENU CẤP 4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_tktg_config],
  },
  {
    id: 110013,
    route: 'pmp_admin/transfer-channel/ach/tktg/detail',
    name: 'Chi tiết tài khoản trung gian',
    parentId: 11001, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_tktg_config],
  },
  {
    id: 11002,
    route: 'pmp_admin/transfer-channel/ach/general',
    name: 'Cấu hình chung ACH',
    parentId: 11, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    // module: ["ach-common-config"]
    module: [ModuleKeys.ach_common_config],
  },
  {
    id: 110021,
    route: 'pmp_admin/transfer-channel/ach/general/add',
    name: 'Thêm mới cấu hình chung ACH',
    parentId: 11002, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_common_config],
  },
  {
    id: 110022,
    route: 'pmp_admin/transfer-channel/ach/general/edit',
    name: 'Cập nhật cấu hình chung ACH',
    parentId: 11002, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_common_config],
  },
  {
    id: 110023,
    route: 'pmp_admin/transfer-channel/ach/general/detail',
    name: 'Chi tiết cấu hình chung',
    parentId: 11002, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.ach_common_config],
  },

  // Cấu hình kênh CITAD
  {
    id: 12,
    route: 'pmp_admin/transfer-channel/citad',
    name: 'CITAD',
    parentId: 9, // MENU CẤP 2
    position: 2,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: TRANSFER_CHANNEL_CITAD_KEYS,
  },
  {
    id: 12001,
    route: 'pmp_admin/transfer-channel/citad/abbreviation-config',
    name: 'Cấu hình từ điển viết tắt',
    parentId: 12, // MENU CẤP3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_abbreviation],
  },
  {
    id: 120011,
    route: 'pmp_admin/transfer-channel/citad/abbreviation-config/edit',
    name: 'Chỉnh sửa cấu hình từ điển viết tắt',
    parentId: 12001, // MENU CẤP4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_abbreviation],
  },
  {
    id: 120012,
    route: 'pmp_admin/transfer-channel/citad/abbreviation-config/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12001,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_abbreviation],
  },
  {
    id: 12002,
    route: 'pmp_admin/transfer-channel/citad/refunds-signal',
    name: 'Cấu hình dấu hiệu hoàn trả',
    parentId: 12, // MENU CẤP3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_refund_pattern],
  },
  {
    id: 120021,
    route: 'pmp_admin/transfer-channel/citad/refunds-signal/edit',
    name: 'Chỉnh sửa cấu hình dấu hiệu hoàn trả',
    parentId: 12002,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_refund_pattern],
  },
  {
    id: 120022,
    route: 'pmp_admin/transfer-channel/citad/refunds-signal/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12002,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_refund_pattern],
  },
  {
    id: 12003,
    route: 'pmp_admin/transfer-channel/citad/mbs-signal',
    name: 'Cấu hình dấu hiệu tài khoản thu hộ định danh',
    parentId: 12, // MENU CẤP3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_partner_pattern],
  },
  {
    id: 120031,
    route: 'pmp_admin/transfer-channel/citad/mbs-signal/edit',
    name: 'Chỉnh sửa cấu hình dấu hiệu tài khoản thu hộ định danh',
    parentId: 12003,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_partner_pattern],
  },
  {
    id: 120032,
    route: 'pmp_admin/transfer-channel/citad/mbs-signal/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12003,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_partner_pattern],
  },
  {
    id: 12004,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-account',
    name: 'Cấu hình tài khoản không đủ điều kiện AUTO treo',
    parentId: 12, // MENU CẤP3
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_account],
  },
  {
    id: 120041,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-account/edit',
    name: 'Chỉnh sửa cấu hình tài khoản không đủ điều kiện AUTO treo',
    parentId: 12004,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_account],
  },
  {
    id: 120042,
    route:
      'pmp_admin/transfer-channel/citad/hold-receiver-account/history-config',
    name: 'Lịch sửa thay đổi',
    parentId: 12004,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_account],
  },
  {
    id: 12005,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-name',
    name: 'Cấu hình tên DV hưởng không đủ điều kiện AUTO treo',
    parentId: 12, // MENU CẤP3
    position: 5,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_name_pattern],
  },
  {
    id: 120051,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-name/edit',
    name: 'Chỉnh sửa cấu hình tên DV hưởng không đủ điều kiện AUTO treo',
    parentId: 12005,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_name_pattern],
  },
  {
    id: 120052,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-name/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12005,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_hold_receiver_name_pattern],
  },
  {
    id: 12006,
    route: 'pmp_admin/transfer-channel/citad/account.parameter',
    name: 'Cấu hình tài khoản tham số điện hoàn trả',
    parentId: 12, // MENU CẤP3
    position: 6,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_account_parameter],
  },
  {
    id: 120061,
    route: 'pmp_admin/transfer-channel/citad/account.parameter/edit',
    name: 'Chỉnh sửa cấu hình tài khoản tham số điện hoàn trả',
    parentId: 12006,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_account_parameter],
  },
  {
    id: 120062,
    route: 'pmp_admin/transfer-channel/citad/account.parameter/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12006,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_account_parameter],
  },
  {
    id: 12007,
    route: 'pmp_admin/transfer-channel/citad/blacklist-account',
    name: 'Cấu hình tài khoản không được ghi có tự động',
    parentId: 12, // MENU CẤP3
    position: 7,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_blacklist_accounts],
  },
  {
    id: 120071,
    route: 'pmp_admin/transfer-channel/citad/blacklist-account/edit',
    name: 'Chỉnh sửa tài khoản không được ghi có tự động',
    parentId: 12007, // MENU CẤP4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_blacklist_accounts],
  },
  {
    id: 120072,
    route: 'pmp_admin/transfer-channel/citad/blacklist-account/add',
    name: 'Thêm mới tài khoản không được ghi có tự động',
    parentId: 12007, // MENU CẤP4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_blacklist_accounts],
  },
  {
    id: 120073,
    route: 'pmp_admin/transfer-channel/citad/blacklist-account/histories',
    name: 'Lịch sử thay đổi',
    parentId: 12007, // MENU CẤP4
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_blacklist_accounts],
  },
  {
    id: 12008,
    route: 'pmp_admin/transfer-channel/citad/whitelist-account',
    name: 'Cấu hình tài khoản được ghi có tự động',
    parentId: 12, // MENU CẤP3
    position: 8,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_accounts],
  },
  {
    id: 120081,
    route: 'pmp_admin/transfer-channel/citad/whitelist-account/edit',
    name: 'Chỉnh sửa tài khoản được ghi có tự động',
    parentId: 12008, // MENU CẤP4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_accounts],
  },
  {
    id: 120082,
    route: 'pmp_admin/transfer-channel/citad/whitelist-account/add',
    name: 'Thêm mới tài khoản được ghi có tự động',
    parentId: 12008, // MENU CẤP4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_accounts],
  },
  {
    id: 120083,
    route: 'pmp_admin/transfer-channel/citad/whitelist-account/histories',
    name: 'Lịch sử thay đổi',
    parentId: 12008, // MENU CẤP4
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_accounts],
  },
  {
    id: 12009,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories',
    name: 'Cấu hình category được phép ghi có tự động',
    parentId: 12, // MENU CẤP3
    position: 9,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_categories],
  },
  {
    id: 120091,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories/add',
    name: 'Thêm mới Cấu hình category được phép ghi có tự động',
    parentId: 12009, // MENU CẤP 4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_categories],
  },
  {
    id: 120092,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories/detail',
    name: 'Chi tiết Cấu hình category được phép ghi có tự động',
    parentId: 12009, // MENU CẤP 4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_categories],
  },
  {
    id: 120093,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories/edit',
    name: 'Chỉnh sửa Cấu hình category được phép ghi có tự động',
    parentId: 12009, // MENU CẤP 4
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_categories],
  },
  {
    id: 120094,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories/history',
    name: 'Lịch sử thay đổi',
    parentId: 12009, // MENU CẤP 4
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_whitelist_categories],
  },
  {
    id: 12010,
    route: 'pmp_admin/transfer-channel/citad/message-error-manage',
    name: 'Retry message lỗi',
    parentId: 12, // MENU CẤP3
    position: 10,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.wire_transfer_error_messages],
  },
  {
    id: 12011,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-in',
    name: 'Quản lý giao dịch điện đến',
    parentId: 12, // MENU CẤP3
    position: 11,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transactions_inward],
  },
  {
    id: 120111,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-in/detail',
    name: 'Chi tiết giao dịch điện đến',
    parentId: 12011, // MENU CẤP4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transactions_inward],
  },
  {
    id: 12012,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-out',
    name: 'Quản lý giao dịch điện đi',
    parentId: 12, // MENU CẤP3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transactions_outward],
  },
  {
    id: 120121,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-out/detail',
    name: 'Chi tiết giao dịch điện đi',
    parentId: 12012, // MENU CẤP4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transactions_outward],
  },
  {
    id: 12013,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries',
    name: 'Cấu hình tài khoản ghi có kho bạc nhà nước',
    parentId: 12, // MENU CẤP 3
    position: 13,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_state_treasuries],
  },
  {
    id: 120131,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries/add',
    name: 'Thêm mới Cấu hình tài khoản ghi có kho bạc nhà nước',
    parentId: 12013, // MENU CẤP 4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_state_treasuries],
  },
  {
    id: 120132,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries/edit',
    name: 'Chỉnh sửa Cấu hình tài khoản ghi có kho bạc nhà nước',
    parentId: 12013, // MENU CẤP 4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_state_treasuries],
  },
  {
    id: 120133,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries/detail',
    name: 'Chi tiết Cấu hình tài khoản ghi có kho bạc nhà nước',
    parentId: 12013, // MENU CẤP 4
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_state_treasuries],
  },
  {
    id: 120134,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries/history',
    name: 'Lịch sử thay đổi',
    parentId: 12013, // MENU CẤP 4
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_state_treasuries],
  },
  {
    id: 12014,
    route: 'pmp_admin/transfer-channel/citad/transaction-replacement',
    name: 'Cấu hình replace kí tự đặc biệt',
    parentId: 12, // MENU CẤP 3
    position: 14,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_replacement],
  },
  {
    id: 120141,
    route: 'pmp_admin/transfer-channel/citad/transaction-replacement/edit',
    name: 'Chỉnh sửa cấu hình replace kí tự đặc biệt',
    parentId: 12014, // MENU CẤP 4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_replacement],
  },
  {
    id: 120142,
    route: 'pmp_admin/transfer-channel/citad/transaction-replacement/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12014, // MENU CẤP 4
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_transaction_replacement],
  },
  {
    id: 12015,
    route: 'pmp_admin/transfer-channel/citad/gateway',
    name: 'Cấu hình bật/tắt cổng CITAD',
    parentId: 12, // MENU CẤP 3
    position: 15,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_gateway],
  },
  {
    id: 120151,
    route: 'pmp_admin/transfer-channel/citad/gateway/history-config',
    name: 'Lịch sử thay đổi',
    parentId: 12015, // MENU CẤP 4
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.citad_gateway],
  },

  // SONG PHUONG
  {
    id: 80,
    route: 'pmp_admin/transfer-channel/bilateral',
    name: 'SONG PHƯƠNG',
    parentId: 9, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    // module: ["bilateral"]
    module: TRANSFER_CHANNEL_BILATERAL_KEY,
  },
  {
    id: 81,
    route: 'pmp_admin/transfer-channel/bilateral/transactions',
    name: 'Dach sách giao dịch',
    parentId: 80, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 82,
    route: 'pmp_admin/transfer-channel/bilateral/dispute',
    name: 'Dach sách giao dịch tra soát',
    parentId: 80, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 83,
    route: 'pmp_admin/transfer-channel/bilateral/partner-config',
    name: 'Cấu hình đối tác',
    parentId: 80, // MENU CẤP 3
    position: 3,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 84,
    route: 'pmp_admin/transfer-channel/bilateral/reconcile-flag',
    name: 'Quản lý phiên đối soát',
    parentId: 80, // MENU CẤP 3
    position: 4,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 85,
    route: 'pmp_admin/transfer-channel/bilateral/capital',
    name: 'Giao dịch chuyển vốn',
    parentId: 80, // MENU CẤP 3
    position: 5,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 86,
    route: 'pmp_admin/transfer-channel/bilateral/reconcile-log',
    name: 'Reconcile log',
    parentId: 80, // MENU CẤP 3
    position: 6,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 87,
    route: 'pmp_admin/transfer-channel/bilateral/holiday-config',
    name: 'Cấu hình ngày nghỉ',
    parentId: 80, // MENU CẤP 3
    position: 7,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 88,
    route: 'pmp_admin/transfer-channel/bilateral/refund',
    name: 'Hoàn trả',
    parentId: 80, // MENU CẤP 3
    position: 8,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 89,
    route: 'pmp_admin/transfer-channel/bilateral/additional-accounting',
    name: 'Hạch toán bổ sung',
    parentId: 80, // MENU CẤP 3
    position: 9,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 90,
    route: 'pmp_admin/transfer-channel/bilateral/account-hvt',
    name: 'Truy vấn số dư tài khoản HVT',
    parentId: 80, // MENU CẤP 3
    position: 10,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },
  {
    id: 91,
    route: 'pmp_admin/transfer-channel/bilateral/fund/config',
    name: 'Cấu hình Fund',
    parentId: 80, // MENU CẤP 3
    position: 11,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.bilateral],
  },

  //test menu không hiển thị
  {
    id: 99,
    route: 'pmp_admin/admin/profile/test',
    name: 'Test',
    parentId: 10, // MENU CẤP 3
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [],
  },

  // Cấu hình kênh chuyển tiền INHOUSE
  {
    id: 15,
    route: 'pmp_admin/transfer-channel/inhouse-transfer',
    name: 'INHOUSE TRANSFER',
    parentId: 9,
    position: 4,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: TRANSFER_CHANNEL_INHOUSE,
  },
  {
    id: 15001,
    route: 'pmp_admin/transfer-channel/inhouse-transfer/configs',
    name: 'Cấu hình bật/tắt luồng hạch toán GD BĐB vào T24',
    parentId: 15,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.inhouse_transfer_channel_state],
  },
  {
    id: 15002,
    route: 'pmp_admin/transfer-channel/inhouse-transfer/t24-protection',
    name: 'Cấu hình tham số bảo vệ T24',
    parentId: 15,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.inhouse_config],
  },
  {
    id: 150021,
    route: 'pmp_admin/transfer-channel/inhouse-transfer/t24-protection/edit',
    name: 'Chỉnh sửa cấu hình tham số bảo vệ T24',
    parentId: 15002,
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.inhouse_config],
  },
  {
    id: 150022,
    route: 'pmp_admin/transfer-channel/inhouse-transfer/t24-protection/history',
    name: 'Lịch sử thay đổi',
    parentId: 15002,
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.inhouse_config],
  },
  // Thông tin cá nhân
  {
    id: 10,
    route: 'pmp_admin/admin/profile',
    name: 'Thông tin cá nhân',
    parentId: 1, // MENU CẤP 2
    position: 3,
    icon: null,
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: [ModuleKeys.profile],
  },

  {
    id: 17,
    route: 'pmp_admin/transfer-channel/napas',
    name: 'NAPAS 2.0',
    parentId: 9, // MENU CẤP 1
    position: 2,
    icon: 'mbb-icon ic-settings',
    active: true,
    activeService: true,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: NAPAS_MODULE_KEYS,
  },

  {
    id: 1701,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE,
    name: 'Quản lý giao dịch tra soát',
    parentId: 17, // MENU CẤP 2
    position: 1,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1702,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.CREATE_DISPUTE,
    name: 'Thêm mới yêu cầu tra soát',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1703,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.EDIT_DISPUTE,
    name: 'Chỉnh sửa yêu cầu tra soát',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1704,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.DETAIL_DISPUTE,
    name: 'Xem chi tiết ',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1704,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_DISPUTE,
    name: 'Phản hồi yêu cầu tra soát',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1705,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_EDIT_DISPUTE,
    name: 'Chỉnh sửa phản hồi yêu cầu tra soát',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1706,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_DETAIL_DISPUTE,
    name: 'Xem chi tiết ',
    parentId: 1701, // MENU CẤP 3
    position: 2,
    icon: null,
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_dispute,
  },

  {
    id: 1801,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION.SEARCH_TRANSACTION,
    name: 'Tra cứu thông tin giao dịch',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_transaction,
  },

  {
    id: 1802,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION.DETAIL,
    name: 'Xem chi tiết thông tin giao dịch',
    parentId: 1801, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_transaction,
  },

  {
    id: 1901,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH,
    name: 'Tra cứu thông tin báo có',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_charge_credit,
  },

  {
    id: 1902,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.CREATE,
    name: 'Thêm mới yêu cầu báo có',
    parentId: 1901, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_charge_credit,
  },

  {
    id: 1903,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.EDIT,
    name: 'Chỉnh sửa yêu cầu báo có',
    parentId: 1901, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_charge_credit,
  },

  {
    id: 1904,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.DETAIL,
    name: 'Xem chi tiết yêu cầu báo có',
    parentId: 1901, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_charge_credit,
  },

  {
    id: 2001,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_FLAG.SEARCH,
    name: 'Cấu hình dựng cờ giao dịch chiều về',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_transaction_flag,
  },

  {
    id: 2002,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_FLAG.HISTORY,
    name: 'Lịch sử thay đổi cấu hình dựng cờ giao dịch chiều về',
    parentId: 2001, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_transaction_flag,
  },

  {
    id: 2101,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH,
    name: 'Tra cứu thông tin giao dịch hoàn trả',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2102,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.CREATE_SINGLE,
    name: 'Thêm mới yêu cầu hoàn trả',
    parentId: 2101, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2103,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.EDIT_SINGLE,
    name: 'Chỉnh sửa yêu cầu hoàn trả',
    parentId: 2101, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2104,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.DETAIL_SINGLE,
    name: 'Chi tiết yêu cầu hoàn trả',
    parentId: 2101, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2105,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_BATCH,
    name: 'Tra cứu thông tin giao dịch hoàn trả lô',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 21006,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.DETAIL_BATCH,
    name: 'Chi tiết lô hoàn trả',
    parentId: 2105, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2201,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH,
    name: 'Quản lý thông tin cờ đối soát',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2202,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.CREATE,
    name: 'Thêm mới thông tin cờ đối soát',
    parentId: 2201, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2203,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.EDIT,
    name: 'Chỉnh sửa thông tin cờ đối soát',
    parentId: 2201, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2204,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.DETAIL,
    name: 'Chi tiết thông tin cờ đối soát',
    parentId: 2201, // MENU CẤP 3
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_return,
  },
  {
    id: 2106,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.ADDITIONAL_ACCOUNTING.SEARCH,
    name: 'Tra cứu thông tin giao dịch hoàn trả lô',
    parentId: 17, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_additional_accounting,
  },
  {
    id: 2107,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.ADDITIONAL_ACCOUNTING.DETAIL,
    name: 'Thông tin chi tiết giao dịch hạch toán bổ sung theo lô',
    parentId: 2108, // MENU CẤP 2
    position: 4,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_additional_accounting,
  },
  {
    id: 2108,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.ADDITIONAL_ACCOUNTING.CREATE,
    name: 'Tạo điện hạch toán bổ sung theo lô',
    parentId: 2106, // MENU CẤP 2
    position: 3,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_additional_accounting,
  },
  {
    id: 2300,
    route: URL.NAPAS.IBFT_RECONCILE.OUT.FILE.SEARCH,
    name: 'Quản lý thông tin file',
    parentId: 17, // MENU CẤP 2
    position: 6,
    icon: 'mbb-icon ic-settings',
    active: false,
    activeService: false,
    type: 'FUNCTION',
    typeLink: 'angularLink',
    module: ModuleKeys.napas_ibft_reconcile_flag_report,
  },
];

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menu$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);

  menusDform: any;
  menusEsb: any;

  constructor(
    private localStore: LocalStoreManagerService,
    private router: Router
  ) {}

  getAll(): Observable<Menu[]> {
    return this.menu$.asObservable();
  }

  set(menu: Menu[]): Observable<Menu[]> {
    this.menu$.next(menu);
    return this.menu$.asObservable();
  }

  add(menu: Menu) {
    const tmpMenu = this.menu$.value;
    tmpMenu.push(menu);
    this.menu$.next(tmpMenu);
  }

  get menu() {
    return this.menu$.value ? this.menu$.value : [];
  }

  reset() {
    this.menu$.next([]);
  }

  /**
   * Convert menu show html
   * @param menuServer;
   * @param parentId;
   */
  mapMenu(menuServer, parentId = 0) {
    const menusTree: any = [];
    let menuChild = menuServer.filter(
      (x) => x.parentId === parentId && x.active
    );
    menuChild = _.orderBy(menuChild, ['position'], ['asc']);
    (menuChild || []).forEach((element) => {
      const menuSubChild = this.mapMenu(menuServer, element.id);
      if (!element.typeLink || element.typeLink === 'angularLink') {
        const menu: any = {
          route: '/' + element.route?.trim(),
          name: element.name,
          type: menuSubChild.length > 0 ? 'sub' : 'link',
          icon: element.icon,
          children: menuSubChild,
        };
        menusTree.push(menu);
      } else {
        const menu: any = {
          route: element.route?.trim(),
          name: element.name,
          type: element.typeLink,
          icon: element.icon,
          children: menuSubChild,
        };
        menusTree.push(menu);
      }
    });
    return menusTree;
  }

  /**
   * Convert menu show html
   * @param menuServer;
   * @param parentId;
   */
  mapMenuOrs(menuServer, parentId = 0, menuLever = '.1.') {
    const menusOrs: any = [];
    let menuChild = menuServer.filter((x) => {
      if (parentId === 0) {
        return x.menuLevel === menuLever;
      } else {
        return x.parentId === parentId;
      }
    });
    (menuChild || []).forEach((element) => {
      const menuSubChild = this.mapMenuOrs(menuServer, element.menuId);
      const menu: any = {
        route: '/tableau/view/' + element.menuId?.trim(),
        name: element.menuName,
        type: element.menuType == 'VIEW' ? 'link' : 'sub',
        children: menuSubChild,
      };
      menusOrs.push(menu);
    });
    return menusOrs;
  }

  /**
   * Convert menu show html
   * @param menuServer;
   * @param parentId;
   */
  mapMenuTree(menuServer, parentId = 0) {
    const menusTree: any = [];
    let menuChild = menuServer.filter((x) => x.parentId === parentId);
    menuChild = _.orderBy(menuChild, ['position'], ['asc']);
    (menuChild || []).forEach((element) => {
      const menuSubChild = this.mapMenuTree(menuServer, element.id);
      if (!element.typeLink || element.typeLink === 'angularLink') {
        const menu: any = {
          route: '/' + element.route?.trim(),
          name: element.name,
          type: menuSubChild.length > 0 ? 'sub' : 'link',
          icon: element.icon,
          isData: true,
          children: menuSubChild,
        };
        menusTree.push(menu);
      } else {
        const menu: any = {
          route: element.route?.trim(),
          name: element.name,
          type: element.typeLink,
          icon: element.icon,
          isData: true,
          children: menuSubChild,
        };
        menusTree.push(menu);
      }
    });
    return menusTree;
  }

  /**
   * Naviagete sang url tương ứng của dform hoặc emb
   * @param returnUrl;
   */
  checkNavigate(returnUrl) {
    const menuDform: any[] = JSON.parse(
      localStorage.getItem(LocalStoreEnum.Menu_List)
    );
    if (menuDform && menuDform.length > 0) {
      this.router.navigateByUrl(returnUrl);
      return true;
    }
  }

  removeURLParameter(url) {
    url = url.split('?');
    if (url.length > 0) {
      return url[0];
    }
  }

  static getMenusByPermissions(permissions: IUserPermissions[]) {
    // mặc định hiển thị thông tin cá nhân
    permissions.push({
      module: 'profile',
      actions: ['view'],
    });

    const menus = [];
    AppMenus.forEach((menu) => {
      if (
        permissions.findIndex(
          (p) =>
            menu.module.includes(p.module) &&
            p.actions.includes(PermissionsActions.view)
        ) !== -1
      ) {
        menus.push(menu);
      }
    });
    return menus;
  }
}
