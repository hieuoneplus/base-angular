export interface PaginationBaseDto<T> {
    content: T[];
    page?: number;
    size?: number;
    total?: number;
}
