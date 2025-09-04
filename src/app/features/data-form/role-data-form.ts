import {NgSelectItem, SlideItem, TextAreaItem, TextboxItem} from "@shared-sm";

export const TYPE_ROLE_SELECT = () => new NgSelectItem({
    key: 'type',
    label: 'Loại vai trò',
    placeholder: 'Chọn loại vai trò',
    value: null,
    options: [
        {
            value: 'Tất cả',
            key: null,
        },
        {
            value: 'Admin',
            key: 'ADMIN',
        },
        {
            value: 'User CNTT',
            key: 'IT',
        },
        {
            value: 'User nghiệp vụ',
            key: 'BUSINESS',
        },
    ],
    layout: '25',
    maxLength: 50,
    // type: 'multiple',
});

export const STATUS_ROLE = () => new NgSelectItem({
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

export const ROLE_CODE = () => new TextboxItem({
    key: 'code',
    label: 'Mã vai trò',
    placeholder: 'Nhập mã vai trò',
    value: '',
    layout: '25',
    maxLength: 50,
    customDirectives: /[^A-Za-z0-9-_]*$/
    // directives: 'roleCode'
});

export const ROLE_NAME = () => new TextboxItem({
    key: 'name',
    label: 'Tên vai trò',
    placeholder: 'Nhập tên vai trò',
    value: '',
    layout: '25',
    maxLength: 250
});


export const ACTIVITY_STATUS = () => new SlideItem({
  key: 'active',
  value: true,
  label: 'Trạng thái'
});

export const DESCRIPTION = () => new TextboxItem({
  key: 'description',
  value: '',
  label: 'Mô tả',
  placeholder: "Nhập mô tả",
  maxLength: 2000
});


export const TYPE_ROLE_SELECT_CREATE = () => new NgSelectItem({
    key: 'type',
    label: 'Loại vai trò',
    placeholder: 'Chọn loại vai trò',
    value: null,
    options: [
        // {
        //     value: 'Admin',
        //     key: 'ALL',
        // },
        {
            value: 'User CNTT',
            key: 'IT',
        },
        {
            value: 'User nghiệp vụ',
            key: 'BUSINESS',
        },
    ],
    layout: '25',
    maxLength: 50
});