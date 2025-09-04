import { DateTimeItem, TextboxItem } from "@shared-sm";

export const COLUMS: string[] = [
    'stt',
    'referenceId',
    'fileName',
    'mineType',
    'encodeType',
    'charSet',
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

