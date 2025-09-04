import { DateTimeItem, NgSelectItem, TextAreaItem, TextboxItem } from "@shared-sm";
import { TYPE_BTN_FOOTER } from "src/app/public/constants";

export const COLUMS: string[] = [
    'stt',
    'reportName',
    'receivingRole',
    'settlementDate',
    'settlementCode',
    'services',
    'flag',
    'flagOrs',
    'reportId',
    'versionReconcile',
    'totalPage',
    'createDate',
    'action',
];

export const URL = {
    NAPAS: {
        IBFT_RECONCILE: {
            OUT: {
                FLAG_REPORT: {
                    SEARCH: 'pmp_admin/transfer-channel/napas/flag-report/search',
                    DETAIL: 'pmp_admin/transfer-channel/napas/flag-report/detail',
                    CREATE: 'pmp_admin/transfer-channel/napas/flag-report/create',
                    EDIT: 'pmp_admin/transfer-channel/napas/flag-report/edit',
                },
            }
        },
    }
}
export const REPORT_NAME = () =>
    new NgSelectItem({
        key: 'reportName',
        label: 'Tên báo cáo',
        placeholder: 'Chọn tên báo cáo',
        value: null,
        options: SELECT_REPORT_NAME,
        maxLength: 50,
    });

export const RECEIVING_ROLE = () =>
    new NgSelectItem({
        key: 'receivingRole',
        label: 'Vai trò của TCTV',
        placeholder: 'Chọn vai trò của TCTV',
        value: null,
        options: LABEL_RECEIVING_ROLE,
        maxLength: 20,
    });

export const SETTLEMENT_DATE = () =>
    new DateTimeItem({
        key: 'settlementDate',
        label: 'Ngày quyết toán',
        placeholder: 'Nhập ngày quyết toán',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });
    
export const SETTLEMENT_DATE_UPDATE = () =>
    new TextboxItem({
        key: 'settlementDate',
        label: 'Ngày quyết toán',
        placeholder: 'Nhập ngày quyết toán',
        value: null,
        maxLength: 10,
    });

export const SETTLEMENT_CODE = () =>
    new TextboxItem({
        key: 'settlementCode',
        label: 'Phiên quyết toán',
        placeholder: 'Nhập phiên quyết toán',
        value: null,
        maxLength: 2,
    });

export const SERVICES = () =>
    new NgSelectItem({
        key: 'services',
        label: 'Loại dịch vụ',
        placeholder: 'Chọn loại dịch vụ',
        value: null,
        options: LABEL_SERVICE,
        maxLength: 20,
    });


export const FLAG = () =>
    new NgSelectItem({
        key: 'flag',
        label: 'Trạng thái nhận dữ liệu',
        placeholder: 'Chọn trạng thái nhận dữ liệu',
        value: null,
        options: SELECT_FLAG,
        maxLength: 20,
    });

export const FLAG_ORS = () =>
    new NgSelectItem({
        key: 'flagOrs',
        label: 'Trạng thái ODS',
        placeholder: 'Chọn trạng thái ODS',
        value: null,
        options: SELECT_FLAG_ORS,
        maxLength: 20,
    });

    export const REPORT_ID = () =>
    new TextboxItem({
        key: 'reportId',
        label: 'Mã báo cáo',
        placeholder: 'Nhập mã báo cáo',
        value: null,
        maxLength: 40,
    });

export const VERSION_RECONCILE = () =>
    new TextboxItem({
        key: 'versionReconcile',
        label: 'Version Reconcile',
        placeholder: 'Nhập Version Reconcile',
        value: null,
        maxLength: 2,
    });

    export const TOTAL_PAGE = () =>
    new TextboxItem({
        key: 'totalPage',
        label: 'Tổng số page',
        placeholder: 'Nhập tổng số page',
        value: null,
        maxLength: 6,
        customDirectives: /^[^0-9]*$/
    });

export const CREATED_AT = () =>
    new DateTimeItem({
        key: 'createdAt',
        label: 'Ngày báo cáo',
        placeholder: 'Nhập ngày báo cáo',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const CREATE_DATE = () =>
    new DateTimeItem({
        key: 'createDate',
        label: 'Ngày báo cáo',
        placeholder: 'Nhập ngày báo cáo',
        value: null,
        minDate: '1900-01-01',
        maxLength: 10
    });

export const SELECT_REPORT_NAME = [
    {
        key: 'RECONCILIATION',
        value: 'Báo cáo chi tiết đối soát'
    },
    {
        key: 'SETTLEMENT',
        value: 'Báo cáo chi tiết quyết toán'
    },
    {
        key: 'TIMEOUTTRANS',
        value: 'Báo cáo chi tiết kết quả xử lý giao dịch timeout'
    },
    {
        key: 'GENERAL',
        value: 'Báo cáo tổng hợp'
    },

]

export const SELECT_FLAG = [
    {
        key: 'PROCESSING',
        value: 'Đang nhận dữ liệu đối soát'
    },
    {
        key: 'DONE',
        value: 'Đã nhận đủ dữ liệu Napas gửi'
    },
    {
        key: 'FAIL',
        value: 'Nhận dữ liệu lỗi'
    },
]

export const SELECT_FLAG_ORS = [
    {
        key: 'PROCESSING',
        value: 'PROCESSING'
    },
    {
        key: 'DONE',
        value: 'DONE'
    },
    {
        key: 'FAIL',
        value: 'FAIL'
    },
]

export const STATUS_LABEL = [
    {
        key: 'FAIL',
        value: 'Nhận dữ liệu lỗi',
        class: 'wf-status-reject',
    },
    {
        key: 'PROCESSING',
        value: 'Đang nhận dữ liệu đối soát',
        class: 'wf-status-inprocess',
    },
    {
        key: 'DONE',
        value: 'Đã nhận đủ dữ liệu Napas gửi',
        class: 'wf-status-approved',
    },
]

export const LABEL_SERVICE = [
    {
        key: 'IBT',
        value: 'Chuyển tiền'
    },
    {
        key: 'QRP',
        value: 'Thanh toán'
    },
    {
        key: 'CBP',
        value: 'Thanh toán xuyên biên giới'
    },
    // {
    //     key: 'CBI',
    //     value: 'Chuyển tiền xuyên biên giới'
    // },
]

export const LABEL_RECEIVING_ROLE = [
    {
        key: 'DBIT',
        value: 'DBIT_là tổ chức phát lệnh'
    },
    {
        key: 'CRDT',
        value: 'CRDT_là tổ chức nhận lệnh'
    },
]