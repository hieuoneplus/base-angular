import { environment } from '@env/environment';

export const URL_BASE = environment.base_url;
export const BLANK_ZERO = '0';
export const D_NUMBER_PHONE = 'numberPhone';
export const D_FREE = 'textFree';
export const D_FREE_TEXT = 'dtextFree';
export const D_TEXT = 'text';
export const D_CURRENCY = 'currency';
export const GENERATE_TOKEN = 'generate-token';
export const GENERATE_OTP = 'save-otp-info';
export const REVOKE_TOKEN = 'revoke-token';
export const VERIFYOTP = 'verify-otp';

export const MAKER = 'MAKER'; // Role nhập liệu
export const APPROVER = 'APPROVER'; // Role duyệt

export const PROCESS_STATUS_DELETED = 'D'; // Đã xóa
export const PROCESS_STATUS_PROCESSING = 'E'; // Đang xử lý
export const PROCESS_STATUS_WAITING = 'W'; // Chờ duyệt
export const PROCESS_STATUS_APPROVED = 'A'; // Đã duyệt
export const PROCESS_STATUS_REJECT = 'R'; // Từ chối

export const DFORM_CONFIRM_STATUS = {
  CANCELED: 0,
  CONFIRMED: 1,
};

export const TOAST_DEFAULT_CONFIG = {
  positionClass: 'toast-top-right',
  timeOut: 3000,
  extendedTimeOut: 3000
};

export const DATE_TIME_FORMAT = {
  yyyy_MM_DD_HHmmss: 'yyyy-MM-DD HH:mm:ss',
  DD_MM_YYYY: 'DD/MM/YYYY',
  yyyy_MM_dd: 'yyyy-MM-DD',
  DD_MM_YYYY_1: 'DD-MM-YYYY',
};

export const STATUS = [
  { key: '', value: 'Tất cả trạng thái', class: '' },
  { key: 'E', value: 'Error', class: 'wf-status-reject' },
  { key: 'W', value: 'Chờ duyệt', class: 'wf-status-waitting' },
  { key: 'A', value: 'Đã duyệt', class: 'wf-status-approved' },
  { key: 'R', value: 'Từ chối duyệt', class: 'wf-status-reject' },
  { key: 'D', value: 'Hủy', class: 'wf-status-reject' },
];

// khai báo các định dạnh button show ở footer
export const TYPE_BTN_FOOTER = {
  TYPE_SAVE: 'SAVE', // lưu thông tin
  TYPE_REFUSE: 'REFUSE', // từ chối
  TYPE_DELETE: 'DELETE', // hủy hồ sơ
  TYPE_UPDATE: 'UPDATE', // cập nhật
  TYPE_CANCEL: 'CANCEL', // hủy
  TYPE_SEND_APPROVER: 'SEND_APPROVER', // gửi duyệt
  TYPE_BACK: 'BACK', // quay lại
  TYPE_APPROVER: 'APPROVER', // duyệt
  TYPE_UNDO: 'UNDO',
  TYPE_RECALL: 'RECALL',
  TYPE_EXIT: 'EXIT', // Thoát
  TYPE_CONTINUE: 'CONTINUE', // Tiếp tục,
  TYPE_QR: 'INQR', // IN QR Code
  TYPE_INIT: 'INIT', // Tạo hồ sơ
  TYPE_SAVE_APPROVE: 'SAVE_APPROVE', // Lưu và duyệt
  TYPE_EXPORT: 'EXPORT',
  TYPE_CREATE: 'CREATE',
  TYPE_REJECT: 'REJECT',
  TYPE_EDIT: 'EDIT'
};

export const BUTTON_APPROVER = {
  title: 'Duyệt',
  classBtn: 'btn-success',
  typeBtn: TYPE_BTN_FOOTER.TYPE_APPROVER,
  state: [PROCESS_STATUS_WAITING]
};

export const BUTTON_REJECT = {
  title: 'Từ chối',
  classBtn: 'btn-error',
  typeBtn: TYPE_BTN_FOOTER.TYPE_REJECT,
  state: [PROCESS_STATUS_WAITING]
};

export const BUTTON_APPROVE = {
  title: 'Duyệt',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_APPROVER,
  state: [PROCESS_STATUS_WAITING]
};

export const BUTTON_REJECT_2 = {
  title: 'Từ chối',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_REJECT,
  state: [PROCESS_STATUS_WAITING]
};
export const BUTTON_UNDO = {
  title: 'Quay lại',
  classBtn: 'btn-light-blue',
  typeBtn: TYPE_BTN_FOOTER.TYPE_UNDO,
  icon: 'ic-angle_left',
};

