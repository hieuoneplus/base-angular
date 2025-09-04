import {DateTimeItem, NgSelectItem, SlideItem, TextboxItem} from "@shared-sm";

export const ACCOUNT_NUMBER = () =>
  new TextboxItem({
    key: 'accountNo',
    label: 'Số tài khoản',
    placeholder: 'Số tài khoản',
    value: null,
    layout: '25',
    maxLength: 50,
  });

export const BANK = () =>
  new TextboxItem({
    key: 'bankCode',
    label: 'Mã ngân hàng',
    placeholder: 'Mã ngân hàng',
    value: null,
    layout: '50',
    maxLength: 50,
  });

  export const BANK_SEARCH = () =>
  new NgSelectItem({
    key: 'bankCode',
    label: 'Mã ngân hàng',
    placeholder: 'Mã ngân hàng',
    value: null,
    options: [],
    maxLength: 50,
  });

export const BANK_NAME = () =>
  new TextboxItem({
    key: 'bankName',
    label: 'Tên ngân hàng',
    placeholder: '-----',
    value: null,
    readOnly: true,
    layout: '25',
    maxLength: 50,
  });

export const ACCOUNT_TYPE = () =>
  new NgSelectItem({
    key: 'type',
    label: 'Loại tài khoản',
    placeholder: 'Loại tài khoản',
    value: null,
    layout: '25',
    options: [
      {
        key: 'DEBIT',
        value: 'Tài khoản ghi nợ', //debit -> Tài khoản ghi nợ
      },
      {
        key: 'CREDIT',
        value: 'Tài khoản ghi có', //credit -> Tài khoản ghi có
      },
    ],
    maxLength: 50,
  });

export const TRANS_TYPE = () =>
  new NgSelectItem({
    key: 'transactionType',
    label: 'Loại giao dịch',
    placeholder: 'Loại giao dịch',
    value: null,
    options: [
      {
        key: 'OUTWARD',
        value: 'Giao dịch chiều đi - MB phát lệnh', // outward -> Giao dịch chiều đi - MB phát lệnh
      },
      {
        key: 'INWARD',
        value: 'Giao dịch chiều về - MB nhận lệnh', // inward -> Giao dịch chiều về - MB nhận lệnh
      },
    ],
    layout: '50',
    maxLength: 50,
  });

export const STATUS = () =>
  new NgSelectItem({
    key: 'active',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    value: null,
    options: [
      {
        value: 'Hoạt động',
        key: 'true',
      },
      {
        value: 'Dừng hoạt động',
        key: 'false',
      },
    ],
    layout: '50',
    maxLength: 50,
  });

export const ACTIVE_SLIDE = () =>
  new SlideItem({
    key: 'activeSlide',
    label: 'Trạng thái :',
    value: true,
  });

export const ACTIVE_SLIDE_EDIT = () =>
  new SlideItem({
    key: 'active',
    label: 'Trạng thái :',
    value: true,
});

export const UPDATE_BY = () =>
    new TextboxItem({
        key: 'updatedBy',
        label: 'Người sửa đổi',
        placeholder: 'Nhập người sửa đổi',
        value: '',
        layout: '25',
    });

export const UPDATE_AT_FROM = () =>
    new DateTimeItem({
        key: 'updatedAtFrom',
        label: 'Ngày sửa đổi từ ngày',
        placeholder: 'Nhập ngày sửa đổi từ ngày',
        value: null,
        minDate: '1900-01-01',
    });

export const UPDATE_AT_TO = () =>
    new DateTimeItem({
        key: 'updatedAtTo',
        label: 'Ngày sửa đổi đến ngày',
        placeholder: 'Nhập ngày sửa đổi đến ngày',
        value: null,
    });

export const STATUS_LABEL_TRANSACTION_TYPE = [
  { key: '', value: 'Tất cả' },
  {
    key: 'OUTWARD',
    value: 'Giao dịch chiều đi - MB phát lệnh', // outward -> Giao dịch chiều đi - MB phát lệnh
  },
  {
    key: 'INWARD',
    value: 'Giao dịch chiều về - MB nhận lệnh', // inward -> Giao dịch chiều về - MB nhận lệnh
  },
]

export const STATUS_LABEL_ACCOUNT_TYPE = [
  { key: '', value: 'Tất cả' },
  {
    key: 'DEBIT',
    value: 'Tài khoản ghi nợ', //debit -> Tài khoản ghi nợ
  },
  {
    key: 'CREDIT',
    value: 'Tài khoản ghi có', //credit -> Tài khoản ghi có
  },
]