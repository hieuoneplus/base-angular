import {NgSelectItem, SlideItem, TextAreaItem, TextboxItem} from "@shared-sm";


export const CHANNEL = () => new NgSelectItem({
  key: 'transferChannel',
  label: 'Tên kênh chuyển tiền',
  placeholder: 'Tên kênh chuyển tiền',
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


export const MIN_AMOUNT = () => new TextboxItem({
  key: 'minAmount',
  label: 'Số tiền tối thiểu',
  placeholder: 'Số tiền tối thiểu',
  value: null,
  layout: '25',
  maxLength: 50
});

export const MAX_AMOUNT = () => new TextboxItem({
  key: 'maxAmount',
  label: 'Số tiền tối đa',
  placeholder: 'Số tiền tối đa',
  value: null,
  layout: '25',
  maxLength: 50
});

export const CURRENCY = () => new TextboxItem({
  key: 'currency',
  label: 'Loại tiền',
  placeholder: 'Loại tiền',
  value: 'VND',
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
        "transferChannel": "25619819",
        "minAmount": "0",
        "maxAmount": "200000000",
        "currency": "VND"
      }
    ]
  }
}
