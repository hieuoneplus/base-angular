export interface HttpInterface<T> {
    code: number;
    message: string;
    // serviceId: string | null;
    timestamp: string;
    data: T;
}

export interface HttpErrorInterface {
    code?: string | number;
    data?: null;
    message?: string;
    serviceId?: null;
    timestamp?: string;
    status?: number;
    statusText?: string;
}
