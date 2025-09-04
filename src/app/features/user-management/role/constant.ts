import {
  BUTTON_CREATE,
  BUTTON_SAVE,
  BUTTON_UNDO,
  TYPE_BTN_FOOTER,
} from '../../../public/constants';

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
  'view',
  'insert',
  'update',
  'delete',
  'assign',
  'retry',
  'reply',
  'approve'
];

export const BUTTON_DELETE_ROLE = {
  title: 'Xóa vai trò',
  classBtn: 'btn-light-blue',
  typeBtn: TYPE_BTN_FOOTER.TYPE_DELETE,
};

export enum ROLE_TYPE_NAME {
  //
  ADMIN = 'Admin',
  IT = 'User CNTT',
  BUSINESS = 'User nghiệp vụ',
  //
}
