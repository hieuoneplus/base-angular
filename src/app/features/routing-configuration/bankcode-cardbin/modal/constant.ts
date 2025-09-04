import { DateTimeItem, NgSelectItem, TextboxItem } from '@shared-sm';

export const displayedColumnsBC: string[] = [
  'stt',
  'bankCode',
  'cardBin',
  'transferChannel',
  'status',
  'actions',
];

export const displayedColumnsBCAdd: string[] = [
  'stt',
  'transferChannel',
  'status',
  'actions',
];
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

export const TRANSFER_CHANNEL = () =>
  new NgSelectItem({
    key: 'transferChannel',
    label: 'Kênh thực hiện thanh toán',
    placeholder: 'Chọn kênh thực hiện thanh toán',
    value: null,
    options: [
      {
        value: 'INHOUSE',
        key: 'INHOUSE',
      },
      {
        value: 'BILATERAL',
        key: 'BILATERAL',
      },
      {
        value: 'IBFT',
        key: 'IBFT',
      },
      {
        value: 'ACH',
        key: 'ACH',
      },
      {
        value: 'BIDV',
        key: 'BIDV',
      },
      {
        value: 'CITAD',
        key: 'CITAD',
      },
      {
        value: 'VCB',
        key: 'VCB',
      },
      {
        value: 'NAPAS2',
        key: 'NAPAS2',
      },
    ],
    layout: '50',
    maxLength: 50,
  });

export const TRANSFER_CHANNEL_ADD = () =>
  new NgSelectItem({
    key: 'transferChannel',
    placeholder: 'Chọn kênh thực hiện thanh toán',
    value: null,
    options: [
      {
        value: 'INHOUSE',
        key: 'INHOUSE',
      },
      {
        value: 'BILATERAL',
        key: 'BILATERAL',
      },
      {
        value: 'IBFT',
        key: 'IBFT',
      },
      {
        value: 'ACH',
        key: 'ACH',
      },
      {
        value: 'BIDV',
        key: 'BIDV',
      },
      {
        value: 'CITAD',
        key: 'CITAD',
      },
      {
        value: 'VCB',
        key: 'VCB',
      },
      {
        value: 'NAPAS2',
        key: 'NAPAS2',
      },
    ],
    layout: '50',
    maxLength: 50,
  });

export const BANK_CODE = () =>
  new NgSelectItem({
    key: 'bankCode',
    label: 'Mã ngân hàng',
    placeholder: 'Nhập mã ngân hàng',
    value: null,
    layout: '50',
    maxLength: 50,
    options: [],
    searchable: true,
    required: true,
  });

export const CARD_BIN = () =>
  new NgSelectItem({
    key: 'cardBin',
    label: 'Cardbin',
    placeholder: 'Nhập cardbin',
    value: null,
    layout: '50',
    maxLength: 50,
    options: [],
    searchable: true,
    required: false,
  });

export const BANK_CODE_SEARCH = () =>
  new NgSelectItem({
    key: 'bankCode',
    label: 'Mã ngân hàng',
    placeholder: 'Mã ngân hàng',
    value: null,
    options: [],
    maxLength: 50,
  });

export const CARD_BIN_SEARCH = () =>
  new TextboxItem({
    key: 'cardBin',
    label: 'Cardbin',
    placeholder: 'Nhập cardbin',
    value: null,
    layout: '50',
    maxLength: 50,
  });

export const STATUS = () =>
  new NgSelectItem({
    key: 'active',
    label: 'Trạng thái',
    placeholder: 'Chọn trạng thái',
    value: null,
    options: [
      {
        value: 'Đang hoạt động',
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
  new NgSelectItem({
    key: 'activeSlide',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    value: 'true',
    options: [
      {
        value: 'Đang hoạt động',
        key: 'true',
      },
      {
        value: 'Dừng hoạt động',
        key: 'false',
      },
    ],
    layout: '50',
    maxLength: 50,
    searchable: false,
  });

export const SELECT_CHANNEL = [
  {
    value: 'INHOUSE',
    key: 'INHOUSE',
  },
  {
    value: 'BILATERAL',
    key: 'BILATERAL',
  },
  {
    value: 'IBFT',
    key: 'IBFT',
  },
  {
    value: 'ACH',
    key: 'ACH',
  },
  {
    value: 'BIDV',
    key: 'BIDV',
  },
  {
    value: 'CITAD',
    key: 'CITAD',
  },
  {
    value: 'VCB',
    key: 'VCB',
  },
];
