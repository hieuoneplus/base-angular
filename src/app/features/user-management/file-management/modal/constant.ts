import { DateTimeItem, TextboxItem } from "@shared-sm";

export const COLUMS: string[] = [
    'stt',
    'id',
    'fileName',
    'status',
    'createdAt',
    'updatedAt',
    'fileUrl',
    'actions'
];

export const CREATION_DATE_TIME = () =>
    new DateTimeItem({
        key: 'toDate',
        label: 'Từ ngày',
        placeholder: 'Nhập ngày tạo file',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_CREATION_DATE_TIME = () =>
    new DateTimeItem({
        key: 'endDate',
        label: 'Đến ngày',
        placeholder: 'Nhập ngày tạo file',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });
export const FILE_NAME = () =>
    new TextboxItem({
        key: 'fileName',
        label: 'Tên file',
        placeholder: 'Nhập tên file',
        value: null,
    });

export const STATUS_FORM = [
  { key: '', value: 'Tất cả trạng thái', class: '' },
  { key: 'PROCESSING', value: 'Đang xử lý', class: 'wf-status-inprocess' },
  { key: 'INIT', value: 'Chưa xử lý', class: 'wf-status-cancel' },
  { key: 'COMPLETED', value: 'Sẵn sàng xem', class: 'wf-status-approved' },
  { key: 'FAILED', value: 'Xử lý lỗi', class: 'wf-status-reject' },
  { key: 'D', value: 'Hủy', class: 'wf-status-reject' },
];
