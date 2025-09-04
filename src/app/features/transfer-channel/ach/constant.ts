import {ModuleKeys} from "../../../public/module-permission.utils";

export const availableConfigs = [
  // {
  //   moduleName: ModuleKeys.ach_tktg_config,
  //   configName: "Cấu hình tài khoản trung gian",
  //   pageUrl: "/pmp_admin/transfer-channel/ach/tktg",
  //   icon: 'compare_arrows'
  // },
  {
    moduleName: ModuleKeys.ach_common_config,
    configName: "Cấu hình chung",
    pageUrl: "/pmp_admin/transfer-channel/ach/general",
    icon: 'settings'
  },
  // {
  //   configName: "Danh sách lịch sử",
  //   pageUrl: "/pmp_admin/transfer-channel/ach/history"
  //   icon: 'menu-icon-3'
  // },
]

export const generalTransactionWay = {
  NAPAS_TO_MB_REVERT: 'NAPAS_TO_MB_REVERT',
  NAPAS_TO_MB_MAKE: 'NAPAS_TO_MB_MAKE',
  MB_TO_NAPAS_MAKE: 'MB_TO_NAPAS_MAKE',
  ACH_CONFIG: 'ACH_CONFIG',
  ACH_GW: 'ACH_GW'
}

export const keyBasedOnGeneralTransactionWay = {
  NAPAS_TO_MB_REVERT: {
    DAY_ACCEPT: "DAY_ACCEPT",
  },
  NAPAS_TO_MB_MAKE: {
    MAX_AMOUNT: "MAX_AMOUNT",
    MIN_AMOUNT: "MIN_AMOUNT",
    STATUS: "STATUS",
    DAY_ACCEPT: "DAY_ACCEPT",
  },
  MB_TO_NAPAS_MAKE: {
    MAX_AMOUNT: "MAX_AMOUNT",
    MIN_AMOUNT: "MIN_AMOUNT",
    T24_TRANSACTION_TYPE: "T24_TRANSACTION_TYPE"
  },
  ACH_CONFIG: {
    DAY_ACCEPT: "DAY_ACCEPT"
  },
  ACH_GW: {
    ROUTING_CORE: "ROUTING_CORE",
    OLD_WHITELIST_ACCOUNT: "OLD_WHITELIST_ACCOUNT",
    NEW_WHITELIST_ACCOUNT: "NEW_WHITELIST_ACCOUNT"
  }
}
