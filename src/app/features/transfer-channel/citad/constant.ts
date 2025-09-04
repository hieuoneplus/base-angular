import {
  DateTimeItem,
  D_CURRENCY,
  NgSelectItem,
  SlideItem,
  TextboxItem,
} from '@shared-sm';
import * as moment from 'moment';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

export const TRANSACTION_ID = () =>
  new TextboxItem({
    key: 'transactionId',
    label: 'Transaction ID',
    placeholder: 'Nhập transaction ID',
    value: null,
  });

export const T24_REFERENCE_NUMBER = () =>
  new TextboxItem({
    key: 't24ReferenceNumber',
    label: 'Số FT',
    placeholder: 'Nhập số FT',
    value: null,
  });

export const DEBIT_VALUE_DATE = () =>
  new DateTimeItem({
    key: 'debitValueDate',
    label: 'Ngày giao dịch',
    placeholder: 'Nhập ngày giao dịch',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment().startOf('day').format('yyyy-MM-DD'),
    required: true,
  });

export const SHOWING_CONDITION = () =>
  new NgSelectItem({
    key: 'isRetryable',
    label: 'Tình trạng giao dịch',
    placeholder: 'Chọn tình trạng giao dịch',
    value: null,
    options: SELECT_SHOWING_CONDITION,
  });

export const INWARD_RETRYING_CONDITION = () =>
  new NgSelectItem({
    key: 'isRetryable',
    label: 'Tình trạng giao dịch',
    placeholder: 'Chọn tình trạng giao dịch',
    value: null,
    options: SELECT_INWARD_RETRYING_CONDITION,
  });

export const STATUS = () =>
  new NgSelectItem({
    key: 'status',
    label: 'Trạng thái',
    placeholder: 'Chọn trạng thái',
    value: null,
    options: SELECT_STATUS,
  });

  export const STATUS_OUT = () =>
  new NgSelectItem({
    key: 'wrappedStatus',
    label: 'Trạng thái giao dịch trên PMP',
    placeholder: 'Chọn trạng thái',
    value: null,
    options: SELECT_STATUS_OUT,
  });

export const MIN_AMOUNT = () =>
  new TextboxItem({
    key: 'minAmount',
    label: 'Số tiền nhỏ nhất',
    placeholder: 'Nhập số tiền nhỏ nhất',
    value: null,
    // directives: D_CURRENCY,
    customDirectives: /[^0-9,]*/g,
  });

export const MAX_AMOUNT = () =>
  new TextboxItem({
    key: 'maxAmount',
    label: 'Số tiền lớn nhất',
    placeholder: 'Nhập số tiền lớn nhất',
    value: null,
    customDirectives: /[^0-9,]*/g,
  });

export const DEBIT_THEIR_REF = () =>
  new TextboxItem({
    key: 'debitTheirRef',
    label: 'Số hiệu giao dịch',
    placeholder: 'Nhập số hiệu giao dịch',
    value: null,
  });

export const CURRENCY = () =>
  new NgSelectItem({
    key: 'currency',
    label: 'Loại tiền',
    placeholder: 'Chọn loại tiền',
    value: null,
    options: SELECT_CURENCY,
  });

export const TYPE_OF_T24_REFERENCE_NUMBER = () =>
  new NgSelectItem({
    key: 'typeOfT24RefferenceNumber',
    label: 'Type of T24 Refference Number',
    placeholder: 'Chọn Type of T24 Refference Number',
    value: null,
    options: SELECT_TYPE_OF_T24_REFERENCE_NUMBER,
  });

  export const TRANSACTION_TYPE = () =>
    new NgSelectItem({
      key: 'hasT24ReferenceNumber',
      label: 'Loại giao dịch',
      placeholder: 'Chọn loại giao dịch',
      value: null,
      options: TRANSACTION_TYPE_LIST,
    });

export const SELECT_STATUS = [
  {
    key: 'INIT',
    value: 'Khởi tạo',
  },
  {
    key: 'FAIL',
    value: 'Lỗi',
  },
  {
    key: 'PROCESSING',
    value: 'Đang xử lý',
  },
  {
    key: 'REPROCESSING',
    value: 'Đang được xử lý lại',
  },
  {
    key: 'SUCCESS',
    value: 'Thành công',
  },
  {
    key: 'PREPARE',
    value: 'Chuẩn bị khởi tạo',
  },
  {
    key: 'PREPARE_FAIL',
    value: 'Lỗi khởi tạo',
  },
];

