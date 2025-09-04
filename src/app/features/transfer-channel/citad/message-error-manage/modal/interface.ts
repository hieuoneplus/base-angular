export interface IParamQMessageErrorManage {
    keys: string;
    topics: string;
    createaAtForm: string;
    createaAtTo: string;
}

export interface IResponseMessageErrorManage {
    id?: number;
    topic?: string;
    partition?: number;
    offset?: number;
    key?: string;
    message?: string;
    error?: string,
    status?: string;
    retryThreshold?: number;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string
}
