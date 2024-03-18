export interface IResetPasswordRequest {
    token: string,
    password: string
}

export interface ICheckResetPasswordResponse {
    token: string,
    expried: boolean
}