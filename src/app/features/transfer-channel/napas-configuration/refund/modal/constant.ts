import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "src/app/public/constants";

export const COLUMS: string[] = [
    'stt',
    'senderReference',
    'creationDateTime',
    'caseId',
    'origTransactionReference',
    'settlementAmount',
    'ft',
    'sendingMember',
    'receivingMember',
    'transactionAmount',
    'status',
    'actions'
];

export const COLUMS_BATCH: string[] = [
    'stt',
    'id',
    'fileName',
    'transactionCount',
    'successTransactionCount',
    'failTransactionCount',
    // 'processingTransactionCount',
    'createAt',
    'approveAt',
    'createBy',
    'approveBy',
    'status',
    'actions'
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                REFUND: {
                    SEARCH: 'pmp_admin/transfer-channel/napas/refund/search',
                    CREATE_SINGLE: 'pmp_admin/transfer-channel/napas/refund/create-single',
                    EDIT_SINGLE: 'pmp_admin/transfer-channel/napas/refund/edit-single',
                    DETAIL_SINGLE: 'pmp_admin/transfer-channel/napas/refund/detail-single',
                    SEARCH_BATCH: 'pmp_admin/transfer-channel/napas/refund/batch/search',
                    DETAIL_BATCH: 'pmp_admin/transfer-channel/napas/refund/batch/detail',

                },
            }
        },
    }
}

export const BUTTON_REJECT = {
    title: 'Từ chối',
    icon: 'ic-close_blue',
    classBtn: 'btn-error',
    typeBtn: TYPE_BTN_FOOTER.TYPE_DELETE,
};

export const BUTTON_APPROVE = {
    title: 'Duyệt',
    icon: 'ic-check_blue',
    classBtn: 'btn-success',
    typeBtn: TYPE_BTN_FOOTER.TYPE_APPROVER,
};

export const CASE_ID = () =>
    new TextboxItem({
        key: 'caseId',
        label: 'Mã điện hoàn trả',
        placeholder: 'Nhập mã điện hoàn trả',
        value: null,
    });

