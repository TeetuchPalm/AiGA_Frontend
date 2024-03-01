import { IUserSignUp } from "../User"
import { IPageParams } from "../paginate/Page"
import { IPatientResponse } from "../patient/Patient"
import { IGroupResponse } from "./group/Group"

export interface ICreateHistoryRequest {
    title: string,
    description: string,
    video?: string,
    patientId: number,
    groupIds: number[]
}

export interface IHistoryResponse {
    id: number,
    title: string,
    description: string,
    video: string,
    abnormal: string,
    status: string,
    patient: IPatientResponse,
    createdBy: IUserSignUp,
    updatedBy: IUserSignUp,
    createdAt: Date,
    updatedAt: Date,
    groups: IGroupResponse[]
}

export interface IHistoryParams extends IPageParams {
    patient?: null | number,
    clinician?: null | number,
    abnormal?: null | string,
    groups?: null | number[],
}

export interface IHistoryModelRequest {
    history_id: string,
    video_url: string
}