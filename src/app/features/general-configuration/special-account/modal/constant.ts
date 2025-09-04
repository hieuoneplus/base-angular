import { DateTimeItem, NgSelectItem, SlideItem, TextAreaItem, TextboxItem } from '@shared-sm';

export const STATUS_FORM = [
  { key: '', value: 'Tất cả trạng thái', class: '' },
  { key: 'false', value: 'Dừng hoạt động', class: 'wf-status-reject' },
  { key: 'DELETED', value: 'Vô hiệu', class: 'wf-status-cancel' },
  { key: 'APPROVED', value: 'Phê duyệt', class: 'wf-status-approved' },
  { key: 'true', value: 'Đang hoạt động', class: 'wf-status-approved' },
  { key: 'REJECTED', value: 'Từ chối', class: 'wf-status-reject' },
  { key: 'WAITING_APPROVAL', value: 'Chờ duyệt', class: 'wf-status-cancel' },
  { key: 'D', value: 'Hủy', class: 'wf-status-reject' },
];

export const displayedColumnsHistory: string[] = [
  'stt',
  'accountType',
  'regex',
  'partnerAccount',
  'partnerType',
  'getNameUrl',
  'confirmUrl',
  'protocol',
  'channel',
  'minTransLimit',
  'maxTransLimit',
  'partnerPublicKey',
  'mbPrivateKey',
  'isRetryConfirm',
  'active',
  'approvalStatus',
  'type',
  'updatedAt',
  'updatedBy',
  'reason',
  'actions',
];

export const UPDATED_BY = () =>
  new TextboxItem({
    key: 'updatedBy',
    label: 'Người sửa đổi',
    placeholder: 'Nhập người sửa đổi',
    value: '',
    layout: '25',
    maxLength: 50,
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
export const STATUS_APPROVAL = {
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
};

export const ACTIVE_SLIDE = () => new SlideItem({
  key: 'activeSlide',
  label: 'Trạng thái :',
  value: true
});

export const ACCOUNT_TYPE = () => new TextboxItem({
  key: 'name',
  label: 'Loại tài khoản',
  placeholder: 'Loại tài khoản',
  value: null,
  layout: '25',
  maxLength: 50
});


export const STATUS = () => new NgSelectItem({
  key: 'active',
  label: 'Trạng thái',
  placeholder: 'Trạng thái',
  value: null,
  options: [
    // {
    //   key: '',
    //   value: 'Chọn trạng thái',
    // },
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
  searchable: false,
});

export const ACCOUNT_NUMBER = () => new TextboxItem({
  key: 'partnerAccount',
  label: 'Số tài khoản chuyên thu',
  placeholder: 'Số tài khoản chuyên thu',
  value: null,
  layout: '25',
  maxLength: 50
});


export const URL_NAME = () => new TextboxItem({
  key: 'getNameUrl',
  label: 'URL truy vấn tên',
  placeholder: 'Nhập URL truy vấn tên',
  value: null,
  layout: '25',
  maxLength: 200
});


export const URL_CALLBACK = () => new TextboxItem({
  key: 'confirmUrl',
  label: 'URL báo có',
  placeholder: 'Nhập URL báo có',
  value: null,
  layout: '25',
  maxLength: 200
});


export const PROTOCOL = () => new TextboxItem({
  key: 'protocol',
  label: 'Protocol',
  placeholder: 'Nhập Protocol',
  value: null,
  layout: '25',
  maxLength: 50
});


export const KEY = () => new TextboxItem({
  key: 'regex',
  label: 'Dấu hiệu nhận biết',
  placeholder: 'Nhập dấu hiệu nhận biết',
  value: null,
  layout: '25',
  maxLength: 50
});

export const PARTNER_TYPE = () => new NgSelectItem({
  key: 'partnerType',
  label: 'Phân loại tài khoản',
  placeholder: 'Phân loại tài khoản',
  options: [
    {
      value: 'NORMAL_PARTNER',
      key: 'NORMAL_PARTNER',
    },
    {
      value: 'SPECIAL_PARTNER',
      key: 'SPECIAL_PARTNER',
    },
  ],
  value: null,
  layout: '25',
  maxLength: 50
});

export const CHANNEL = () => new TextboxItem({
  key: 'channel',
  label: 'Kênh',
  placeholder: 'Kênh',
  value: null,
  layout: '25',
  maxLength: 10
});

export const MIN_LIMIT = () => new TextboxItem({
  key: 'minTransLimit',
  label: 'Số tiền tối thiểu',
  placeholder: 'Số tiền tối thiểu',
  value: null,
  layout: '25',
  maxLength: 25
});

export const MAX_LIMIT = () => new TextboxItem({
  key: 'maxTransLimit',
  label: 'Số tiền tối đa',
  placeholder: 'Số tiền tối đa',
  value: null,
  layout: '25',
  maxLength: 25
});

export const PUBLIC_KEY = () => new TextAreaItem({
  key: 'partnerPublicKey',
  label: 'PUBLIC_KEY phía đối tác',
  placeholder: 'PUBLIC_KEY phía đối tác',
  value: null,
  layout: '25',
  maxLength: 2000
});

export const PRIVATE_KEY = () => new TextboxItem({
  key: 'mbPrivateKey',
  label: 'PRIVATE_KEY tại MB',
  placeholder: 'PRIVATE_KEY tại MB',
  value: null,
  layout: '25',
  maxLength: 2000
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
      value: 'Từ chối',
      key: 'REJECTED',
    },
    {
      value: 'Phê duyệt',
      key: 'APPROVED',
    },
  ],
  layout: '50',
  maxLength: 50,
  searchable: false,
});
