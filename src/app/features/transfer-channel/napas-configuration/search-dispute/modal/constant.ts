import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "src/app/public/constants";
import { typeTransactionDisputeEnum,transactionTypeEnum, approveDisputeStatusEnum } from "./enum";

export const COLUMS: string[] = [
    'check',
    'stt',
    'disputeId',
    // 'caseId',
    'origTransactionReference',
    'origTransactionDate',
    'origSenderAcc',
    'origReceiverAcc',
    'origSettlementAmount',
    'disputeAssigner',
    'disputeAssignee',
    'disputeTypeCode',
    'disputeClaimCode',
    'disputeAmount',
    'disputeStatus',
    // 'attachFile',
    'transactionType',
    'type',
    'approveDisputeStatus',
    'actions'
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                DISPUTE: {
                    SEARCH_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/search',
                    CREATE_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/create',
                    EDIT_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/edit',
                    DETAIL_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/detail',
                    REPLY_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply',
                    REPLY_EDIT_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply-edit',
                    REPLY_DETAIL_DISPUTE: 'pmp_admin/transfer-channel/napas/dispute/reply-detail',
                },
            }
        },
    }
}

export const DISPUTE_ID = () =>
    new TextboxItem({
        key: 'disputeId',
        label: 'Mã điện tra soát',
        placeholder: 'Nhập mã điện tra soát',
        value: null,
    });

export const TRACE_NUMBER = () =>
    new TextboxItem({
        key: 'traceNumber',
        label: 'Số trace giao dịch',
        placeholder: 'Nhập số trace giao dịch',
        value: null,
    });

export const TRANSACTION_TYPE = () =>
    new NgSelectItem({
        key: 'transactionType',
        label: 'Chiểu tra soát',
        placeholder: 'Chọn chiểu tra soát',
        value: null,
        options: SELECT_TRANSACTION_TYPE,
        // maxLength: 8,
    });

export const DISPUTE_ASSIGNEE = () =>
    new TextboxItem({
        key: 'disputeAssignee',
        label: 'Tổ chức nhận điện',
        placeholder: 'Chọn tổ chức nhận điện',
        value: null,
        // options: SELECT_DISPUTE_ASSIGNEE,
        maxLength: 250,
    });

