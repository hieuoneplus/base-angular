import { NgSelectItem, TextboxItem } from "@shared-sm";

export const STATUS_SELECT = () => new NgSelectItem({
    key: 'status',
    label: 'Trạng thái',
    placeholder: '',
    value: '',
    options: [],
    layout: '50',
    maxLength: 50,
    searchable: false,
});