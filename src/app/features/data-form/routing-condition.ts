import {NgSelectItem} from "@shared-sm";

export const COND_CODE = () => new NgSelectItem({
  key: 'condCode',
  label: 'Mã điều kiện',
  placeholder: 'Mã điều kiện',
  value: null,
  options: [
    {
      value: 'IBPS_AMOUNT',
      key: 'IBPS_AMOUNT',
    },
    {
      value: 'IBPS_CREDIT_ACCOUNT',
      key: 'IBPS_CREDIT_ACCOUNT',
    }
  ],
  layout: '50',
  maxLength: 50
});

export const COND_NAME = () => new NgSelectItem({
  key: 'condName',
  label: 'Tên điều kiện',
  placeholder: 'Tên điều kiện',
  value: null,
  options: [
    {
      value: 'IBPS Số tiền giao dịch',
      key: 'IBPS Số tiền giao dịch',
    },
    {
      value: 'IBPS tài khoản trung gian',
      key: 'IBPS tài khoản trung gian',
    }
  ],
  layout: '50',
  maxLength: 50
});

export const COND_RANK = () => new NgSelectItem({
  key: 'condRank',
  label: 'Thứ tự ưu tiên',
  placeholder: 'Thứ tự ưu tiên',
  value: null,
  options: [
    {
      value: '1',
      key: '1',
    },
    {
      value: '2',
      key: '2',
    }
  ],
  layout: '50',
  maxLength: 50
});

export const STATUS = () => new NgSelectItem({
  key: 'active',
  label: 'Trạng thái',
  placeholder: 'Trạng thái',
  value: null,
  options: [
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


export const JSON_EX = {
  "data": {

    "page": 0,
    "size": 10,
    "total": 20,
    "content": [
      {
        "stt": 0,
        "id": "15",
        "condCode": "IBPS_AMOUNT",
        "condName": "IBPS Số tiền giao dịch",
        "condRank": "1",
        "active": true,
        "transFlow": "Có áp dụng",
        "channelType": "IPBS",
        "flowName": "Không áp dụng"
      }
    ]
  }
}
