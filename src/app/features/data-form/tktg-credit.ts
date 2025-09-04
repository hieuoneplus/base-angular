import {NgSelectItem, TextboxItem} from "@shared-sm";

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
    {
      value: 'IBFT',
      key: 'IBFT',
    },
    {
      value: 'INHOUSE',
      key: 'INHOUSE',
    },
    {
      value: 'NAPAS2',
      key: 'NAPAS2',
    },
    {
      value: 'VCB',
      key: 'VCB',
    },
    {
      value: 'BIDV',
      key: 'BIDV',
    },
  ],
  layout: '50',
  maxLength: 50
});

export const ACCOUNT_NUMBER = () => new TextboxItem({
  key: 'accountNumber',
  label: 'Số tài khoản trung gian ghi có',
  placeholder: 'Số tài khoản trung gian ghi có',
  value: null,
  layout: '25',
  maxLength: 250
});

export const ACCOUNT_NUMBER_LIST = () => new TextboxItem({
  key: 'accountNumber',
  placeholder: 'Số tài khoản trung gian ghi có',
  value: null,
  layout: '25',
  maxLength: 250
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
        "creditAccounts": { "accounts": ["VND5196518;VND2356586"]},
      },
      {
        "stt": 1,
        "id": "16",
        "transferChannel": "BILATERAL",
        "creditAccounts": { "accounts": ["VND1477528;VND159685"]},
      }
    ]
  }
}
