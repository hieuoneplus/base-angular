import { TYPE_BTN_FOOTER } from "src/app/public/constants";
import { ModuleKeys } from "src/app/public/module-permission.utils";



export const URL = {
  NAPAS: {
      IBFT_RECONCILE: {
          OUT: {
              DISPUTE: {
                  SEARCH_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/search',
                  CREATE_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/create',
                  EDIT_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/edit',
                  DETAIL_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/detail',
                  REPLY_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply',
                  REPLY_EDIT_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply-edit',
                  REPLY_DETAIL_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply-detail',
              },
              TRANSACTION: {
                SEARCH_TRANSACTION: 'pmp_admin/transfer-channel/napas/transaction-info/search',
                DETAIL: 'pmp_admin/transfer-channel/napas/transaction-info/detail',
              },
              CHARGE_CREDIT: {
                SEARCH: 'pmp_admin/transfer-channel/napas/charge-credit/search',
                CREATE: 'pmp_admin/transfer-channel/napas/charge-credit/create',
                EDIT: 'pmp_admin/transfer-channel/napas/charge-credit/edit',
                DETAIL: 'pmp_admin/transfer-channel/napas/charge-credit/detail',

              },
              TRANSACTION_FLAG:  {
                SEARCH: 'pmp_admin/transfer-channel/napas/transaction-flag/search',
                HISTORY: 'pmp_admin/transfer-channel/napas/transaction-flag/history',
              },
              REFUND:  {
                SEARCH: 'pmp_admin/transfer-channel/napas/refund/search',
                CREATE_SINGLE: 'pmp_admin/transfer-channel/napas/refund/create-single',
                EDIT_SINGLE: 'pmp_admin/transfer-channel/napas/refund/edit-single',
                DETAIL_SINGLE: 'pmp_admin/transfer-channel/napas/refund/detail-single',
                SEARCH_BATCH: 'pmp_admin/transfer-channel/napas/refund/batch/search',
                DETAIL_BATCH: 'pmp_admin/transfer-channel/napas/refund/batch/detail',
              },
              FLAG_REPORT:  {
                SEARCH: 'pmp_admin/transfer-channel/napas/flag-report/search',
                DETAIL: 'pmp_admin/transfer-channel/napas/flag-report/detail',
                CREATE: 'pmp_admin/transfer-channel/napas/flag-report/create',
                EDIT: 'pmp_admin/transfer-channel/napas/flag-report/edit',
              },
              ADDITIONAL_ACCOUNTING:  {
                SEARCH: 'pmp_admin/transfer-channel/napas/additional-accounting/search',
                DETAIL: 'pmp_admin/transfer-channel/napas/additional-accounting/batch-detail',
                CREATE: 'pmp_admin/transfer-channel/napas/additional-accounting/batch',
              },
              FILE: {
                SEARCH: 'pmp_admin/transfer-channel/napas/file-management/search',
              }
          }
      },
  }
}

export const menuNapas = [
    {
      configName: "Quản lý giao dịch tra soát",
      pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE,
      permission_module: ModuleKeys.napas_ibft_reconcile_dispute,
      icon: 'ic-settings'
    },
    {
      configName: "Tra cứu thông tin giao dịch",
      pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION.SEARCH_TRANSACTION,
      permission_module: ModuleKeys.napas_ibft_reconcile_transaction,
      icon: 'ic-settings'
    },
    // {
    //   configName: "Quản lý yêu cầu báo có",
    //   pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH,
    //   permission_module: ModuleKeys.napas_ibft_reconcile_charge_credit,
    //   icon: 'ic-settings'
    // },
    {
      configName: "Cấu hình dựng cờ giao dịch chiều về",
      pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_FLAG.SEARCH,
      permission_module: ModuleKeys.napas_ibft_reconcile_transaction_flag,
      icon: 'ic-settings'
    },
    // {
    //   configName: "Quản lý giao dịch hoàn trả",
    //   pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH,
    //   permission_module: ModuleKeys.napas_ibft_reconcile_return,
    //   icon: 'ic-settings'
    // },
    // {
    //   configName: "Quản lý thông tin đối soát",
    //   pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH,
    //   permission_module: ModuleKeys.napas_ibft_reconcile_flag_report,
    //   icon: 'ic-settings'
    // },
    // {
    //   configName: "Quản lý yêu cầu hạch toán bổ sung",
    //   pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.ADDITIONAL_ACCOUNTING.SEARCH,
    //   // permission_module: ModuleKeys.napas_ibft_reconcile_return,
    //   permission_module: ModuleKeys.napas_ibft_reconcile_dispute,
    //   icon: 'ic-settings'
    // },
    {
      configName: "Quản lý thông tin file",
      pageUrl: URL.NAPAS.IBFT_RECONCILE.OUT.FILE.SEARCH,
      // permission_module: ModuleKeys.napas_ibft_reconcile_return,
      permission_module: ModuleKeys.napas_ibft_reconcile_flag_report,
      icon: 'ic-settings'
    },

]

  export const BUTTON_REJECT = {
    title: 'Từ chối',
    icon: 'ic-close_blue',
    classBtn: 'btn-error',
    typeBtn: TYPE_BTN_FOOTER.TYPE_DELETE,
  };

  export const BUTTON_APPROVE = {
    title: 'Duyệt',
    icon: 'ic-check_blue',
    classBtn: 'btn-success',
    typeBtn: TYPE_BTN_FOOTER.TYPE_APPROVER,
  };
