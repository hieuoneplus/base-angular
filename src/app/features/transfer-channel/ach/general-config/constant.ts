import {NgSelectItem, SlideItem, TextAreaItem, TextboxItem} from "@shared-sm";
import {generalTransactionWay} from "../constant";
//
// export const FUNCTION_CODE = () => new NgSelectItem({
//   key: 'functionCode',
//   label: 'Nghiệp vụ sử dụng',
//   placeholder: 'Chọn nghiệp vụ sử dụng',
//   value: null,
//   required: true,
//   layout: '25',
//   options: [
//     {
//       key: 'all',
//       value: 'Tất cả',
//     },
//     {
//       key: generalTransactionWay.NAPAS_TO_MB_REVERT,
//       value: generalTransactionWay.NAPAS_TO_MB_REVERT,
//     },
//     {
//       key: generalTransactionWay.NAPAS_TO_MB_MAKE,
//       value: generalTransactionWay.NAPAS_TO_MB_MAKE,
//     },
//     {
//       key: generalTransactionWay.MB_TO_NAPAS_MAKE,
//       value: generalTransactionWay.MB_TO_NAPAS_MAKE,
//     },
//     {
//       key: generalTransactionWay.ACH_CONFIG,
//       value: generalTransactionWay.ACH_CONFIG,
//     },
//     {
//       key: generalTransactionWay.ACH_GW,
//       value: generalTransactionWay.ACH_GW,
//     },
//   ],
// });


export const FUNCTION_CODE = () => new TextboxItem({
  key: 'functionCode',
  label: 'Nghiệp vụ sử dụng',
  placeholder: 'Nhập nghiệp vụ sử dụng',
  value: '',
  required: true,
  layout: '25',
  maxLength: 100
});

export const FUNCTION_CODE_GET = () => new TextboxItem({
  key: 'functionCode',
  label: 'Nghiệp vụ sử dụng',
  placeholder: 'Nhập nghiệp vụ sử dụng',
  value: '',
  layout: '25',
  maxLength: 100
});

export const KEY = () => new TextboxItem({
  key: 'key',
  label: 'Tham số cấu hình',
  placeholder: 'Nhập tham số cấu hình',
  value: '',
  required: true,
  layout: '25',
  maxLength: 100
});

export const KEY_GET = () => new TextboxItem({
  key: 'key',
  label: 'Tham số cấu hình',
  placeholder: 'Nhập tham số cấu hình',
  value: '',
  // required: true,
  layout: '25',
  maxLength: 100
});

// export const KEY = () => new NgSelectItem({
//   key: 'key',
//   label: 'Tham số cấu hình',
//   placeholder: 'Chọn tham số cấu hình',
//   value: null,
//   required: true,
//   layout: '25',
//   options: [],
// });

export const IS_ACTIVE = () => new NgSelectItem({
  key: 'isActive',
  label: 'Trạng thái',
  placeholder: 'Chọn trạng thái',
  value: null,
  layout: '25',
  options: [
    {
      key: 'all',
      value: 'Tất cả',
    },
    {
      key: 'Y',
      value: 'ACTIVE',
    },
    {
      key: 'N',
      value: 'INACTIVE',
    },
  ],
  maxLength: 50,
  searchable: false,
});


export const IS_ACTIVE_SLIDE = () => new SlideItem({
  key: 'isActive',
  value: true,
  label: 'Trạng thái'
});

export const VALUE = () => new TextboxItem({
  key: 'value',
  label: 'Giá trị',
  placeholder: 'Nhập giá trị',
  value: '',
  required: true,
  layout: '25',
  maxLength: 1000
});

export const VALUE_GET = () => new TextboxItem({
  key: 'value',
  label: 'Giá trị',
  placeholder: 'Nhập giá trị',
  value: '',
  // required: true,
  layout: '25',
  maxLength: 1000
});

export const DESCRIPTION = () => new TextAreaItem({
  key: 'description',
  value: '',
  required: true,
  label: 'Mô tả',
  placeholder: "Nhập mô tả",
  maxLength: 200
});

export const DESCRIPTION_EDIT = () => new TextAreaItem({
  key: 'description',
  value: '',
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
