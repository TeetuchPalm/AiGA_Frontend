export interface IUserResponse {
    data: IUser
}

export interface IUser {
    message: string,
    refreshToken: string,
    token: string,
    type: string,
    id: number,
    username: string,
    role: string[]
}

export interface IUserSignInRequest {
    username: string,
    password: string
}

export interface IUserSignUpRequest {
    username: string | null,
    password: string | null,
    email: string | null,
    isOTP: boolean
    firstname: string | null,
    lastname: string | null,
    role?: string,
}

export interface IUserJWT {
    exp: number,
    role: string
}

export interface IUserSignUpResponse {
    data: IUser
}

export interface IUserSignUp {
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    role: string
}

