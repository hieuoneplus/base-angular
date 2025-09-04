import { HiddenItem, TextAreaItem, TextboxItem, NgSelectItem, DateTimeItem} from '@shared-sm';
import { STATE_OPTIONS, STATUS_OPTIONS, SWIFT_CODE_LIST } from './constants';

export const TRANSACTION_ID = () => new TextboxItem({
  key: 'transactionId',
  label: 'TransID',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});

export const FT_NUMBER = () => new TextboxItem({
  key: 'reference',
  label: 'Reference ID',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});

export const FROM_BANK_SELECT = () => new NgSelectItem({
  key: 'fromBank',
  label: 'From Bank',
  placeholder: '',
  value: '',
  options: SWIFT_CODE_LIST,
  layout: '25',
  maxLength: 50
});

export const TO_BANK_SELECT = () => new NgSelectItem({
  key: 'toBank',
  label: 'To Bank',
  placeholder: '',
  value: '',
  options: SWIFT_CODE_LIST,
  layout: '25',
  maxLength: 50
});

export const FROM_BANK = () => new TextboxItem({
  key: 'fromBank',
  label: 'From Bank',
  placeholder: '',
  value: '',
  layout: '25',
  maxLength: 50
});


export const TO_BANK = () => new TextboxItem({
  key: 'toBank',
  label: 'To Bank',
  placeholder: '',
  value: '',
  layout: '25',
  maxLength: 50
});

export const STATE_TRANSACTION = () => new TextboxItem({
  key: 'state',
  label: 'Trạng thái giao dịch',
  value: '',
  options: STATE_OPTIONS.filter(x => ['', 'SUCCESS', 'ERROR'].includes(x.key)),
  layout: '25'
});

export const TRANSACTION_STATUS = () => new NgSelectItem({
  key: 'status',
  label: 'Status',
  value: '',
  options: STATUS_OPTIONS.filter(x => ['', 'NAUT', 'NOAN', 'AUTH', 'NEXS'].includes(x.key)),
  layout: '25'
});

export const FROM_DATE = () => new DateTimeItem({
  key: 'fromDate',
  placeholder: '',
  label: 'Date From',
  layout: '30',
  value: null,
  minDate: '1900-01-01',
  maxDate: '2300-01-01',
});

export const TO_DATE = () => new DateTimeItem({
  key: 'toDate',
  placeholder: '',
  label: 'Date To',
  layout: '30',
  value: null,
  minDate: '1900-01-01',
  maxDate: '2300-01-01',
});


export const PAYMENT_ID = () => new TextboxItem({
  key: 'msgId',
  label: 'PaymentID',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});


export const TRANSACTION_TYPE = () => new NgSelectItem({
  key: 'request',
  placeholder: '',
  label: 'TransType',
  value: '',
  options: [
    { key: '', value: 'All' },
    { key: 'INC', value: 'INCOME' },
    { key: 'OUT', value: 'OUTCOME' },
  ],
  layout: '30'
});

export const DATE_TYPE = () => new NgSelectItem({
  key: 'dateType',
  placeholder: '',
  label: 'DateType',
  value: 'transaction',
  options: [
    { key: '', value: 'All' },
    { key: 'transaction', value: 'Transaction Date' },
    { key: 'settlement', value: 'Settlement Date' },
    { key: 'reconcile', value: 'Reconcile Date' },
  ],
  layout: '30'
});

export const CURRENCY = () => new NgSelectItem({
  key: 'currency',
  placeholder: 'Currency',
  label: 'Currency',
  value: 'VND',
  options: [
    { key: '', value: 'All' },
    { key: 'VND', value: 'VND' },
    { key: 'USD', value: 'USD' },
  ],
  layout: '30'
});

export const FROM_ACCOUNT = () => new TextboxItem({
  key: 'debitNumber',
  label: 'From Account',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});

export const TO_ACCOUNT = () => new TextboxItem({
  key: 'creditNumber',
  label: 'To Account',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});

export const TRANS_TYPE_ID = [
  { key: '', value: 'All' },
  { key: '001', value: 'EPS Realtime' },
  { key: '002', value: 'EPS Normal' },
]

export const TRANSACTION_TYPE_ID = () => new NgSelectItem({
  key: 'epsCode',
  placeholder: '',
  label: 'TransTypeID',
  value: '001',
  options: TRANS_TYPE_ID,
  layout: '30'
});

export const CHANNEL_TRANS = () => new NgSelectItem({
  key: 'clrChanl',
  placeholder: '',
  label: 'Channel',
  value: '',
  options: [
    { key: '', value: 'All' },
    { key: '01', value: 'Mobile' },
    { key: '02', value: 'Quầy' },
    { key: '03', value: 'Internet Banking' },
    { key: '04', value: 'Chuyển tiếp' },
    { key: '05', value: 'Kênh khác' },
  ],
  layout: '30'
});

export const CHANNEL_TEXT_SEARCH = () => new TextboxItem({
  key: 'channel',
  label: 'Channel',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50
});

export const DEBIT_ACCOUNT_TEXT_SEARCH = () => new TextboxItem({
  key: 'debitAccount',
  label: 'Account Number',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50
});

export const ACCOUNT_NUMBER_TEXT_SEARCH = () => new TextboxItem({
  key: 'accountNumber',
  label: 'Account Number',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50
});

export const SWIFTCODE_TEXT_SEARCH = () => new TextboxItem({
  key: 'swiftCode',
  label: 'Swift Code',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50
});

