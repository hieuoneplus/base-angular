export interface PaginationFileBaseDto<T> {
    files: T[];
    page?: number;
    pageSize?: number;
    total?: number;
}

export interface ListFileResponse {
    stt?: number;
    id?: string;
    fileName?: string;
    fileUrl?: string;
    fileExtension?: string;
    status?: string;
    fileInfo?: string;
    userName?: string;
    createdAt?: string;
    updatedAt?: string;
    contentType?: string;
    textDetect?: string;
}

export interface IParamsFileSearch {
  fileName?: string,
  toDate?: string,
  endDate?: string,
  fileView?: string,
  page?: number,
  size?: number
}

export interface IShareFileRequest {
  username: string,
  fileIds: string[]
}
