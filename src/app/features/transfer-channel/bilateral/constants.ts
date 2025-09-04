
export const STATUS_OPTIONS = [
    { key: '', value: 'All' },
    { key: 'NAUT', value: 'NAUT' },
    { key: 'NOAN', value: 'NOAN' },
    { key: 'AUTH', value: 'AUTH' },
    { key: 'NEXS', value: 'NEXS' },
];


export const STATE_OPTIONS = [
    { key: '', value: 'All' },
    { key: 'SUCCESS', value: 'SUCCESS' },
    { key: 'ERROR', value: 'ERROR' },
];

export const SWIFT_CODE_LIST = [
    { key: '', value: 'All' },
    { key: 'ICBVVNVX', value: 'ICBVVNVX' },
    { key: 'MSCBVNVX', value: 'MSCBVNVX' },
    { key: 'BFTVVNVX', value: 'BFTVVNVX' },
    { key: 'LVBKVNVX', value: 'LVBKVNVX' },
    { key: 'BIDVVNVX', value: 'BIDVVNVX' },
    { key: 'VBAAVNVX', value: 'VBAAVNVX' },
]


export const ROLE = {
    BILATERAL_MAKER: 'BILATERAL_MAKER',
    BILATERAL_APPROVER: 'BILATERAL_APPROVER',
    BILATERAL_CAPITAL_APPROVER: 'BILATERAL_CAPITAL_APPROVER',
};

export const DISPUTE_KEYS = {
    NEW: 'NEW',
    OPEN: 'OPEN',
    REJECT: 'REJECT',
    SUCCESS: 'SUCCESS',
    UNSUCCESS: 'UNSUCCESS',

    PRCD: 'PRCD',
    RJCT: 'RJCT',
    EXPI: 'EXPI',
    CLSD: 'CLSD',

};

export const SP_RESPONSE_STATUS_CODE = {
    ACK: 'ACK',
    NACK: 'NACK',
    NOAN: 'NOAN',
};

export const DISPUTE_STATE_PORTAL = [
    { key: '', value: 'All' },
    { key: DISPUTE_KEYS.NEW, value: DISPUTE_KEYS.NEW },
    { key: DISPUTE_KEYS.OPEN, value: DISPUTE_KEYS.OPEN },
    { key: DISPUTE_KEYS.REJECT, value: DISPUTE_KEYS.REJECT },
    { key: DISPUTE_KEYS.SUCCESS, value: DISPUTE_KEYS.SUCCESS },
    { key: DISPUTE_KEYS.UNSUCCESS, value: DISPUTE_KEYS.UNSUCCESS },
];

export const DISPUTE_RESPONSE_STATUS = [
    { key: '', value: 'All' },
    { key: SP_RESPONSE_STATUS_CODE.ACK, value: SP_RESPONSE_STATUS_CODE.ACK, },
    { key: SP_RESPONSE_STATUS_CODE.NACK, value: SP_RESPONSE_STATUS_CODE.NACK },
    { key: SP_RESPONSE_STATUS_CODE.NOAN, value: SP_RESPONSE_STATUS_CODE.NOAN },
];

export const DISPUTE_PROCESS_STATE = [
    { key: '', value: 'All' },
    { key: DISPUTE_KEYS.OPEN, value: DISPUTE_KEYS.OPEN },
    { key: DISPUTE_KEYS.PRCD, value: DISPUTE_KEYS.PRCD },
    { key: DISPUTE_KEYS.RJCT, value: DISPUTE_KEYS.RJCT },
    { key: DISPUTE_KEYS.EXPI, value: DISPUTE_KEYS.EXPI },
    { key: DISPUTE_KEYS.CLSD, value: DISPUTE_KEYS.CLSD },
];

export const TRANSACTION_DIRECTION = {
    INCOME: 'INC',
    OUTCOME: 'OUT'
}
export const REQUEST_DISPUTE = 'REQUEST_DISPUTE';
export const ANSWER_DISPUTE = 'ANSWER_DISPUTE';
export const CMA_DSPTMSG_REQ = 'cma.dsptMsg.req';//Yêu cầu tra soát
export const CMA_DSPTMSG_RES = 'cma.dsptMsg.res';//Trả lời tra soát

export const DISPUTE_TYPES = {
    RQRN: 'RQRN',
    RQAD: 'RQAD',
    RQSP: 'RQSP',
    FREE: 'FREE',
};
export const CONFIG_KEYS = [
    "BUFFER_TIME", "BANK_NAME",
    "BANK_CODE", "WHITELIST", "OFF_SERVICE",
    "LIST_HOLIDAY", "TIME_RTF", "TIME_OVER_RECONCILE",
    "PERCENT", "ENABLE_RECONCILE_JOB_VERSION",
    "RECONCILE_NUM", "IGNORE_VERIFY",
    "CUT_OFF_TIME", "CHAR_RJCT",
];

export const ADDITIONAL_ACCOUTING_STATUS = {
    'NEW': 'Mới',
    'IMPORT_SUCCESS': 'Import thành công',
    'IMPORT_FAILED': 'Import thất bại',
    'AWAITING_APPROVAL': 'Chờ duyệt',
    'PROCESSING_APPROVE': 'Đang xử lý hạch toán bổ sung',
    'REJECT_HTBS': 'Từ chối duyệt',
    'HTBS_SUCCESS': 'Hạch toán thành công',
    'HTBS_FAILED': 'Hạch toán thất bại',
    'TIME_OUT': 'Hạch toán time out',
    'APPROVED': 'Đã duyệt',
}

export const ADDITIONAL_ACCOUTING_STATUS_KEYS = {
    NEW: 'NEW',
    IMPORT_SUCCESS: 'IMPORT_SUCCESS',
    IMPORT_FAILED: 'IMPORT_FAILED',
    AWAITING_APPROVAL: 'AWAITING_APPROVAL',
    PROCESSING_APPROVE: 'PROCESSING_APPROVE',
    REJECT_HTBS: 'REJECT_HTBS',
    HTBS_SUCCESS: 'HTBS_SUCCESS',
    HTBS_FAILED: 'HTBS_FAILED',
};


export const REFUND_STATUS = {
    'NEW': 'Mới',
    'IMPORT_SUCCESS': 'Import thành công',
    'IMPORT_FAILED': 'Import thất bại',
    'AWAITING_APPROVAL': 'Chờ duyệt',
    'PROCESSING_APPROVE': 'Đang xử lý hạch toán',
    'REJECTED': 'Từ chối duyệt',
    'SUCCESS': 'Hạch toán thành công',
    'ERROR': 'Hạch toán thất bại',
    'TIME_OUT': 'Hạch toán time out',
    'APPROVED': 'Đã duyệt',
}

export const REFUND_STATUS_KEYS = {
    NEW: 'NEW',
    IMPORT_SUCCESS: 'IMPORT_SUCCESS',
    IMPORT_FAILED: 'IMPORT_FAILED',
    AWAITING_APPROVAL: 'AWAITING_APPROVAL',
    PROCESSING_APPROVE: 'PROCESSING_APPROVE',
    REJECTED: 'REJECTED',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};