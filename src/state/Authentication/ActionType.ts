export interface RegisterRequest{
    firstName:string;
    lastName:string;
    email:string;
    username:string;
    password:string;
    phoneNumber:string;
}

export interface ForgotPasswordRequest{
    email:string;
}
export interface ResetPasswordRequest{
    email:string;
    code:string;
    newPassword:string | null;
}

export interface LoginRequestData {
    username: string;
    password: string;
}

 export interface AuthResponseData {
    access_token: string;
    refresh_token: string;
    role: string;
    message: string;
    secretImageUri:string ;
    tfaEnabled: boolean;
}
export interface VerificationCodeRequest {
    code:string;
    username:string;
}