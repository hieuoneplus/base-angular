export interface IGetRolesParams {
    code?: string;
    name?: string;
    type?: string[];
    active?: boolean;
    page: number;
    size: number;
    sort?: string;
}

export interface IRoleContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    code: string;
    type: string;
    description: string;
    name: string;
    permissions: Map<string, IRolePermission[]>,
    active: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IRoleDetail {
    code: string;
    type: string;
    description: string;
    name: string;
    permissions: Map<string, IRolePermission[]>,
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IRolePermission {
    id: number;
    action: string;
    selected: boolean;
}

export interface IModulePermission {
    key: string,
    moduleName: string,
    children: IModuleChildren[],
}

export interface IModuleChildren {
    key: string,
    name: string,
    permissions: IRolePermission[],
    type?: string
}

export interface IPostRoleBody {
    code?: string;
    name?: string;
    type?: string;
    description?: string;
    reason?: string;
    permissionIds?: number[];
    active?: boolean;
}

export interface IPutRoleBody {
    name?: string;
    description?: string;
    active?: boolean;
    permissionIds?: number[];
    reason?: string;
}

export interface IPermission {
    id: number;
    module: string;
    action: string;
    type: string;
    description: string;
    createdAt: string;
}


export interface ICreateRoleBody {
    code: string;
    name: string;
    type: string;
    description: string;
    active: boolean;
    permissionIds: number[];
    reason: string;
}