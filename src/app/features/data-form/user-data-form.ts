import { NgSelectItem, SlideItem, TextboxItem } from "@shared-sm";

export const ROLES_SELECT = () => new TextboxItem({
    key: 'roleCode',
    label: 'Mã vai trò',
    placeholder: 'Nhập mã vai trò',
    value: null,
    options: [],
    layout: '50',
    maxLength: 50
});

export const ROLE_NAME = () => new TextboxItem({
    key: 'roleName',
    label: 'Tên vai trò',
    placeholder: 'Nhập tên vai trò',
    value: '',
    layout: '25',
    maxLength: 250
});

export const USER_NAME = () => new TextboxItem({
    key: 'username',
    label: 'Tên đăng nhập',
    placeholder: 'Nhập tên đăng nhập',
    value: '',
    layout: '50',
    maxLength: 150
});

export const FUll_NAME = () => new TextboxItem({
    key: 'fullName',
    label: 'Họ và tên',
    placeholder: 'Nhập họ và tên',
    value: '',
    layout: '50',
    maxLength: 150
});

export const PHONE_NUMBER = () => new TextboxItem({
    key: 'phoneNumber',
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại',
    value: '',
    layout: '50',
    maxLength: 50
});

export const STATUS_USER = () => new NgSelectItem({
    key: 'active',
    label: 'Trạng thái',
    placeholder: 'Chọn trạng thái',
    value: null,
    options: [
        {
            value: 'Tất cả',
            key: null,
        },
        {
            value: 'Đang hoạt động',
            key: '1',
        },
        {
            value: 'Dừng hoạt động',
            key: '0',
        },
    ],
    layout: '50',
    maxLength: 50,
    searchable: false,
});

export const EMPLOYEE_CODE = () => new TextboxItem({
    key: 'employeeCode',
    label: 'Mã nhân viên',
    placeholder: 'Mã nhân viên',
    value: '',
    layout: '50',
    maxLength: 150
});

export const EMAIL = () => new TextboxItem({
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    value: '',
    layout: '50',
    maxLength: 150
});

export const A_TITLE = () => new TextboxItem({
    key: 'aTitle',
    label: 'Chức danh',
    placeholder: 'Chức danh',
    value: '',
    layout: '50',
    maxLength: 50
});

export const UNIT = () => new TextboxItem({
    key: 'unit',
    label: 'Đơn vị',
    placeholder: 'Đơn vị',
    value: '',
    layout: '50',
    maxLength: 150
});

export const ACTIVE_SLIDE = () => new SlideItem({
    key: 'active',
    // placeholder: 'Trạng thái  :',
    label: 'Trạng thái  :',
    value: true,
    // label: 'before'
});

export const SELECTED_SEARCH_VALUE_ROLE = () => new NgSelectItem({
    key: 'selectedSearchValueRole',
    value: 'name',
    placeholder: 'Chọn kiểu tìm kiếm',
    options: [
        {
            key: 'name',
            value: 'Tên vai trò'
        },
        {
            key: 'code',
            value: 'Mã vai trò'
        },
    ]
});