export const BUTTON_CANCEL = {
  title: 'Hủy',
  classBtn: 'btn-light-blue',
  typeBtn: TYPE_BTN_FOOTER.TYPE_CANCEL,
};

export const BUTTON_ADD = {
  title: 'Thêm mới',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_SAVE,
};

export const BUTTON_SAVE = {
  title: 'Lưu thông tin',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_SAVE,
  disable: false
  // status:  ['', PROCESS_STATUS_PROCESSING]
};

export const BUTTON_EXPORT = {
  title: 'Export Data',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_EXPORT,
  // status:  ['', PROCESS_STATUS_PROCESSING]
};

export const BUTTON_CREATE = {
  title: 'Tạo',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_CREATE,
  // status:  ['', PROCESS_STATUS_PROCESSING]
};

export const BUTTON_REQUEST_APPROVER = {
  title: 'Gửi duyệt',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_SEND_APPROVER,
  // state: [PROCESS_STATUS_WAITING]
};

export const BUTTON_EDIT = {
  title: 'Chỉnh sửa',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_EDIT,
};

export const PATH = {
  OTP: {
    SEND: 'admin-portal/v1/otp/send',
    VERIFY: 'admin-portal/v1/otp/verify'
  },
  USER: {
    GET_USERS: 'admin-portal/v1/users',
    GET_USER_BY_NAME: 'admin-portal/v1/users/hcm/', //admin-portal/v1/users/{username}
    PUT_USERS: 'admin-portal/v1/users/',
    POST_USERS: 'admin-portal/v1/users',
    PERMISSIONS: 'admin-portal/v1/users/permissions',
    ME: 'admin-portal/v1/users/me',
  },
  ROLE: {
    ROLES: 'admin-portal/v1/roles',
    INQUIRY_ROLES: 'admin-portal/v1/roles/inquiry', //admin-portal/v1/roles/inquiry/{id}
    PUT_ROLES: 'admin-portal/v1/roles/', //admin-portal/v1/roles/{id}
  },
  PERMISSION: {
    PERMISSIONS: 'admin-portal/v1/permissions',
  },
  TRANSFER_CHANNEL: {
    ACH: {
      LIST_INTERMEDIATE_ACC_CONFIG: "admin-portal/v1/ach/tktg-config",
      LIST_COMMON_CONFIG: "admin-portal/v1/ach/common-config",
    },
    CITAD: {
      QUERY_TRANSACTION_CITAD: "admin-portal/v1/citad-transfer/transactions",
      // RETRY_TRANSACTION_CITAD: "admin-portal/v1/citad-transfer/transactions",
      EXPORT_TRANSACTION_CITAD: "admin-portal/v1/citad-transfer/transactions/export",
      MESSAGE_ERROR: "admin-portal/v1/wire-transfer/error-messages",
      // RETRY_MESSAGE_ERROR: "admin-portal/v1/wire-transfer/error-messages",
      WHITELIST_CATEGORIES:"admin-portal/v1/citad-transfer/whitelist-categories",
      WHITELIST_CATEGORIES_HISTORY:"admin-portal/v1/citad-transfer/whitelist-category-histories",
      WHITELIST: 'admin-portal/v1/citad-transfer/whitelist-accounts',
      WHITELIST_HISTORY: 'admin-portal/v1/citad-transfer/whitelist-account-histories',
      BLACKLIST: 'admin-portal/v1/citad-transfer/blacklist-accounts',
      BLACKLIST_HISTORY: 'admin-portal/v1/citad-transfer/blacklist-account-histories',
      CONFIG: "admin-portal/v1/citad-transfer/configs",
      CONFIG_HISTORY: "admin-portal/v1/citad-transfer/config-histories",
      RETRY_TRANSACTION_CITAD: "admin-portal/v1/citad-transfer/transactions",
      RETRY_MESSAGE_ERROR: "admin-portal/v1/wire-transfer/error-messages",
      CONFIGS_SIGNAL: "admin-portal/v1/citad-transfer/configs",
      STATE_TREASURIES:"admin-portal/v1/citad-transfer/state-treasuries",
      STATE_TREASURIES_HISTORY:"admin-portal/v1/citad-transfer/state-treasuries-histories",
      EXPORT_CONFIG_CITAD: "admin-portal/v1/citad-transfer/configs/export",
      EXPORT_STATE_TREASURIES: "admin-portal/v1/citad-transfer/state-treasuries/export",
    },
    INHOUSE_TRANSFER: {
      CONFIG: "admin-portal/v1/inhouse-transfer/configs",
      CONFIGS: "admin-portal/v1/inhouse-configs"
    }
  },
  BANK: {
    CM: 'admin-portal/v1/banks'
  },
  TKTG_CREDIT: {
    COMMON : 'admin-portal/v1/smart-switching/credit-inter-accounts'
  },
  GENERAL_CONFIGURATION: {
    INTEGRATED_CHANNEL :'admin-portal/v1/integration-channels',
    ALIAS: 'admin-portal/v1/alias-accounts',
    PROVINCE: 'admin-portal/v1/cities'
  },
  ROUTING: {
    WHITELIST: 'admin-portal/v1/whitelist-accounts',
    TRANSFER_CHANNEL_CONFIG: 'admin-portal/v1/transfer-channel-configs',
    TRANSFER_CHANNEL_LIMIT: 'admin-portal/v1/transfer-channel-limits',
    BANKCODE_CARDBIN : 'admin-portal/v1/transfer-channel-bank-configs',
    BLACKLIST:  'admin-portal/v1/blacklist-accounts',
  },
  NAPAS: {
    IBFT_RECONCILE: {
      OUT: {
        DISPUTE: {
          SEARCH_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/search',
          SEARCH_TRANSACTION_ORIGINAL: 'admin-portal/v1/napas/ibft-reconcile/out/transaction/info',
          SEARCH_TRANSACTION_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute',
          SEARCH_TRANSACTION_REFUND: 'admin-portal/v1/napas/ibft-reconcile/out/return/search/info',
          SEARCH_CHARGECREDIT_INFO: 'admin-portal/v1/napas/ibft-reconcile/out/chargecredit/search/info',
          CREATE_REQUEST_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/request/create',
          UPDATE_REQUEST_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/request/update',
          APPROVE_REQUEST_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/approve',
          EXPORT_TRANSACTION_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/export',
          DOWNLOAD_FILE_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/file',
          CREATE_REPLY_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/response/create',
          UPDATE_REPLY_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/response/update',
          APPROVE_REPLY_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/response/approve',
          APPROVE_BATCH_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/approve-batch',
        },
        TRANSACTION_INFO: {
          SEARCH: 'admin-portal/v1/napas/ibft-reconcile/out/transaction'
        },
        CHARGE_CREDIT: {
          SEARCH: 'admin-portal/v1/napas/ibft-reconcile/out/chargecredit/search',
          SEARCH_TRANSACTION_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/search/info',
          CREATE: 'admin-portal/v1/napas/ibft-reconcile/out/chargecredit/request',
          UPDATE: 'admin-portal/v1/napas/ibft-reconcile/out/chargecredit',
          APPROVE: 'admin-portal/v1/napas/ibft-reconcile/out/chargecredit/approve',
          DOWNLOAD_FILE_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/file',
        },
        CONFIG: {
          TRANSACTION_FLAG: 'admin-portal/v1/napas/ibft-reconcile/config/transaction_flag',
          HISTORY: 'admin-portal/v1/napas/ibft-reconcile/config/history'
        },
        REFUND: {
          SEARCH: 'admin-portal/v1/napas/ibft-reconcile/out/return/search',
          SEARCH_TRANSACTION_ORIGINAL: 'admin-portal/v1/napas/ibft-reconcile/out/transaction/info',
          CREATE_SINGLE: 'admin-portal/v1/napas/ibft-reconcile/out/return/request',
          EDIT_SINGLE: 'admin-portal/v1/napas/ibft-reconcile/out/return/update',
          IMPORT_TRANSACTION_REFUND_BATCH: 'admin-portal/v1/napas/ibft-reconcile/out/return/batch/request',
          SEARCH_BATCH: 'admin-portal/v1/napas/ibft-reconcile/out/return/batch/search',
          SEARCH_TRANSACTION_DISPUTE: 'admin-portal/v1/napas/ibft-reconcile/out/dispute/search/info',
          APPROVE_TRANSACTION_REFUND: 'admin-portal/v1/napas/ibft-reconcile/out/return/approve',
        },
        FLAG_REPORT: {
          SEARCH: 'admin-portal/v1/napas/ibft-reconcile/flag-report/search',
          CREATE: 'admin-portal/v1/napas/ibft-reconcile/flag-report/create',
          UPDATE: 'admin-portal/v1/napas/ibft-reconcile/flag-report/update',
          SEARCH_FILE: 'admin-portal/v1/napas/ibft-reconcile/out/file/search/info',
          DOWNLOAD_FILE: 'admin-portal/v1/napas/ibft-reconcile/out/file/download',
        },
        ADDITIONAL_ACCOUNTING: {
          GET_TRANS: 'admin-portal/v1/napas/ibft-reconcile/add-accounting/query-trans',
          GET_FILES_IMPORTED: 'admin-portal/v1/napas/ibft-reconcile/add-accounting/query-files',
          IMPORT: 'admin-portal/v1/napas/ibft-reconcile/add-accounting/batch/create',
          APPROVE: 'admin-portal/v1/napas/ibft-reconcile/add-accounting/batch/approve'
        }

      }
    }

  },
};

