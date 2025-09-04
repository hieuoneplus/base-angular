import { environment } from '@env/environment';

export enum ModuleKeys {
  // quản trị người dùng
  user = 'user',
  role = 'role',
  permission = 'permission',
  profile = 'profile',

  // cấu hình các kênh chuyển tiền
  ach_tktg_config = 'ach-tktg-config',
  ach_common_config = 'ach-common-config',
  citad_gateway = 'citad-gateway',
  citad_config = 'citad-config',
  citad_transaction_abbreviation = 'citad-transaction-abbreviation', // từ điển viết tắt
  citad_refund_pattern = 'citad-refund-pattern', // Cấu hình dấu hiệu hoàn trả
  citad_partner_pattern = 'citad-partner-pattern', //Cấu hình dấu hiệu tài khoản thu hộ định danh
  citad_hold_receiver_account = 'citad-hold-receiver-account', //Cấu hình tài khoản không được phép ghi có tự động vào tài khoản trung gian
  citad_hold_receiver_name_pattern = 'citad-hold-receiver-name-pattern', //Cấu hình dấu hiệu tên người nhận không được phép ghi có tự động vào tài khoản trung gian
  citad_account_parameter = 'citad-account-parameter', //Cấu hình tài khoản tham số điện hoàn trả
  citad_blacklist_accounts = 'citad-blacklist-accounts', //Cấu hình tài khoản không được ghi có tự động
  citad_whitelist_accounts = 'citad-whitelist-accounts', //Cấu hình tài khoản được ghi có tự động
  citad_whitelist_categories = 'citad-whitelist-categories', //Cấu hình category được phép ghi có tự động
  citad_state_treasuries = 'citad-state-treasuries', //Cấu hình tài khoản ghi có kho bạc nhà nước
  citad_transactions_inward = 'citad-transactions-inward', //
  citad_transactions_outward = 'citad-transactions-outward', //

  wire_transfer_error_messages = 'wire-transfer-error-messages',
  citad_transaction_replacement = 'citad-transaction-replacement',

  bilateral = 'bilateral',

  // cấu hình định tuyến routing
  bank = 'bank',
  routing_blacklist = 'routing-blacklist',
  routing_whitelist = 'routing-whitelist',
  routing_channel_config = 'routing-channel-config',
  routing_channel_limit = 'routing-channel-limit',
  routing_transfer_channel_bank_config = 'routing-transfer-channel-bank-config',
  // chuyển tiền thường
  switching_transaction_amount = 'switching-transaction-amount',
  switching_condition = 'switching-condition',
  switching_credit_inter_accounts = 'switching-credit-inter-accounts',
  // chuyển tiền nhanh
  error_configs = 'error-configs',
  total_transactions = 'total-transaction',
  switching_transaction_amount_fast = 'switching-transaction-amount-fast',

  // Cấu hình chung
  alias_account = 'alias-account',
  inhouse_transfer_channel_state = 'inhouse-transfer-channel-state',

  // Cấu hình inhouse
  inhouse_config='inhouse-config',

  //Napas
  napas_ibft_reconcile_dispute = 'napas-ibft-reconcile-dispute',
  napas_ibft_reconcile_transaction = 'napas-ibft-reconcile-transaction',
  napas_ibft_reconcile_charge_credit  = 'napas-ibft-reconcile-charge-credit',
  napas_ibft_reconcile_transaction_flag = 'napas-ibft-reconcile-transaction-flag',
  napas_ibft_reconcile_return = 'napas-ibft-reconcile-return',
  napas_ibft_reconcile_additional_accounting = 'napas-ibft-reconcile-additional-accounting',
  napas_ibft_reconcile_flag_report = 'napas-ibft-reconcile-flag-report',

  routing_integration_channel='routing-integration-channel',
  city = 'city',
}

export const USER_MODULE_KEYS = ['user', 'role', 'permission', 'profile'];
export const TRANSFER_CHANNEL_ACH_KEYS = [
  'ach-tktg-config',
  'ach-common-config',
];
export const TRANSFER_CHANNEL_CITAD_KEYS = [
  'citad-gateway',
  // 'citad-config',
  'citad-transaction-abbreviation',
  'citad-refund-pattern',
  'citad-partner-pattern',
  'citad-hold-receiver-account',
  'citad-hold-receiver-name-pattern',
  'citad-state-treasuries',
  'citad-account-parameter',
  'citad-blacklist-accounts',
  'citad-whitelist-accounts',
  'citad-whitelist-categories',
  'citad-transactions-inward',
  'citad-transactions-outward',
  'wire-transfer-error-messages',
  'citad-transaction-replacement'
];
export const TRANSFER_CHANNEL_BILATERAL_KEY = ['bilateral'];
export const TRANSFER_CHANNEL_INHOUSE = ['inhouse-transfer-channel-state'];
export const GENERAL_CONFIG_MODULE_KEYS = [
  'alias-account',
  'bank',
  'routing-integration-channel',
];
export const ROUTING_CONFIG_MODULE_KEYS = [
  'routing-blacklist',
  'routing-whitelist',
  'routing-channel-config',
  'routing-channel-limit',
  'routing-transfer-channel-bank-config'
];
export const ROUTING_CONFIG_REGULAR_MODULE_KEYS = [
  'switching-transaction-amount',
  'switching-condition',
  'switching-credit-inter-accounts',
];
export const ROUTING_CONFIG_FAST_MODULE_KEYS = [
  'error-configs',
  'total-transaction',
  'switching-transaction-amount-fast',
];

