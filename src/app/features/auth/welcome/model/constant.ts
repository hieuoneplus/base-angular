import {DateTimeItem, NgSelectItem, TextboxItem} from '@shared-sm';

export const USERNAME = () => new TextboxItem({
  key: 'username',
  label: 'Tên đăng nhập',
  placeholder: 'Nhập tên đăng nhập',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true
});

export const PASSWORD = () => new TextboxItem({
  key: 'password',
  label: 'Mật khẩu',
  placeholder: 'Nhập mật khẩu',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true
});

