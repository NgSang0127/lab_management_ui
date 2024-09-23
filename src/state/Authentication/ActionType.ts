export interface RegisterRequest{
    firstName:string;
    lastName:string;
    email:string;
    username:string;
    password:string;
    phoneNumber:string;
}



export interface LoginRequestData {
    username: string;
    password: string;
}

 export interface AuthResponseData {
    accessToken: string;
    refreshToken: string;
    role: string;
    message: string;

}
