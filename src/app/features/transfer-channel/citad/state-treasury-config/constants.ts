import { DateTimeItem, TextboxItem } from "@shared-sm";

export const displayedColumns: string[] = [
  'stt', 'code', 'name', 'creditAccountNo', 'branchCode','action','updatedBy', 'updatedAt','actions'
];

export const CODE_GET = () => new TextboxItem({
  key: 'codes',
  label: 'Mã kho bạc',
  placeholder: 'Nhập mã kho bạc',
  value: null,
  layout: '25',
  maxLength: 50
});

export const BRANCHCODE_GET = () => new TextboxItem({
  key: 'branchCode',
  label: 'Mã chi nhánh',
  placeholder: 'Nhập mã chi nhánh',
  value: null,
  layout: '25',
  maxLength: 50
});

export const NAME_GET = () => new TextboxItem({
  key: 'name',
  label: 'Tên kho bạc',
  placeholder: 'Nhập tên kho bạc',
  value: null,
  layout: '25',
  maxLength: 200
});

export const CREDIT_ACC_NO_GET = () => new TextboxItem({
  key: 'creditAccountNo',
  label: 'Số tài khoản ghi có',
  placeholder: 'Nhập số tài khoản ghi có',
  value: null,
  layout: '25',
  maxLength: 50
});
export const JSON_EX = {
  "status": 200,
  "error": "OK",
  "timestamp": "2024-09-17T07:44:25.740001Z",
  "clientMessageId": "e90133c6-1059-4298-8163-f0bed770bf62",
  "path": "/state_treasuries",
  "data": {
    "content": [
      {
        "code": "1008",
        "name": "Name8",
        "creditAccountNo": "888888",
        "branchCode": "Branch8",
        "createdBy": "mbstaff",
        "createdAt": "2024-09-17T14:44:23.532131+07:00",
        "updatedBy": "mbstaff",
        "updatedAt": "2024-09-17T14:44:23.532131+07:00"
      },
      {
        "code": "1007",
        "name": "Name7",
        "creditAccountNo": "777777",
        "branchCode": "Branch7",
        "createdBy": "mbstaff",
        "createdAt": "2024-09-17T14:44:23.526444+07:00",
        "updatedBy": "mbstaff",
        "updatedAt": "2024-09-17T14:44:23.526444+07:00"
      },
      {
        "code": "1006",
        "name": "Name6",
        "creditAccountNo": "666666",
        "branchCode": "Branch6",
        "createdBy": "mbstaff",
        "createdAt": "2024-09-17T14:44:23.49696+07:00",
        "updatedBy": "mbstaff",
        "updatedAt": "2024-09-17T14:44:23.49696+07:00"
      },
      {
        "code": "1005",
        "name": "Name5",
        "creditAccountNo": "555555",
        "branchCode": "Branch5",
        "createdBy": "mbstaff",
        "createdAt": "2024-09-17T14:44:23.491339+07:00",
        "updatedBy": "mbstaff",
        "updatedAt": "2024-09-17T14:44:23.491339+07:00"
      },
      {
        "code": "1004",
        "name": "Name4",
        "creditAccountNo": "444444",
        "branchCode": "Branch4",
        "createdBy": "mbstaff",
        "createdAt": "2024-09-17T14:44:23.479224+07:00",
        "updatedBy": "mbstaff",
        "updatedAt": "2024-09-17T14:44:23.479224+07:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "empty": false,
        "unsorted": false,
        "sorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 5,
    "totalPages": 1,
    "size": 20,
    "number": 0,
    "sort": {
      "empty": false,
      "unsorted": false,
      "sorted": true
    },
    "numberOfElements": 5,
    "first": true,
    "empty": false
  }
  
}
export const UPDATED_FROM = () => new DateTimeItem({
  key: 'updatedAtFrom',
  label: 'Thời gian sửa đổi từ ngày',
  placeholder: 'Nhập thời gian sửa đổi từ ngày',
  minDate: '1900-01-01',
  value: null,
});

export const UPDATED_TO = () => new DateTimeItem({
  key: 'updatedAtTo',
  label: 'Thời gian sửa đổi đến ngày',
  placeholder: 'Nhập thời gian sửa đổi đến ngày',
  minDate: '1900-01-01',
  value: null,
});

export const UPDATED_BY = () => new TextboxItem({
  key: 'updatedBy',
  label: 'Người sửa đổi',
  placeholder: 'Nhập người sửa đổi',
  value: '',
  layout: '25',
  maxLength: 50
});