export const CREATION_DATE_TIME = () =>
    new DateTimeItem({
        key: 'creationDateTime',
        label: 'Từ ngày',
        placeholder: 'Nhập ngày giao dịch',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_CREATION_DATE_TIME = () =>
    new DateTimeItem({
        key: 'toCreationDateTime',
        label: 'Đến ngày',
        placeholder: 'Nhập ngày giao dịch',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const BATCH_ID = () =>
    new TextboxItem({
        key: 'batchId',
        label: 'Mã lô hoàn trả',
        placeholder: 'Nhập mã lô hoàn trả',
        value: null,
    });

export const ORIG_TRANSACTION_REFERENCE = () =>
    new TextboxItem({
        key: 'origTransactionReference',
        label: 'Mã giao dịch gốc',
        placeholder: 'Nhập mã giao dịch gốc',
        value: null,
    });

export const ORIG_SYSTEM_TRACE = () =>
    new TextboxItem({
        key: 'origSystemTrace',
        label: 'Số trace giao dịch',
        placeholder: 'Nhập số trace giao dịch',
        value: null,
    });

export const ORIG_FT = () =>
    new TextboxItem({
        key: 'origFT',
        label: 'Ft giao dịch gốc',
        placeholder: 'Nhập Ft giao dịch gốc',
        value: null,
    });

export const DIRECTION = () =>
    new NgSelectItem({
        key: 'direction',
        label: 'Chiều hoàn trả',
        placeholder: 'Chọn chiều hoàn trả',
        value: null,
        options: SELECT_DIRECTION,
        // maxLength: 10,
    });

export const RECEIVING_MEMBER = () =>
    new TextboxItem({
        key: 'receivingMember',
        label: 'Tổ chức nhận điện',
        placeholder: 'Nhập tổ chức nhận điện',
        value: null,
    });

export const SENDING_MEMBER = () =>
    new TextboxItem({
        key: 'sendingMember',
        label: 'Tổ chức gửi điện',
        placeholder: 'Nhập tổ chức gửi điện',
        value: null,
    });

export const RETURN_STATUS = () =>
    new NgSelectItem({
        key: 'returnStatus',
        label: 'Trạng thái hoàn trả',
        placeholder: 'Chọn trạng thái hoàn trả',
        value: null,
        options: SELECT_RETURN_STATUS,
        // maxLength: 10,
    });

export const FROM_DATE = () =>
    new DateTimeItem({
        key: 'fromDate',
        label: 'Ngày giao dịch từ ngày',
        placeholder: 'Nhập ngày giao dịch từ ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_DATE = () =>
    new DateTimeItem({
        key: 'toDate',
        label: 'Ngày giao dịch đến ngày',
        placeholder: 'Nhập ngày giao dịch đến ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TRACE_NUMBER = () =>
    new TextboxItem({
        key: 'traceNumber',
        label: 'Số trace giao dịch',
        placeholder: 'Nhập số trace giao dịch',
        value: null,
    });

export const RETURN_DATA_PROCESSING_CODE = () =>
    new NgSelectItem({
        key: 'returnDataProcessingCode',
        label: 'Mã xử lý giao dịch',
        placeholder: 'Chọn mã xử lý giao dịch',
        value: null,
        options: SELECT_RETURN_DATA_PROCESSING_CODE,
        // maxLength: 10,
        required: true
    });

export const RETURN_DATA_TRANSACTION_AMOUNT = () =>
    new TextboxItem({
        key: 'returnDataTransactionAmount',
        label: 'Giá trị hoàn trả',
        placeholder: 'Nhập giá trị hoàn trả',
        value: null,
        maxLength: 15,
        required: true
    });

export const RETURN_DATA_CURRENCY_CODE = () =>
    new TextboxItem({
        key: 'returnDataCurrencyCode',
        label: 'Loại tiền tệ',
        placeholder: 'Nhập loại tiền tệ',
        value: null,
        maxLength: 3,
        required: true
    });

export const DISPUTE_ID = () =>
    new NgSelectItem({
        key: 'disputeId',
        label: 'Mã yêu cầu hoàn trả',
        placeholder: 'Chọn mã yêu cầu hoàn trả',
        value: null,
        options: [],
        maxLength: 20,
    });

export const TRANSACTION_ACCOUNTING_TYPE = () =>
    new NgSelectItem({
        key: 'transactionAccountingType',
        label: 'Yêu cầu hạch toán',
        placeholder: 'Chọn yêu cầu hạch toán',
        value: null,
        options: [
            {
                key: 'true',
                value: 'Giao dịch hoàn trả có yêu cầu hạch toán'
            },
            {
                key: 'false',
                value: 'Giao dịch hoàn trả chỉ yêu cầu báo có'
            },
        ],
        maxLength: 25,
        required: true
    });

export const SENDER_ACC = () =>
    new TextboxItem({
        key: 'senderAcc',
        label: 'Số TK/Thẻ nguồn',
        placeholder: 'Nhập số TK/Thẻ nguồn',
        value: null,
        maxLength: 19,
        required: true
    });

export const RECEVER_ACC = () =>
    new TextboxItem({
        key: 'receiverAcc',
        label: 'Số TK/Thẻ đích',
        placeholder: 'Nhập số TK/Thẻ đích',
        value: null,
        maxLength: 19,
        required: true
    });

export const CONTENT_TRANSFERS = () =>
    new TextboxItem({
        key: 'contentTransfers',
        label: 'Nội dung hoàn trả',
        placeholder: 'Nhập nội dung hoàn trả',
        value: null,
        maxLength: 210,
        required: true
    });

export const ID_BATCH = () =>
    new TextboxItem({
        key: 'id',
        label: 'Mã lô hoàn trả',
        placeholder: 'Nhập mã lô hoàn trả',
        value: null,
    });

export const CREATE_AT = () =>
    new DateTimeItem({
        key: 'createAt',
        label: 'Ngày giao dịch từ ngày',
        placeholder: 'Nhập ngày giao dịch từ ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_CREATE_AT = () =>
    new DateTimeItem({
        key: 'toCreateAt',
        label: 'Ngày giao dịch đến ngày',
        placeholder: 'Nhập ngày giao dịch đến ngày',
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


export const BATCH_REFUND_STATUS = () =>
    new NgSelectItem({
        key: 'status',
        label: 'Trạng thái lô',
        placeholder: 'Chọn trạng thái lô',
        value: null,
        options: SELECT_BATCH_RETURN_STATUS,
        maxLength: 20,
    });


export const SELECT_DIRECTION = [
    {
        key: '',
        value: 'Tất cả'
    },
    {
        key: 'SEND',
        value: 'Chiều MB phát lệnh hoàn trả'
    },
    {
        key: 'RECEIVE',
        value: 'Chiều MB nhận lệnh hoàn trả'
    },
]

export const SELECT_RETURN_STATUS = [
    {
        key: 'VALIDATING',
        value: 'INIT-Hệ thống đang kiểm tra'
    },
    {
        key: 'VALIDATED',
        value: 'NEWT-GD sẵn sàng duyệt'
    },
    {
        key: 'REJECTED',
        value: 'NEWR-KSV từ chối duyệt'
    },
    {
        key: 'NAPAS_OPEN',
        value: 'OPEN-Napas chấp nhận'
    },
    {
        key: 'SUCCESS',
        value: 'ACSP-GD được quyết toán'
    },
    {
        key: 'FAIL', //, GET_TOKEN_FAILED, ACCOUNTING_FAILED, REVERT_FAILED, INCOMPLETE, VALIDATE_FAILED,  FAIL
        value: 'FAIL-GD hạch toán tại MB thất bại'
    },
    {
        key: 'RJCT', // NAPAS_REJECTED, SEND_NAPAS_FAILED
        value: 'RJCT-Napas từ chối'
    },
    {
        key: 'PROC', //REVERT_TIMEOUT, TIMEOUT, ACCOUNTING_TIMEOU
        value: 'PROC-GD đang xử lý tại MB'
    },
    {
        key: 'SEND_NAPAS_TIMEOUT',
        value: 'PNDG-Napas timeout'
    },
]

export const SELECT_BATCH_RETURN_STATUS = [
    {
        key: 'VALIDATING',
        value: 'INIT-Hệ thống đang kiểm tra'
    },
    {
        key: 'VALIDATED',
        value: 'NEWT-Giao dịch sẵn sàng duyệt'
    },
    {
        key: 'VALIDATE_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'PROCESSING',
        value: 'PROC-GD đang xử lý tại MB'
    },
    {
        key: 'DONE',
        value: 'ACSP-GD được quyết toán'
    },
    {
        key: 'REJECT',
        value: 'NEWR-KSV từ chối duyệt'
    },
]

export const SELECT_RETURN_DATA_PROCESSING_CODE = [
    {
        key: '020000',
        value: '020000-hoàn trả từ thẻ -> thẻ'
    },
    {
        key: '022000',
        value: '022000-hoàn trả từ tài khoản -> thẻ'
    },
    {
        key: '020020',
        value: '020020-hoàn trả từ thẻ -> tài khoản'
    },
    {
        key: '022020',
        value: '022020-hoàn trả từ tài khoản -> tài khoản'
    },
]

export const STATUS_LABEL_STATUS = [
    { key: '', value: 'Tất cả', class: '' },
    {
        key: 'VALIDATING',
        value: 'INIT-Hệ thống đang kiểm tra',
        class: 'wf-status-inprocess',
    },
    {
        key: 'VALIDATED',
        value: 'NEWT-GD sẵn sàng duyệt',
        class: 'wf-status-waitting',
    },
    {
        key: 'REJECTED',
        value: 'NEWR-KSV từ chối duyệt',
        class: 'wf-status-reject',
    },
    {
        key: 'NAPAS_OPEN',
        value: 'OPEN-Napas chấp nhận',
        class: 'wf-status-waittingapprove',
    },
    {
        key: 'SUCCESS',
        value: 'ACSP-GD được quyết toán',
        class: 'wf-status-approved',
    },
    {
        key: 'GET_TOKEN_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'ACCOUNTING_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'REVERT_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'INCOMPLETE',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'VALIDATE_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'FAIL',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'SEND_NAPAS_FAILED',
        value: 'RJCT-Napas từ chối',
        class: 'wf-status-reject',
    },
    {
        key: 'NAPAS_REJECTED',
        value: 'RJCT-Napas từ chối',
        class: 'wf-status-reject',
    },
    {
        key: 'REVERT_TIMEOUT',
        value: 'PROC-GD đang xử lý tại MB',
        class: 'wf-status-inprocess',
    },
    {
        key: 'TIMEOUT',
        value: 'PROC-GD đang xử lý tại MB',
        class: 'wf-status-inprocess',
    },
    {
        key: 'ACCOUNTING_TIMEOUT',
        value: 'PROC-GD đang xử lý tại MB',
        class: 'wf-status-inprocess',
    },
    {
        key: 'SEND_NAPAS_TIMEOUT',
        value: 'PNDG-Napas timeout',
        class: 'wf-status-reject',
    },
]

export const STATUS_LABEL_STATUS_BATCH = [
    { key: '', value: 'Tất cả', class: '' },
    {
        key: 'VALIDATING',
        value: 'INIT-Hệ thống đang kiểm tra',
        class: 'wf-status-inprocess',
    },
    {
        key: 'VALIDATED',
        value: 'NEWT-GD sẵn sàng duyệt',
        class: 'wf-status-waitting',
    },
    {
        key: 'VALIDATE_FAILED',
        value: 'FAIL-GD hạch toán tại MB thất bại',
        class: 'wf-status-reject',
    },
    {
        key: 'REJECT',
        value: 'NEWR-KSV từ chối duyệt',
        class: 'wf-status-reject',
    },
    {
        key: 'PROCESSING',
        value: 'PROC-GD đang xử lý tại MB',
        class: 'wf-status-inprocess',
    },
    {
        key: 'DONE',
        value: 'ACSP-GD được quyết toán',
        class: 'wf-status-approved',
    },
]