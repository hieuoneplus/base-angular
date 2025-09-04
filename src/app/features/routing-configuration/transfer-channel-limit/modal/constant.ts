import { DateTimeItem, NgSelectItem, TextboxItem } from '@shared-sm';
import {
  BUTTON_CREATE,
  BUTTON_SAVE,
  BUTTON_UNDO,
} from '../../../../public/constants';

export const displayedColumnsBC: string[] = [
  'stt',
  'bankCode',
  'cardBin',
  'transferChannel',
  'status',
  'actions',
];

export const EXPAND_CHANNELS: string[] = ['ACH', 'IBFT', 'NAPAS2'];

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

export const BUTTON_BACK = {
  ...BUTTON_UNDO,
  title: 'Hủy',
  icon: null,
};

export const BUTTON_CREATE_ROLE = {
  ...BUTTON_CREATE,
  title: 'Thêm mới',
  icon: null,
};

export const BUTTON_UPDATE_ROLE = {
  ...BUTTON_SAVE,
  title: 'Cập nhật',
  icon: null,
};

// Table view
export const displayedColumns: string[] = [
  'name',
  'get',
  'post',
  'put',
  'delete',
  'history',
];

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

export const STATUS = () =>
  new NgSelectItem({
    key: 'active',
    label: 'Trạng thái',
    placeholder: 'Chọn trạng thái',
    value: null,
    options: [
      {
        key: null,
        value: 'Tất cả',
   },
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

export const CHANNEL = () =>
  new NgSelectItem({
    key: 'transferChannel',
    label: 'Kênh chuyển tiền',
    placeholder: 'Chọn kênh chuyển tiền',
    value: null,
    options: [
      {
        value: 'INHOUSE',
        key: 'INHOUSE',
      },
      {
        value: 'ACH',
        key: 'ACH',
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
        value: 'NAPAS2',
        key: 'NAPAS2',
      },
      {
        value: 'CITAD',
        key: 'CITAD',
      },
      {
        value: 'BIDV',
        key: 'BIDV',
      },
      {
        value: 'VCB',
        key: 'VCB',
      },
      // {
      //   value: 'SML',
      //   key: 'SML',
      // },
    ],
    layout: '50',
    maxLength: 50,
  });

export const MIN_AMOUNT = () =>
  new TextboxItem({
    key: 'minAmount',
    label: 'Số tiền tối thiểu',
    placeholder: 'Số tiền tối thiểu',
    value: null,
    layout: '25',
    toolTipInfo: 'Yêu cầu:\n• Nhập số > 0, cho phép nhập số nguyên',
    maxLength: 23,
  });

export const MAX_AMOUNT = () =>
  new TextboxItem({
    key: 'maxAmount',
    label: 'Số tiền tối đa',
    placeholder: 'Số tiền tối đa',
    value: null,
    layout: '25',
    maxLength: 23,
    toolTipInfo:
      'Yêu cầu:\n• Nhập số > 0, cho phép nhập số nguyên\n• Số tiền tối đa > Số tiền tối thiểu\n• Số tiền tối đa > Số tiền mặc định của 1 giao dịch tách lệnh + Số tiền tối thiểu',
  });

export const CURRENCY = () =>
  new TextboxItem({
    key: 'currency',
    label: 'Đơn vị tiền',
    value: 'VND',
    layout: '25',
    maxLength: 50,
  });

export const FRAGMENT_MAX_AMOUNT = () =>
  new TextboxItem({
    key: 'fragmentMaxAmount',
    label: 'Số tiền tối đa được tách lệnh',
    placeholder: 'Nhập số tiền',
    value: null,
    layout: '25',
    maxLength: 23,
    toolTipInfo:
    'Yêu cầu:\n• Nhập số > 0, cho phép nhập số nguyên\n• Số tiền tối đa được tách lệnh > Số tiền mặc định của 1 giao dịch tách lệnh\n• Số tiền tối đa được tách lệnh > số tiền tối đa',
  });

export const FRAGMENT_AMOUNT = () =>
  new TextboxItem({
    key: 'fragmentAmount',
    label: 'Số tiền mặc định của 1 giao dịch tách lệnh',
    placeholder: 'Nhập số tiền',
    value: null,
    layout: '25',
    maxLength: 23,
    toolTipInfo:
    'Yêu cầu:\n• Nhập số > 0, cho phép nhập số nguyên\n• Số tiền mặc định của 1 giao dịch tách lệnh > Số tiền tối thiểu\n• Số tiền mặc định của 1 giao dịch tách lệnh < Số tiền tối đa\n• Số tiền tối đa > Số tiền mặc định của 1 giao dịch tách lệnh + Số tiền tối thiểu',

  });
