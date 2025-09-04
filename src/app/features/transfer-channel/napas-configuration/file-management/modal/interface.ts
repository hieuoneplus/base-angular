export interface PaginationFileBaseDto<T> {
    fileOutputs: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface ListFileResponse {
    stt?: number
    id?: string,
    referenceId?: string,
    fileName?: string,
    mimeType?: string,
    encodeType?: string,
    charSet?: string,
    fileUrl?: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface IParamsFileSearch {
  fileName?: string,
  toDate?: string,
  endDate?: string,
  page?: number,
  size?: number
}
