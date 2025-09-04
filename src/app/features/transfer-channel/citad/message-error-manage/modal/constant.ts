import { DateTimeItem, NgSelectItem, SlideItem, TextboxItem } from "@shared-sm";
import * as moment from "moment";

export const KEYS = () => new TextboxItem({
    key: 'keys',
    label: 'KEY',
    placeholder: 'Nhập KEY',
    value: null,
    maxLength: 200
});

export const TOPICS = () => new TextboxItem({
    key: 'topics',
    label: 'TOPIC',
    placeholder: 'Nhập TOPIC',
    value: null,
    maxLength: 50
});

export const CREATED_AT_FROM = () => new DateTimeItem({
    key: 'createdAtFrom',
    label: 'CREATED AT FROM',
    placeholder: 'Nhập CREATED AT FROM',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment(new Date()).startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00+07:00'),
});

export const CREATED_AT_TO = () => new DateTimeItem({
    key: 'createdAtTo',
    label: 'CREATED AT TO',
    placeholder: 'Nhập CREATED AT TO',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment(new Date()).startOf('day').utcOffset(7).format('YYYY-MM-DDT23:59:59+07:00'),
});

export const UPDATE_AT_FROM = () => new DateTimeItem({
    key: 'updatedAtFrom',
    label: 'Ngày chỉnh sửa từ ngày',
    placeholder: 'Nhập ngày chỉnh sửa từ ngày',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment().startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00+07:00'),
});

export const UPDATE_AT_TO = () => new DateTimeItem({
    key: 'updatedAtTo',
    label: 'Ngày chỉnh sửa đến ngày',
    placeholder: 'Nhập ngày chỉnh sửa đến ngày',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment().startOf('day').utcOffset(7).format('YYYY-MM-23:59:59+07:00'),
});

export const STATUS = () => new NgSelectItem({
    key: 'statuses',
    label: 'STATUS',
    placeholder: 'Chọn  STATUS',
    searchable: false,
    value: null,
    options: [
       {
            key: 'INIT',
            value: 'Khởi tạo',
       },
        {
            key: 'DISCARDED',
            value: 'Đã hủy',
        },
        {
            key: 'DONE',
            value: 'Đã hoàn thành',
        },
    ],
    layout: '50',
    maxLength: 50
});

export const STATUS_FORM = [
    { key: 'INIT', value: 'Khởi tạo', class: 'wf-status-inprocess' },
    { key: 'DISCARDED', value: 'Đã hủy', class: 'wf-status-reject' },
    { key: 'DONE', value: 'Đã hoàn thành', class: 'wf-status-approved' },
  ];