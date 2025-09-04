import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "src/app/public/constants";

export const COLUMS: string[] = [
    'stt',
    'transactionId',
    'transactionReferenceNumber',
    'transactionStatus',
    'w4Status',
    'direction',
    'timeLocalTransaction',
    'dateLocalTransaction',
    'paymentCode',
    'systemTraceAuditNumber',
    'ft',
    'dateSettlement',
    'way4WalletReferenceNumber',
    'napasStatus',
    'acceptingInstitutionIdentificationCode',
    'fromAccountIdentification',
    'settlementAmount',
    'settlementCurrencyCode',
    'additionalDataPrivate',
    'contentTransfers',
    'receivingInstitutionIdentificationCode',
    'toAccountIdentification',
    'informationCardOrAccountBeneciary',
    'authorizationIdentificationResponse',
    'userDefinedField',
    'docId',
    'action',
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                TRANSACTION: {
                    SEARCH_TRANSACTION: 'pmp_admin/transfer-channel/napas/transaction-info/search',
                    DETAIL: 'pmp_admin/transfer-channel/napas/transaction-info/detail',
                },
            }
        },
    }
}

export const TRANSACTION_REFERENCE_NUMBER = () =>
    new TextboxItem({
        key: 'transactionReferenceNumber',
        label: 'Mã giao dịch',
        placeholder: 'Nhập mã giao dịch',
        value: null,
    });

export const TRANSACTION_ID = () =>
    new TextboxItem({
        key: 'transactionId',
        label: 'Mã giao dịch từ các kênh',
        placeholder: 'Nhập mã giao dịch từ các kênh',
        value: null,
    });

export const TRANSACTION_DATE = () =>
    new DateTimeItem({
        key: 'transactionDate',
        label: 'Ngày giao dịch từ ngày',
        placeholder: 'Nhập ngày giao dịch từ ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_TRANSACTION_DATE = () =>
    new DateTimeItem({
        key: 'toTransactionDate',
        label: 'Ngày giao dịch đến ngày',
        placeholder: 'Nhập ngày giao dịch đến ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TRACE_NUMBER = () =>
    new TextboxItem({
        key: 'systemTraceAuditNumber',
        label: 'Số trace',
        placeholder: 'Nhập số trace',
        value: null,
    });

export const FT = () =>
    new TextboxItem({
        key: 'ft',
        label: 'FT',
        placeholder: 'Nhập FT',
        value: null,
    });

export const FROM_ACCOUNT_INDENTIFICATION = () =>
    new TextboxItem({
        key: 'fromAccountIdentification',
        label: 'Tài khoản chuyển',
        placeholder: 'Nhập tài khoản chuyển',
        value: null,
    });

export const TO_ACCOUNT_INDENTIFICATION = () =>
    new TextboxItem({
        key: 'toAccountIdentification',
        label: 'Tài khoản nhận',
        placeholder: 'Nhập tài khoản nhận',
        value: null,
    });