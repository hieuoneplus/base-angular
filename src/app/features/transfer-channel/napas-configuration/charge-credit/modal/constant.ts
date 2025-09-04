import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from '@shared-sm';
import { TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { approveChargeCreditStatusEnum } from './enum';

export const COLUMS: string[] = [
    'stt',
    'id',
    'createdAt',
    'disputeId',
    'origTransactionReference',
    'amountValue',
    'approvalStatus',
    'actions'
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                CHARGE_CREDIT: {
                    SEARCH: 'pmp_admin/transfer-channel/napas/charge-credit/search',
                    CREATE: 'pmp_admin/transfer-channel/napas/charge-credit/create',
                    EDIT: 'pmp_admin/transfer-channel/napas/charge-credit/edit',
                    DETAIL: 'pmp_admin/transfer-channel/napas/charge-credit/detail',
                },
            }
        },
    }
}

export const DISPUTE_ID = () =>
    new TextboxItem({
        key: 'disputeId',
        label: 'Mã điện tra soát gốc',
        placeholder: 'Nhập mã điện tra soát gốc',
        value: null,
        maxLength: 16,
    });

export const ID = () =>
    new TextboxItem({
        key: 'id',
        label: 'Mã điện báo có',
        placeholder: 'Nhập mã điện báo có',
        value: null,
    });

export const FROM_DATE = () =>
    new DateTimeItem({
        key: 'fromDate',
        label: 'Từ ngày',
        placeholder: 'Nhập từ ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TO_DATE = () =>
    new DateTimeItem({
        key: 'toDate',
        label: 'Đến ngày',
        placeholder: 'Nhập đến ngày',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const TRANSACTION_REFERENCE_NUMBER = () =>
    new TextboxItem({
        key: 'transactionReferenceNumber',
        label: 'Mã giao dịch gốc',
        placeholder: 'Nhập mã giao dịch gốc',
        value: null,
    });

export const DIRECTION = () =>
    new NgSelectItem({
        key: 'direction',
        label: 'Chiều báo có',
        placeholder: 'Chọn chiều báo có',
        value: null,
        options: SELECT_DIRECTION,
        // maxLength: 4,
    });

export const TYPE = () =>
    new NgSelectItem({
        key: 'type',
        label: 'Phân loại',
        placeholder: 'Chọn phân loại',
        value: null,
        options: SELECT_TRANSACTION_TYPE,
        // maxLength: 4,
    });
export const AMOUNT = () =>
    new TextboxItem({
        key: 'amount',
        label: 'Số tiền',
        placeholder: 'Nhập số tiền',
        value: null,
        maxLength: 15
    });
export const CURRENCY_CODE = () =>
    new TextboxItem({
        key: 'currencyCode',
        label: 'Số tiền đến',
        placeholder: 'Nhập số tiền đến',
        value: null,
    });
export const FROM_AMOUNT = () =>
    new TextboxItem({
        key: 'fromAmount',
        label: 'Số tiền từ',
        placeholder: 'Nhập số tiền từ',
        value: null,
    });

export const TO_AMOUNT = () =>
    new TextboxItem({
        key: 'toAmount',
        label: 'Số tiền đến',
        placeholder: 'Nhập số tiền đến',
        value: null,
    });

export const STATUS = () =>
    new NgSelectItem({
        key: 'status',
        label: 'Trạng thái phê duyệt',
        placeholder: 'Chọn trạng thái phê duyệt',
        value: null,
        options: SELECT_STATUS,
    });

export const SELECT_DIRECTION = [
    {
        key: '',
        value: 'Tất cả'
    },
    {
        key: 'ISS',
        value: 'Chiều MB phát lệnh'
    },
    {
        key: 'ACQ',
        value: 'Chiều MB nhận lệnh'
    },
]


export const SELECT_TRANSACTION_TYPE = [
    {
        key: '',
        value: 'Tất cả'
    },
    {
        key: 'REQUEST',
        value: 'REQUEST'
    },
    {
        key: 'RESPONSE',
        value: 'RESPONSE'
    },
]

export const SELECT_STATUS = [
    {
        key: 'WAITING',
        value: 'Chờ duyệt'
    },
    {
        key: 'APPROVED_BY_NAPAS',
        value: 'Đã duyệt bởi Napas'
    },
    {
        key: 'REJECTED_BY_NAPAS',
        value: 'Từ chối bởi Napas'
    },
    {
        key: 'REJECTED_BY_MB',
        value: 'Từ chối bởi MB'
    },
    {
        key: 'SENT_TO_NAPAS',
        value: 'Dã gửi sang Napas'
    },
]

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

export const STATUS_LABLE = [
    { key: 'WAITING', value: 'Chờ duyệt', class: 'wf-status-waitting' },
    { key: 'APPROVED_BY_NAPAS', value: 'Đã duyệt bởi Napas', class: 'wf-status-approved' },
    { key: 'REJECTED_BY_NAPAS', value: 'Từ chối bởi Napas', class: 'wf-status-reject' },
    { key: 'REJECTED_BY_MB', value: 'Từ chối bởi MB', class: 'wf-status-reject' },
    { key: 'SENT_TO_NAPAS', value: 'Đã gửi sang Napas', class: 'wf-status-inprocess' },
];

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
        value: 'NEWT-User khởi tạo trên portal, chưa duyệt'
    },

    {
        key: 'OPEN',
        value: 'OPEN-TCYCTS tạo tra soát thành công\n và TCTLTS đã nhận được YCTS'
    },
    {
        key: 'PRCD',
        value: 'PRCD-TCTLTS trả lời đồng ý YCTS'
    },
    {
        key: 'RJCT',
        value: 'RJCT-TCTLTS trả lời từ chối YCTS'
    },
    {
        key: 'EXPI',
        value: 'EXPI-Giao dịch tra soát bị quá hạn trả lời'
    },
    {
        key: 'EXPR',
        value: 'EXPR-Giao dịch tra soát bị quá hạn trả lời\n và TCTLTS trả lời đồng ý YCTS'
    },
    {
        key: 'EXRJ',
        value: 'EXRJ-Giao dịch tra soát bị quá hạn trả lời\n và TCTLTS trả lời từ chối YCTS'
    },
]