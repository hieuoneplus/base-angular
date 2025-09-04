import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "src/app/public/constants";

export const COLUMS: string[] = [
    'stt',
    'key',
    'value',
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                TRANSACTION_FLAG: {
                    SEARCH: 'pmp_admin/transfer-channel/napas/transaction-flag/search',
                    HISTORY: 'pmp_admin/transfer-channel/napas/transaction-flag/history',
                },
            }
        },
    }
}


export const KEY = () => new TextboxItem({
  key: 'key',
  label: 'Key',
  placeholder: 'Nhập key',
  value: '',
  layout: '25',
  maxLength: 100,
  readOnly: true
});

export const UPDATED_BY = () => new TextboxItem({
  key: 'updatedBy',
  label: 'Người sửa đổi',
  placeholder: 'Nhập người sửa đổi',
  value: '',
  layout: '25',
  maxLength: 100
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
