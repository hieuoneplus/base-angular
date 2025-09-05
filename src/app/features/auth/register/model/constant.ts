import { TextboxItem } from '@shared-sm';

export const USERNAME = () => new TextboxItem({
  key: 'username',
  label: 'Tên đăng nhập',
  placeholder: 'Nhập tên đăng nhập',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true,
  minLength: 3
});

export const EMAIL = () => new TextboxItem({
  key: 'email',
  label: 'Email',
  placeholder: 'Nhập địa chỉ email',
  value: null,
  layout: '25',
  maxLength: 100,
  required: true,
  pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
});

export const FULL_NAME = () => new TextboxItem({
  key: 'fullName',
  label: 'Họ và tên',
  placeholder: 'Nhập họ và tên',
  value: null,
  layout: '25',
  maxLength: 100,
  required: true,
  minLength: 2
});

export const PHONE_NUMBER = () => new TextboxItem({
  key: 'phoneNumber',
  label: 'Số điện thoại',
  placeholder: 'Nhập số điện thoại',
  value: null,
  layout: '25',
  maxLength: 15,
  required: true,
  pattern: '^[0-9]{10,15}$'
});

export const PASSWORD = () => new TextboxItem({
  key: 'password',
  label: 'Mật khẩu',
  placeholder: 'Nhập mật khẩu',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true,
  minLength: 6
});

export const CONFIRM_PASSWORD = () => new TextboxItem({
  key: 'confirmPassword',
  label: 'Xác nhận mật khẩu',
  placeholder: 'Nhập lại mật khẩu',
  value: null,
  layout: '25',
  maxLength: 50,
  required: true
});

