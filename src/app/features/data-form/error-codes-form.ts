import {NgSelectItem, SlideItem, TextAreaItem, TextboxItem} from "@shared-sm";


export const CHANNEL = () => new NgSelectItem({
  key: 'transferChannel',
  label: 'Kênh chuyển tiền',
  placeholder: 'Chọn kênh chuyển tiền',
  value: null,
  options: [
    {
      value: 'BILATERAL',
      key: 'BILATERAL',
    },
    {
      value: 'IBFT',
      key: 'IBFT',
    },
    {
      value: 'CITAD',
      key: 'CITAD',
    },
    {
      value: 'ACH',
      key: 'ACH',
    },
  ],
  layout: '50',
  maxLength: 50
});

export const TYPE = () => new NgSelectItem({
  key: 'type',
  label: 'Phân loại',
  placeholder: 'Phân loại',
  value: null,
  options: [
    {
      value: 'Tường minh',
      key: 'true',
    },
    {
      value: 'Không Tường minh',
      key: 'false',
    },
  ],
  layout: '50',
  maxLength: 50
});

export const ERROR_CODE = () => new TextboxItem({
  key: 'errorCode',
  label: 'Mã lỗi',
  placeholder: 'Mã lỗi',
  value: null,
  layout: '25',
  maxLength: 50
});

export const ORIGINAL_SERVICE = () => new TextboxItem({
  key: 'originalService',
  label: 'Original Service',
  placeholder: 'Original Service',
  value: null,
  layout: '25',
  maxLength: 50
});

export const ERROR_DESC = () => new TextboxItem({
  key: 'errorDesc',
  label: 'Mô tả lỗi',
  placeholder: 'Mô tả lỗi',
  value: null,
  layout: '25',
  maxLength: 50
});



export const JSON_EX = {
  "data": {

    "page": 0,
    "size": 10,
    "total": 20,
    "content": [
      {
        "stt": 0,
        "id": "15",
        "transferChannel": "BILATERAL",
        "errorCode": "124423",
        "errorDesc": "VCB",
        "type":true,
        "originalService":"ADMIN",
        "active": true,
      }
    ]
  }
}

export const STATUS = () => new NgSelectItem({
  key: 'active',
  label: 'Trạng thái',
  placeholder: 'Trạng thái',
  value: null,
  options: [
       {
            key: null,
            value: 'Tất cả',
       },
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

export const ACTIVE_SLIDE = () => new SlideItem({
  key: 'activeSlide',
  label: 'Status',
  value: true
});