export const SWIFTCODE_LIST_SEARCH = () => new NgSelectItem({
  key: 'swiftCode',
  label: 'Swift Code',
  placeholder: '',
  value: '',
  options: SWIFT_CODE_LIST,
  layout: '50',
  maxLength: 50
});

export const BALANCE_TEXT = () => new TextboxItem({
  key: 'balance',
  label: 'Số dư TK',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50
});

export const AMOUNT_TEXT = () => new TextboxItem({
  key: 'amount',
  label: 'Số tiền chuyển vốn',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50,
  required: true,
});
export const RECONCILE_DATE = () => new DateTimeItem({
  key: 'reconcileDate',
  placeholder: '',
  label: 'Reconcile Date',
  layout: '30',
  value: null,
  minDate: '1900-01-01',
  maxDate: '2300-01-01',
});
export const TOTAL_AMOUNT_DEBIT = () => new TextboxItem({
  key: 'totalAmountDebit',
  label: 'Tổng số tiền ghi nợ',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 50,
  // type: 'number',
  required: true,
});
export const TOTAL_AMOUNT_CREDIT = () => new TextboxItem({
  key: 'totalAmountCredit',
  label: 'Tổng số tiền ghi có',
  placeholder: '',
  value: '',
  layout: '50',
  // type: 'number',
  maxLength: 50,
  required: true,
});
export const AMOUNT_TRANSFER = () => new TextboxItem({
  key: 'amountTransfer',
  label: 'Tổng số tiền chuyển vốn',
  placeholder: '',
  value: '',
  layout: '50',
  // type: 'number',
  maxLength: 50,
  required: true,
});
export const INTEREST_OVN = () => new TextboxItem({
  key: 'interestOVN',
  label: 'Lãi suất qua đêm',
  placeholder: '',
  value: '',
  layout: '50',
  // type: 'number',
  maxLength: 50,
  required: true,
});
export const KEY_ID = () => new NgSelectItem({
  key: 'key',
  label: 'Key',
  placeholder: '',
  value: '',
  options: [
    { key: '', value: 'All' },
    { key: 'ACCOUNT_NAME_TREASURY', value: 'ACCOUNT_NAME_TREASURY' },
    { key: 'ACCOUNT_NO_TREASURY', value: 'ACCOUNT_NO_TREASURY' },
    { key: 'BANK_CODE', value: 'BANK_CODE' },
    { key: 'BANK_NAME', value: 'BANK_NAME' },
    { key: 'BUFFER_TIME', value: 'BUFFER_TIME' },
    { key: 'CHAR_RJCT', value: 'CHAR_RJCT' },
    { key: 'CUT_OFF_TIME', value: 'CUT_OFF_TIME' },
    { key: 'VOSTRO_ACCOUNT', value: 'VOSTRO_ACCOUNT' },
    { key: 'VOSTRO_NAME', value: 'VOSTRO_NAME' },
    { key: 'INTEREST_RATE_OVN', value: 'INTEREST_RATE_OVN' },
    { key: 'OFF_SERVICE', value: 'OFF_SERVICE' },
    { key: 'ENABLE_RECONCILE_JOB_VERSION', value: 'ENABLE_RECONCILE_JOB_VERSION' },
    { key: 'REFUND_ACCOUNT', value: 'REFUND_ACCOUNT' },
    { key: 'REFUND_ACCOUNT_NAME', value: 'REFUND_ACCOUNT_NAME' },
    { key: 'PERCENT', value: 'PERCENT' },

  ],
  layout: '30',
  maxLength: 50
});

export const KEY_ID_TEXT = () => new TextboxItem({
  key: 'key',
  label: 'Key',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 50
});

export const VALUE_ID = () => new TextboxItem({
  key: 'value',
  label: 'value',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 100
});

export const REFUND_FILE_STATE = () => new NgSelectItem({
  key: 'state',
  label: 'Trạng thái',
  value: '',
  options: [
    { key: '', value: 'All' },
    { key: 'NEW', value: 'Mới' },
    { key: 'AWAITING_APPROVAL', value: 'Chờ duyệt' },
    { key: 'APPROVED', value: 'Đã duyệt' },
    { key: 'REJECTED', value: 'Từ chối duyệt' },
  ],
  layout: '25',
  searchable: false,
});

export const REFUND_TRANSACTION_STATE = () => new NgSelectItem({
  key: 'state',
  label: 'Trạng thái',
  value: '',
  options: [
    { key: '', value: 'All' },
    { key: 'NEW', value: 'Mới' },
    { key: 'IMPORT_SUCCESS', value: 'Import thành công' },
    { key: 'IMPORT_FAILED', value: 'Import thất bại' },
    { key: 'AWAITING_APPROVAL', value: 'Chờ duyệt' },
    { key: 'PROCESSING_APPROVE', value: 'Đang xử lý duyệt' },
    { key: 'APPROVED', value: 'Đã duyệt' },
    { key: 'REJECTED', value: 'Từ chối duyệt' },
    { key: 'SUCCESS', value: 'Thành công' },
    { key: 'ERROR', value: 'Lỗi' },
  ],
  layout: '25',
  searchable: false,
});

export const FILE_NAME = () => new TextboxItem({
  key: 'fileName',
  label: 'Tên file',
  placeholder: '',
  value: '',
  layout: '30',
  maxLength: 100
});