export const PATH_BILATERAL = {
  USER: {
    GET: 'user/get',
  },
  TRANSACTION: {
    SEARCH: 'transaction/v1.0/search',
    EXPORT: 'transaction/v1.0/export',
    EXPORT_DETAIL: 'transaction/v1.0/export/detail',
    SEARCH_DISPUTE: 'transaction/v1.0/search-dispute',
    GET_TRANSACTION: 'transaction/v1.0/get',
    SAVE_DISPUTE: 'transaction/v1.0/dispute/save',
    SEND_DISPUTE: 'transaction/v1.0/dispute/send',
    EXPORT_DISPUTE: 'transaction/v1.0/dispute/export',
    SEARCH_ACCT_BALANCE: 'transaction/v1.0/account/balance',

  },
  CAPITAL_TRANSACTION: {
    SEARCH: 'capital-transfer/v1.0/transaction/search',
    SAVE: 'capital-transfer/v1.0/transaction/save',
    GET_INITIAL: 'capital-transfer/v1.0/init-create',
    GET_BALANCE: 'capital-transfer/v1.0/account/balance',
    GET_BALANCECT: 'capital-transfer/v1.0/account/balance/treasury',
    APPROVE: 'capital-transfer/v1.0/transaction/approve',
    EXPORT: 'capital-transfer/v1.0/transaction/export',
  },
  INTEREST_RATE: {
    SEARCH: 'interest/v1.0/search',
    EDIT: 'interest/v1.0/edit',
  },
  PARTNER_CONFIG: {
    SEARCH: 'partner/config/v1.0/search',
    EDIT: 'partner/config/v1.0/save',
  },
  RECONCILE_FLAG: {
    SEARCH: 'flag/v1.0/search',
    SAVE_FLAG: 'flag/v1.0/save',
  },
  RECONCILE: {
    SEARCH_INCOME: 'reconcile/v1.0/search',
    SEARCH: 'reconcile/v1.0/search',
    SEARCH_RESULT: 'reconcile/result/v1.0/search',
    QUERY_LOG: 'reconcile/v1.0/query-log',
    RESNED_964: 'reconcile/v1.0/resend',
    EXPORT: 'reconcile/v1.0/export',
  },
  FUND: {
    SEARCH_CONFIG: 'fund/v1.0/config/search',
    EDIT_CONFIG: 'fund/v1.0/config/edit',
  },
  REFUND: {
    SEARCH: 'refund/v1.0/query',
    GET_TRANSACTION_BY_ID: 'refund/v1.0/get',
    SAVE_TRANSACTION: 'refund/v1.0/save',
    EXPORT: 'refund/v1.0/export',
    CONFIRM_APPROVE: 'refund/v1.0/approve/confirm',
    REQUEST_APPROVE: 'refund/v1.0/approve/request',
    IMPORT: 'refund/v1.0/import',
    GET_FILES_IMPORTED: 'refund/v1.0/query-files',
    SEND_REQUEST_APPROVE: 'refund/v1.0/request-approve',
    DELETE_FILE: 'refund/v1.0/delete',
  },
  ADDITIONAL_ACCOUTING: {
    IMPORT: 'add-accounting/v1.0/import',
    EXPORT: 'add-accounting/v1.0/export',
    GET_FILES_IMPORTED: 'add-accounting/v1.0/query-files',
    GET_TRANS: 'add-accounting/v1.0/query-trans',
    SEND_REQUEST_APPROVE: 'add-accounting/v1.0/request-approve',
    REQUEST_OTP_APPROVE: 'add-accounting/v1.0/approve/request',
    CONFIRM_OTP_APPROVE: 'add-accounting/v1.0/approve/confirm',
    REJECT: 'add-accounting/v1.0/reject',
    DELETE_FILE: 'add-accounting/v1.0/delete',
    CREATE: 'add-accounting/v1.0/create',
  },
  HOLIDAY_CONFIG: {
    SEARCH: 'holiday-config/v1.0/search',
    SAVE: 'holiday-config/v1.0/save',
  },
};
