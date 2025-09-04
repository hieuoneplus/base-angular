import {NgSelectItem, SlideItem, TextAreaItem, TextboxItem} from "@shared-sm";

export const FUNCTION_CODE = () => new NgSelectItem({
  key: 'functionCode',
  label: 'Nghiệp vụ sử dụng',
  placeholder: 'Chọn nghiệp vụ sử dụng',
  value: null,
  required: true,
  layout: '25',
  options: [
    {
      key: intermediateTransactionWay.MB_TO_NAPAS_MAKE,
      value: 'Thanh toán chiều đi',
    },
    {
      key: intermediateTransactionWay.NAPAS_TO_MB_MAKE,
      value: 'Thanh toán chiều về',
    },
  ],
});

export const FUNCTION_CODE_GET = () => new NgSelectItem({
  key: 'functionCode',
  label: 'Nghiệp vụ sử dụng',
  placeholder: 'Chọn nghiệp vụ sử dụng',
  value: null,
  layout: '25',
  options: [
    {
      key: '',
      value: 'Tất cả',
    },
    {
      key: intermediateTransactionWay.MB_TO_NAPAS_MAKE,
      value: 'Thanh toán chiều đi',
    },
    {
      key: intermediateTransactionWay.NAPAS_TO_MB_MAKE,
      value: 'Thanh toán chiều về',
    },
  ],
});

export const ACCOUNT_TYPE = () => new NgSelectItem({
  key: 'accountType',
  label: 'Loại tài khoản',
  placeholder: 'Chọn loại tài khoản',
  required: true,
  value: null,
  layout: '25',
  options: [
    {
      key: 'CARD',
      value: 'CARD',
    },
    {
      key: 'ACCOUNT',
      value: 'ACCOUNT',
    },
  ],
  maxLength: 50
});

export const ACCOUNT_TYPE_GET = () => new NgSelectItem({
  key: 'accountType',
  label: 'Loại tài khoản',
  placeholder: 'Chọn loại tài khoản',
  value: null,
  layout: '25',
  options: [
    {
      key: 'CARD',
      value: 'CARD',
    },
    {
      key: 'ACCOUNT',
      value: 'ACCOUNT',
    },
  ],
  maxLength: 50
});

export const IS_ACTIVE = () => new NgSelectItem({
  key: 'isActive',
  label: 'Trạng thái',
  placeholder: 'Chọn trạng thái',
  value: null,
  layout: '25',
  searchable: false,
  options: [
    {
      key: '',
      value: 'Tất cả',
    },
    {
      key: 'Y',
      value: 'Đang hoạt động',
    },
    {
      key: 'N',
      value: 'Dừng hoạt động',
    },
  ],
  maxLength: 50
});


export const IS_ACTIVE_SLIDE = () => new SlideItem({
  key: 'isActive',
  value: true,
  label: 'Trạng thái'
});

export const ACCOUNT_NUMBER = () => new TextboxItem({
  key: 'accountNumber',
  label: 'Số tài khoản trung gian',
  placeholder: 'Nhập số tài khoản trung gian',
  value: '',
  required: true,
  layout: '25',
  maxLength: 100
});

export const ACCOUNT_NUMBER_GET = () => new TextboxItem({
  key: 'accountNumber',
  label: 'Số tài khoản trung gian',
  placeholder: 'Nhập số tài khoản trung gian',
  value: '',
  layout: '25',
  maxLength: 100
});

export const ACCOUNT_NAME = () => new TextboxItem({
  key: 'accountName',
  label: 'Tên tài khoản trung gian',
  placeholder: 'Nhập tên tài khoản trung gian',
  value: '',
  required: true,
  layout: '25',
  maxLength: 200
});

export const ACCOUNT_NAME_GET = () => new TextboxItem({
  key: 'accountName',
  label: 'Tên tài khoản trung gian',
  placeholder: 'Nhập tên tài khoản trung gian',
  value: '',
  layout: '25',
  maxLength: 200
});

export const CURRENCY = () =>  new TextboxItem({
  key: 'currency',
  label: 'Loại tiền',
  placeholder: 'Nhập loại tiền',
  value: '',
  required: true,
  layout: '25',
  maxLength: 50
});


export const DESCRIPTION = () => new TextAreaItem({
  key: 'description',
  value: '',
  required: true,
  label: 'Mô tả',
  placeholder: "Nhập mô tả",
  maxLength: 200
});

export const REASON = () => new TextAreaItem({
  key: 'reason',
  value: '',
  label: 'Lý do',
  placeholder: "Nhập mô tả",
  maxLength: 2000
});

export const intermediateTransactionWay = {
  MB_TO_NAPAS_MAKE: "MB_TO_NAPAS_MAKE",
  NAPAS_TO_MB_MAKE: "NAPAS_TO_MB_MAKE"
}
