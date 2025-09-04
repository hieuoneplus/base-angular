import {DateTimeItem, NgSelectItem, TextboxItem} from '@shared-sm';

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

// Table view
export const displayedColumns: string[] = [
  'name',
  'get',
  'post',
  'put',
  'delete',
  'history',
];

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

export const ACTIVE = () =>
  new NgSelectItem({
    key: 'active',
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

export const CITY_CODE = () => new TextboxItem({
  key: 'cityCode',
  label: 'Mã tỉnh thành',
  placeholder: 'Nhập mã tình thành',
  value: '',
  layout: '25',
  maxLength: 50
});

export const CITY_NAME = () => new TextboxItem({
  key: 'cityName',
  label: 'Tên tỉnh thành',
  placeholder: 'Nhập tên tỉnh thành',
  value: '',
  layout: '25',
  maxLength: 250
});

export const DESCRIPTION = () => new TextboxItem({
  key: 'description',
  label: 'Mô tả',
  placeholder: 'Nhập mô tả',
  value: '',
  layout: '25',
  maxLength: 2000
});

