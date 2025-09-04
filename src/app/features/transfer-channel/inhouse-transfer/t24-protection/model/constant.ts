import {DateTimeItem, TextboxItem} from "@shared-sm";

export const displayedColumns: string[] = [
  'channel',
  'waitingTimeSecond',
  'leaseTimeSecond',
  'ccuAccountThreshold',
  'keyExpireTimeSecond',
  'channelDetail',
  'active',
]

export const displayedColumnsEdit: string[] = [...displayedColumns, 'actions']

export const UPDATE_BY = () => new TextboxItem({
  key: 'updatedBy',
  label: 'Người sửa đổi',
  placeholder: 'Nhập người sửa đổi',
  value: '',
  layout: '25',
});

export const UPDATE_AT_FROM = () => new DateTimeItem({
  key: 'updatedAtFrom',
  label: 'Ngày sửa đổi từ ngày',
  placeholder: 'Nhập ngày sửa đổi từ ngày',
  value: null,
  minDate: '1900-01-01',
});

export const UPDATE_AT_TO = () => new DateTimeItem({
  key: 'updatedAtTo',
  label: 'Ngày sửa đổi đến ngày',
  placeholder: 'Nhập ngày sửa đổi đến ngày',
  value: null,
});

