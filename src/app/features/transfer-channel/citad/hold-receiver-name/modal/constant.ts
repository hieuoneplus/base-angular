import { DateTimeItem, NgSelectItem, SlideItem, TextboxItem } from "@shared-sm";
import * as moment from "moment";

export const KEY = () => new TextboxItem({
    key: 'key',
    label: 'Từ khóa',
    placeholder: 'Nhập từ khóa',
    value: null,
});

export const CREATED_AT_FROM = () => new DateTimeItem({
    key: 'createdAtFrom',
    label: 'Ngày tạo từ ngày',
    placeholder: 'Nhập ngày tạo từ ngày',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment().startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00.0+07:00'),
});

export const CREATED_AT_TO = () => new DateTimeItem({
    key: 'createdAtTo',
    label: 'Ngày tạo đến ngày',
    placeholder: 'Nhập ngày tạo đến ngày',
    minDate: '1900-01-01',
    maxDate: '3000-01-01',
    value: moment().startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00.0+07:00'),
});

export const CREATED_BY = () => new TextboxItem({
    key: 'createdBy',
    label: 'Người tạo',
    placeholder: 'Nhập người tạo',
    value: null,
});