//Napas
export const NAPAS_MODULE_KEYS  = ['napas-ibft-reconcile-dispute', 'napas-ibft-reconcile-transaction', 'napas-ibft-reconcile-charge-credit', 'napas-ibft-reconcile-transaction-flag', 'napas-ibft-reconcile-return', 'napas-ibft-reconcile-flag-report', 'napas-ibft-reconcile-additional-accounting']

// dùng để mapping ra tên module trong màn chi tiết vai trò
export enum PermissionsModuleName {
  //
  user = 'Quản lý người dùng',
  role = 'Quản lý vai trò',
  permission = 'Danh sách quyền',
  routing_blacklist = 'Cấu hình blacklist',
  routing_whitelist = 'Cấu hình whitelist',
  routing_channel_config = 'Danh sách kênh chuyển tiền định tuyến',
  routing_channel_limit = 'Cấu hình định mức chuyển tiền',
  routing_transfer_channel_bank_config = 'Cấu hình định tuyến mã ngân hàng và CardBin',
  ach_tktg_config = 'Cấu hình tài khoản trung gian',
  ach_common_config = 'Cấu hình chung ACH',
  citad_gateway = 'Cấu hình bật/tắt cổng CITAD',
  citad_config = 'Cấu hình citad',
  citad_transaction_abbreviation = 'Cấu hình từ điển viết tắt',
  citad_refund_pattern = 'Cấu hình dấu hiệu hoàn trả',
  citad_partner_pattern = 'Cấu hình dấu hiệu tài khoản thu hộ định danh',
  citad_hold_receiver_account = 'Cấu hình tài khoản không đủ điều kiện AUTO treo',
  citad_hold_receiver_name_pattern = 'Cấu hình tên DV hưởng không đủ điều kiện AUTO treo',
  citad_account_parameter = 'Cấu hình tài khoản tham số điện hoàn trả',
  citad_blacklist_accounts = 'Cấu hình tài khoản không được ghi có tự động',
  citad_whitelist_accounts = 'Cấu hình tài khoản được ghi có tự động',
  citad_whitelist_categories = 'Cấu hình category được phép ghi có tự động',
  citad_state_treasuries = 'Cấu hình tài khoản ghi có kho bạc nhà nước',
  citad_transactions_inward = 'Quản lý giao dịch đến',
  citad_transactions_outward = 'Quản lý giao dịch đi',
  citad_transaction_replacement = 'Cấu hình replace kí tự đặc biệt',

  wire_transfer_error_messages = 'Retry message lỗi',
  city = 'Quản lý tỉnh thành',

  //SONG PHƯƠNG
  bilateral = 'Song Phương',
  alias_account = 'Danh mục tài khoản đặc biệt',

  // chuyển tiền thường
  switching_transaction_amount = 'Cấu hình số tiền giao dịch',
  switching_condition = 'Cấu hình điều kiện định tuyến',
  switching_credit_inter_accounts = 'Cấu hình tài khoản trung gian ghi có',
  // chuyển tiền nhanh
  error_configs = 'Cấu hình mã lỗi',
  inhouse_transfer_channel_state = 'Cấu hình bật/tắt luồng hạch toán GD BĐB vào T24',
  total_transaction = 'Cấu hình tổng số lượng giao dịch trong ngày',
  switching_transaction_amount_fast = 'Cấu hình số tiền giao dịch định tuyến',
  //
  bank = 'Danh sách ngân hàng',
  inhouse_config = 'Cấu hình tham số bảo vệ T24',
  routing_integration_channel='Cấu hình kênh tích hợp',

  //Napas
  napas_ibft_reconcile_dispute = 'Quản lý giao dịch tra soát',
  napas_ibft_reconcile_transaction = 'Tra cứu thông tin giao dịch',
  napas_ibft_reconcile_charge_credit = 'Quản lý thông tin báo có',
  napas_ibft_reconcile_transaction_flag = 'Cấu hình dựng cờ giao dịch chiều về',
  napas_ibft_reconcile_return = 'Tra cứu thông tin giao dich hoàn trả',
  napas_ibft_reconcile_flag_report = 'Quản lý file và thông tin đối soát',
  napas_ibft_reconcile_additional_accounting = 'Quản lý yêu cầu hạch toán bổ sung',

}

export enum PermissionsActions {
  view = 'view',
  update = 'update',
  delete = 'delete',
  insert = 'insert',
  assign = 'assign',
  retry = 'retry',
  approve = 'approve',
  reply= 'reply',
}

export default class ModulePermissionUtils {
  public static getModuleName(key: string): string {
    if (USER_MODULE_KEYS.includes(key)) {
      return 'Quản trị người dùng';
    }
    if (GENERAL_CONFIG_MODULE_KEYS.includes(key)) {
      return 'Cấu hình chung';
    }
    if (ROUTING_CONFIG_MODULE_KEYS.includes(key)) {
      return 'Cấu hình định tuyến Routing';
    }
    if (TRANSFER_CHANNEL_ACH_KEYS.includes(key)) {
      return 'Cấu hình các kênh chuyển tiền';
    }
    if (NAPAS_MODULE_KEYS.includes(key)) {
      return 'Napas 2.0'
    }
  }
}
