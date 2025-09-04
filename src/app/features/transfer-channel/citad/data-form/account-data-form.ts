import { TextboxItem } from "@shared-sm";

export const ACCOUNT = () => new TextboxItem({
  key: 'accountNo',
  label: 'Tài khoản',
  placeholder: 'Nhập tài khoản',
  value: null,
  layout: '25',
  maxLength: 50,
  customDirectives: /[^A-Za-z0-9]*$/
});

export const REASON = () => new TextboxItem({
  key: 'reason',
  label: 'Mô tả',
  placeholder: 'Nhập mô tả',
  value: null,
  layout: '25',
  maxLength: 250
});
