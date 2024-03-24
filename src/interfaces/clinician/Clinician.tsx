import { IPageParams } from "../paginate/Page";

export interface IClinicianParams extends IPageParams{
    firstname?: string,
    lastname?: string,
    username?: string
    isOTP?: boolean,
    isAvailable?: boolean,
}

export interface IClinicianResponse {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    isAvailable: boolean,
    isOtp: boolean,
    role: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IClinicianRequest {
    isAvailable: boolean,
}