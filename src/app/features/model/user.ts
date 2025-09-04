export interface IGetUsersParams {
    roleCode?: string;
    username?: string;
    fullName?: string;
    phoneNumber?: string;
    active?: string;
    page: number;
    size: number;
    sort?: string;
}

export interface IUserContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    username: string;
    employeeCode: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    jobName: string;
    orgName: string;
    roles: IUserContentRole[];
    reason: string;
    active: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IUserContentRole {
    roleId: string;
    roleCode: string;
    roleName: string;
    roleType: string;
}

export interface IUserContentByUserName {
    employeeCode: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    orgCodeManage: string;
    orgCodeLevel1: string;
    orgCodeLevel2: string;
    orgCodeLevel3: string;
    orgNameManage: string;
    orgNameLevel1: string;
    orgNameLevel2: string;
    orgNameLevel3: string;
    jobCode: string;
    jobName: string;
}

export interface IRequestPostUser {
    username?: string;
    roleIds?: string[];
    active?: boolean;
    reason?: string;
}

export interface IContentPostUser {
    id: number;
    username: string;
    employeeCode: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    jobName: string;
    orgName: string;
    roles: IUserContentRole;
    reason: string;
    active: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IRequestPutUser {
    roleIds?: string[];
    active?: boolean;
    reason?: string;
}

export interface IProfile {
    username: string;
    employeeCode: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    jobName: string;
    orgName: string;
    roles: IUserContentRole[];
    reason: string;
    active: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}