export const SELECT_STATUS_OUT = [
  {
    key: 'KHOI_TAO',
    value: 'KHỞI TẠO',
  },
  {
    key: 'LOI',
    value: 'LỖI',
  },
  {
    key: 'DANG_XU_LY',
    value: 'ĐANG XỬ LÝ',
  },
  {
    key: 'THANH_CONG',
    value: 'THÀNH CÔNG',
  },
];

export const SELECT_CURENCY = [
  {
    key: 'VND',
    value: 'VND',
  },
  {
    key: 'USD',
    value: 'USD',
  },
  {
    key: 'EUR',
    value: 'EUR',
  },
];

export const SELECT_TYPE_OF_T24_REFERENCE_NUMBER = [
  {
    key: '',
    value: 'ALL',
  },
  {
    key: 'NOT_EMPTY',
    value: 'Giao dịch có FT null',
  },
  {
    key: 'EMPTY',
    value: 'Giao dịch đã tạo FT',
  },
];

export const SELECT_SHOWING_CONDITION = [
  {
    key: 'false',
    value: 'Tất cả',
  },
  {
    key: 'true',
    value: 'Giao dịch có thể retry',
  },
];

export const SELECT_INWARD_RETRYING_CONDITION = [
  {
    key: 'false',
    value: 'Tất cả',
  },
  {
    key: 'true',
    value: 'Giao dịch có thể retry',
  },
  {
    key: 'isReprocessing',
    value: 'Giao dịch đang xử lý retry',
  },
];

export const TRANSACTION_TYPE_LIST = [
  {
    key: null,
    value: 'Tất cả',
  },
  {
    key: 'true',
    value: 'Giao dịch có số FT',
  },
  {
    key: 'false',
    value: 'Giao dịch không có số FT',
  },
];

export const CITAD_MENUS = [
  {
    id: 1,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-out',
    module: ModuleKeys.citad_transactions_outward,
    name: 'Quản lý giao dịch điện đi',
    icon: 'ic-settings',
  },
  {
    id: 2,
    route: 'pmp_admin/transfer-channel/citad/transaction-manager-in',
    module: ModuleKeys.citad_transactions_inward,
    name: 'Quản lý giao dịch điện đến',
    icon: 'ic-settings',
  },
  {
    id: 3,
    route: 'pmp_admin/transfer-channel/citad/message-error-manage',
    module: ModuleKeys.wire_transfer_error_messages,
    name: 'Retry message lỗi',
    icon: 'ic-settings',
  },
  {
    id: 4,
    route: 'pmp_admin/transfer-channel/citad/abbreviation-config',
    module: ModuleKeys.citad_transaction_abbreviation,
    name: 'Cấu hình từ điển viết tắt',
    icon: 'ic-search',
  },
  {
    id: 5,
    route: 'pmp_admin/transfer-channel/citad/refunds-signal',
    module: ModuleKeys.citad_refund_pattern,
    name: 'Cấu hình dấu hiệu hoàn trả',
    icon: 'ic-settings',
  },
  {
    id: 6,
    route: 'pmp_admin/transfer-channel/citad/mbs-signal',
    module: ModuleKeys.citad_partner_pattern,
    name: 'Cấu hình dấu hiệu tài khoản thu hộ định danh',
    icon: 'ic-settings',
  },
  {
    id: 7,
    route: 'pmp_admin/transfer-channel/citad/account.parameter',
    module: ModuleKeys.citad_account_parameter,
    name: 'Cấu hình tài khoản tham số điện hoàn trả',
    icon: 'ic-settings',
  },
  {
    id: 8,
    route: 'pmp_admin/transfer-channel/citad/blacklist-account',
    module: ModuleKeys.citad_blacklist_accounts,
    name: 'Cấu hình tài khoản không được ghi có tự động',
    icon: 'ic-settings',
  },
  {
    id: 9,
    route: 'pmp_admin/transfer-channel/citad/whitelist-account',
    module: ModuleKeys.citad_whitelist_accounts,
    name: 'Cấu hình tài khoản được ghi có tự động',
    icon: 'ic-settings',
  },
  {
    id: 10,
    route: 'pmp_admin/transfer-channel/citad/whitelist-categories',
    module: ModuleKeys.citad_whitelist_categories,
    name: 'Cấu hình category được phép ghi có tự động',
    icon: 'ic-settings',
  },
  {
    id: 11,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-account',
    module: ModuleKeys.citad_hold_receiver_account,
    name: 'Cấu hình tài khoản không đủ điều kiện AUTO treo',
    icon: 'ic-settings',
  },
  {
    id: 12,
    route: 'pmp_admin/transfer-channel/citad/hold-receiver-name',
    module: ModuleKeys.citad_hold_receiver_name_pattern,
    name: 'Cấu hình tên DV hưởng không đủ điều kiện AUTO treo',
    icon: 'ic-settings',
  },
  {
    id: 13,
    route: 'pmp_admin/transfer-channel/citad/state-treasuries',
    module: ModuleKeys.citad_state_treasuries,
    name: 'Cấu hình tài khoản ghi có kho bạc nhà nước',
    icon: 'ic-settings',
  },
  {
    id: 14,
    route: 'pmp_admin/transfer-channel/citad/transaction-replacement',
    module: ModuleKeys.citad_transaction_replacement,
    name: 'Cấu hình replace ký tự đặc biệt',
    icon: 'ic-settings',
  },
  {
    id: 15,
    route: 'pmp_admin/transfer-channel/citad/gateway',
    module: ModuleKeys.citad_gateway,
    name: 'Cấu hình bật/tắt cổng CITAD',
    icon: 'ic-settings',
  },
];

