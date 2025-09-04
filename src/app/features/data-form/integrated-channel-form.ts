import {NgSelectItem, SlideItem, TextboxItem} from "@shared-sm";


export const STATUS = () => new NgSelectItem({
    key: 'statuses',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    value: null,
    options: [
         {
              key: '',
              value: 'Tất cả',
         },
      {
        value: 'Đang hoạt động',
        key: 'ACTIVE',
      },
      {
        value: 'Dừng hoạt động',
        key: 'INACTIVE',
      },
      {
        value: 'Vô hiệu',
        key: 'DELETED',
      },
    ],
    layout: '50',
    maxLength: 50,
    searchable:false,
    type: 'multiple'
  });

  export const STATUS_ADD = () => new NgSelectItem({
    key: 'status',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    value: null,
    options: [
      {
        value: 'Đang hoạt động',
        key: 'ACTIVE',
      },
      {
        value: 'Dừng hoạt động',
        key: 'INACTIVE',
      },
    ],
    layout: '50',
    maxLength: 50,
    searchable:false,
  });
  export const STATUS_EDIT = () => new NgSelectItem({
    key: 'status',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    value: null,
    options: [
      {
        value: 'Đang hoạt động',
        key: 'ACTIVE',
      },
      {
        value: 'Dừng hoạt động',
        key: 'INACTIVE',
      },
      {
        value: 'Vô hiệu',
        key: 'DELETED',
      },
    ],
    layout: '50',
    maxLength: 50,
    searchable:false,
  });
export const CHANNEL = () => new TextboxItem({
  key: 'channel',
  label: 'Mã kênh tích hợp',
  placeholder: 'Mã kênh tích hợp',
  value: '',
  layout: '25',
  maxLength: 100
});
export const TRANSACTION_TYPE = () => new TextboxItem({
    key: 'transactionType',
    label: 'Loại giao dịch',
    placeholder: 'Loại giao dịch',
    value: null,
    options: [
      {
        key: null,
        value: 'Tất cả',
   },
      {
        value: 'INWARD',
        key: 'INWARD',
      },
      {
        value: 'OUTWARD',
        key: 'OUTWARD',
      },
    ],
    layout: '25',
    maxLength: 50,
    searchable:false
  })

  export const TRANSACTION_TYPE_INPUT = () => new TextboxItem({
    key: 'transactionType',
    label: 'Loại giao dịch',
    placeholder: 'Loại giao dịch',
    value: null,
    options: [
      {
        value: 'INWARD',
        key: 'INWARD',
      },
      {
        value: 'OUTWARD',
        key: 'OUTWARD',
      },
    ],
    layout: '25',
    maxLength: 50,
    searchable:false
  })
export const JSON_EX = {
  "data": {
    "page": 0,
    "size": 10,
    "total": 1,
    "content": [
        {
            "id": 4,
            "transactionType": "OUTWARD",
            "channel": "VOZ1",
            "reason": "abcdefgh1111111111",
            "status": "DELETED",
            "createdAt": "2025-01-10T13:44:24.387155+07:00",
            "createdBy": "prt_user",
            "updatedAt": "2025-01-10T13:44:24.387155+07:00",
            "updatedBy": "prt_user"
        },
        {
          "id": 4,
          "transactionType": "OUTWARD",
          "channel": "VOZ1",
          "reason": "abcdefgh1111111111",
          "status": "ACTIVE",
          "createdAt": "2025-01-10T13:44:24.387155+07:00",
          "createdBy": "prt_user",
          "updatedAt": "2025-01-10T13:44:24.387155+07:00",
          "updatedBy": "prt_user"
      },
      {
        "id": 4,
        "transactionType": "OUTWARD",
        "channel": "VOZ1",
        "reason": "abcdefgh1111111111",
        "status": "INACTIVE",
        "createdAt": "2025-01-10T13:44:24.387155+07:00",
        "createdBy": "prt_user",
        "updatedAt": "2025-01-10T13:44:24.387155+07:00",
        "updatedBy": "prt_user"
    }
    ]
}
}
