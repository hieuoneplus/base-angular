import { DateTimeItem, NgSelectItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "../../../../public/constants";

export const UPDATE_BY = () => new TextboxItem({
  key: 'updatedBy',
  label: 'Người sửa đổi',
  placeholder: 'Nhập người sửa đổi',
  value: '',
  layout: '25',
});

export const UPDATE_AT_FROM = () => new DateTimeItem({
  key: 'updatedAtFrom',
  label: 'Ngày sửa đổi từ ngày',
  placeholder: 'Nhập ngày sửa đổi từ ngày',
  value: null,
  minDate: '1900-01-01',
});

export const UPDATE_AT_TO = () => new DateTimeItem({
  key: 'updatedAtTo',
  label: 'Ngày sửa đổi đến ngày',
  placeholder: 'Nhập ngày sửa đổi đến ngày',
  value: null,
});

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


export const STATUS_TRANSACTION = {
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
};

export const STATUS_LABEL_TRANSACTION = [
  {
    key: STATUS_TRANSACTION.REJECTED,
    value: 'Đã từ chối',
    class: 'wf-status-reject',
  },
  {
    key: STATUS_TRANSACTION.WAITING_APPROVAL,
    value: 'Chờ duyệt',
    class: 'wf-status-cancel',
  },
  {
    key: STATUS_TRANSACTION.APPROVED,
    value: 'Đã duyệt',
    class: 'wf-status-approved',
  },
];
export const CHANNEL_ALL = () => new NgSelectItem({
  key: 'transferChannel',
  label: 'Kênh thực hiện thanh toán',
  placeholder: 'Kênh thực hiện thanh toán',
  value: null,
  options: SELECT_CHANNEL,
  layout: '50',
  maxLength: 50
});

export const CHANNEL = () => new NgSelectItem({
  key: 'transferChannel',
  label: 'Kênh thực hiện thanh toán',
  placeholder: 'Kênh thực hiện thanh toán',
  value: null,
  options: SELECT_CHANNEL,
  layout: '50',
  maxLength: 50
});

export const ACCOUNT_NUMBER = () => new TextboxItem({
  key: 'accountNo',
  label: 'Số tài khoản',
  placeholder: 'Số tài khoản',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true
});
export const ACCOUNT_NUMBER_SEARCH = () => new TextboxItem({
  key: 'accountNo',
  label: 'Số tài khoản',
  placeholder: 'Số tài khoản',
  value: null,
  layout: '25',
  maxLength: 50,
});

export const BANK = () => new NgSelectItem({
  key: 'bankCode',
  label: 'Mã ngân hàng',
  placeholder: 'Mã ngân hàng',
  value: null,
  layout: '50',
  maxLength: 50,
  options: [],
  searchable: true,
  required: true
});

export const BANK_SEARCH = () => new NgSelectItem({
  key: 'bankCode',
  label: 'Mã ngân hàng',
  placeholder: 'Mã ngân hàng',
  value: null,
  layout: '50',
  maxLength: 50,
  options: [],
});

export const BANK_NAME = () => new TextboxItem({
  key: 'bankName',
  label: 'Tên ngân hàng',
  placeholder: '-----',
  value: null,
  // readOnly: true,
  layout: '25',
  maxLength: 50,
});

export const STATUS = () => new NgSelectItem({
  key: 'active',
  label: 'Trạng thái',
  placeholder: 'Trạng thái',
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


export const APPROVE_STATUS = () => new NgSelectItem({
  key: 'approvalStatus',
  label: 'Trạng thái phê duyệt',
  placeholder: 'Trạng thái phê duyệt',
  value: null,
  options: [
    {
      value: 'Chờ duyệt',
      key: 'WAITING_APPROVAL',
    },
    {
      value: 'Đã từ chối',
      key: 'REJECTED',
    },
    {
      value: 'Đã duyệt',
      key: 'APPROVED',
    },
  ],
  layout: '50',
  maxLength: 50,
  searchable: false,
});

// export const ACTIVE_SLIDE = () => new SlideItem({
//   key: 'activeSlide',
//   label: 'Trạng thái :',
//   value: true
// });

export const ACTIVE_SLIDE = () => new NgSelectItem({
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
    value: 'NAPAS2',
    key: 'NAPAS2',
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
]