export const DISPUTE_ASSIGNER = () =>
    new TextboxItem({
        key: 'disputeAssigner',
        label: 'Tổ chức gửi điện',
        placeholder: 'Chọn tổ chức gửi điện',
        value: null,
        // options: SELECT_DISPUTE_ASSIGNER,
        maxLength: 250,
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

export const ORIG_TRANSACTION_REFERENCE = () =>
    new TextboxItem({
        key: 'origTransactionReference',
        label: 'Mã giao dịch gốc',
        placeholder: 'Nhập mã giao dịch gốc',
        value: null,
        maxLength: 16
    });

export const DISPUTE_TYPE_CODE = () =>
    new NgSelectItem({
        key: 'disputeTypeCode',
        label: 'Loại tra soát',
        placeholder: 'Chọn loại tra soát',
        value: null,
        options: SELECT_DISPUTE_TYPE_CODE,
        // maxLength: 10,
    });

export const DISPUTE_CLAIM_CODE = () =>
    new NgSelectItem({
        key: 'disputeClaimCode',
        label: 'Mã yêu cầu thu hồi',
        placeholder: 'Chọn mã yêu cầu thu hồi',
        value: null,
        options: SELECT_DISPUTE_CLAIM_CODE,
        // maxLength: 4,
    });

export const DISPUTE_STATUS = () =>
    new NgSelectItem({
        key: 'disputeStatus',
        label: 'Trạng thái tra soát',
        placeholder: 'Chọn trạng thái tra soát',
        value: null,
        options: SELECT_DISPUTE_STATUS,
        // maxLength: 4,
    });

export const USER = () =>
    new TextboxItem({
        key: 'createdBy',
        label: 'Người nhập',
        placeholder: 'Nhập người nhập',
        value: '',
    });

    export const USERT = () =>
    new NgSelectItem({
        key: 'createdBy',
        label: 'Người nhập',
        placeholder: 'Nhập người nhập',
        value: null,
        options: []
    });

export const DATE_TIME = () =>
    new DateTimeItem({
        key: 'transactionDate',
        label: 'Ngày giao dịch',
        placeholder: 'Nhập ngày giao dich',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const DISPUTE_AMOUNT = () =>
    new TextboxItem({
        key: 'disputeAmount',
        label: 'Số tiền tra soát',
        placeholder: 'Nhập số tiền tra soát',
        value: null,
        maxLength: 15
    });

export const DISPUTE_SUBJECT = () =>
    new TextboxItem({
        key: 'disputeSubject',
        label: 'Tiêu đề tra soát',
        placeholder: 'Nhập tiêu đề tra soát',
        value: null,
        maxLength: 100
    });

export const DISPUTE_MESSAGE = () =>
    new TextboxItem({
        key: 'disputeMessage',
        label: 'Nội dung tra soát',
        placeholder: 'Nhập nội dung tra soát',
        value: null,
        maxLength: 4000
    });

export const REFUND_AMOUNT = () =>
    new TextboxItem({
        key: 'refundAmount',
        label: 'Số tiền hoàn trả',
        placeholder: 'Nhập số tiền hoàn trả',
        value: null,
        // maxLength: 12
    });

export const REFUND_CREATED_DATE = () =>
    new DateTimeItem({
        key: 'refundCreatedDate',
        label: 'Ngày tạo yêu cầu hoàn trả',
        placeholder: 'Nhập ngày tạo yêu cầu hoàn trả',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const REFUND_CODE = () =>
    new TextboxItem({
        key: 'refundCode',
        label: 'Mã điện hoàn trả',
        placeholder: 'Nhập mã điện hoàn trả',
        value: null,
    });

export const REFUND_ACCOUNT = () =>
    new TextboxItem({
        key: 'refundAccount',
        label: 'Số TK/ thẻ hoàn',
        placeholder: 'Nhập số TK/ thẻ hoàn',
        value: null,
    });

export const REFUND_DESCRIPTION = () =>
    new TextAreaItem({
        key: 'refundDescription',
        label: 'Nội dung hoàn trả',
        value: null,
        placeholder: 'Nhập nội dung hoàn trả',
        maxLength: 500,
    });

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

export const SELECT_TRANSACTION_TYPE = [
    {
        key: '',
        value: 'Tất cả',
    },
    {
        key: transactionTypeEnum.ISS,
        value: 'ISS-Chiều MB phát lệnh tra soát',
    },
    {
        key: transactionTypeEnum.ACQ,
        value: 'ACQ-Chiều MB nhận lệnh tra soát',
    },
]

export const SELECT_DISPUTE_ASSIGNEE = [
]

export const SELECT_DISPUTE_ASSIGNER = [
]

export const SELECT_DISPUTE_TYPE_CODE = [
    {
        key: 'ALL',
        value: 'Tất cả các loại tra soát'
    },
    {
        key: 'RQRN',
        value: 'RQRN-Yêu cầu hoàn trả'
    },
    {
        key: 'RQAD',
        value: 'RQAD-Yêu cầu chỉnh sửa thông tin giao dịch gốc'
    },
    {
        key: 'RQNF',
        value: 'RQNF-Yêu cầu cung cấp chứng từ, thông tin giao dịch'
    },
    {
        key: 'RQSP',
        value: 'RQSP-Hỗ trợ thu hồi giao dịch'
    },
    {
        key: 'GDFT',
        value: 'GDFT-Hỗ trợ tra soát khiếu nại'
    },
]

export const SELECT_DISPUTE_CLAIM_CODE = [
    {
        key: 'ALL',
        value: 'Tất cả các loại lý do'
    },
    {
        key: 'BANK',
        value: 'BANK-Giao dịch hỗ trợ thu hồi do Tổ chức YCTS'
    },
    {
        key: 'FRAU',
        value: 'FRAU-Giao dịch hỗ trợ thu hồi do ghi ngờ gian lận, giả mạo'
    },
    {
        key: 'CUST',
        value: 'CUST-Giao dịch hỗ trợ lý do khác'
    },
]

export const SELECT_DISPUTE_STATUS = [
    {
        key: 'NEWT',
        value: 'NEWT-Bản ghi sẵn sàng duyệt'
    },

    {
        key: 'OPEN',
        value: 'OPEN-Napas chấp nhận bản tin'
    },
    {
        key: 'PRCD',
        value: 'PRCD-TCNL đã xử lý'
    },
    {
        key: 'RJCT',
        value: 'RJCT-TCNL từ chối'
    },
    {
        key: 'EXPI',
        value: 'EXPI-YC quá hạn'
    },
    {
        key: 'EXPR',
        value: 'EXPR-YC quá hạn TCNL đã xử lý'
    },
    {
        key: 'EXRJ',
        value: 'EXRJ-YC quá hạn TCNL từ chối'
    },
]

export const STATUS_LABEL_INITIALIZE_TRANSACTION = [
    { key: '', value: 'Tất cả', class: '' },
    {
      key: approveDisputeStatusEnum.OPEN,
      value: 'Chưa phản hồi',
      class: 'wf-status-inprocess',
    },
    {
      key: approveDisputeStatusEnum.WAITING,
      value: 'Chờ duyệt',
      class: 'wf-status-waitting',
    },
    {
      key: approveDisputeStatusEnum.REJECTED,
      value: 'Từ chối',
      class: 'wf-status-reject',
    },
    {
      key: approveDisputeStatusEnum.APPROVED,
      value: 'Phê duyệt',
      class: 'wf-status-approved',
    },
]