export const STATUS_TRANSACTION = {
  INIT: 'INIT',
  FAIL: 'FAIL',
  PROCESSING: 'PROCESSING',
  REPROCESSING: 'REPROCESSING',
  SUCCESS: 'SUCCESS',
  PREPARE: 'PREPARE',
  PREPARE_FAIL: 'PREPARE_FAIL',
};

export const STATUS_LABEL_TRANSACTION = [
  { key: '', value: 'Tất cả', class: '' },
  {
    key: STATUS_TRANSACTION.INIT,
    value: 'Khởi tạo',
    class: ' wf-status-waitting',
  },
  {
    key: STATUS_TRANSACTION.FAIL,
    value: 'Lỗi',
    class: 'wf-status-reject',
  },
  {
    key: STATUS_TRANSACTION.PROCESSING,
    value: 'Đang xử lý',
    class: 'wf-status-inprocess',
  },
  {
    key: STATUS_TRANSACTION.REPROCESSING,
    value: 'Đang được xử lý lại',
    class: 'wf-status-inprocess',
  },
  {
    key: STATUS_TRANSACTION.SUCCESS,
    value: 'Thành công',
    class: 'wf-status-approved',
  },
  {
    key: STATUS_TRANSACTION.PREPARE,
    value: 'Chuẩn bị khởi tạo',
    class: 'wf-status-inprocess',
  },
  {
    key: STATUS_TRANSACTION.PREPARE_FAIL,
    value: 'Lỗi khởi tạo',
    class: 'wf-status-inprocess',
  },
];

export const STATUS_TRANSACTION_OUT = {
  KHOI_TAO: 'KHỞI TẠO',
  LOI: 'LỖI',
  DANG_XU_LY: 'ĐANG XỬ LÝ',
  THANH_CONG: 'THÀNH CÔNG',
};

export const STATUS_LABEL_TRANSACTION_OUT = [
  { key: '', value: 'Tất cả', class: '' },
  {
    key: STATUS_TRANSACTION_OUT.KHOI_TAO,
    value: 'KHỞI TẠO',
    class: ' wf-status-waitting',
  },
  {
    key: STATUS_TRANSACTION_OUT.LOI,
    value: 'LỖI',
    class: 'wf-status-reject',
  },
  {
    key: STATUS_TRANSACTION_OUT.DANG_XU_LY,
    value: 'ĐANG XỬ LÝ',
    class: 'wf-status-inprocess',
  },
  {
    key: STATUS_TRANSACTION_OUT.THANH_CONG,
    value: 'THÀNH CÔNG',
    class: 'wf-status-approved',
  },
];

export enum KeyConfigCitad {
  transaction_abbreviation = 'transaction.abbreviation',
  refund_transaction_pattern = 'refund.transaction.pattern',
  account_parameter = 'account.parameter',
  hold_receiver_name_pattern = 'hold.receiver-name.pattern',
  hold_receiver_account = 'hold.receiver-account',
  partner_transaction_pattern = 'partner.transaction.pattern',
  transaction_replacement = 'transaction.replacement',
  gateway = 'citad.gateway.enabled',

}
