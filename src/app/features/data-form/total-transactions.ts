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


export const BANK_CODE = () => new TextboxItem({
  key: 'bankCode',
  label: 'Mã ngân hàng',
  placeholder: 'Mã ngân hàng',
  value: null,
  layout: '25',
  maxLength: 50
});

export const BANK_NAME = () => new TextboxItem({
  key: 'bankName',
  label: 'Tên ngân hàng',
  placeholder: 'Tên ngân hàng',
  value: null,
  layout: '25',
  maxLength: 50
});

export const MAX_TRANS = () => new TextboxItem({
  key: 'maxTrans',
  label: 'Tổng GD trong ngày',
  placeholder: 'Tổng GD trong ngày',
  value: '',
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
        "bankCode": "124423",
        "bankName": "VCB",
        "maxTrans": "10000",
        "status": true,
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
