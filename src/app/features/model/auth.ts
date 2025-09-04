export interface ISendOtp {
    otpKey: string;
}

export interface IVerifyOtpInput {
    otpKey: string;
    otpValue: string;
}

export interface IVerifyOtpOutput {
    isVerified: boolean;
}

export interface IUserPermissions {
    module: string;
    actions: string[]
}

export interface IUserBilateral {
    userName: string;
    scopes: string[];
    roles: string[];
}