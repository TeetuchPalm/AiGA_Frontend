import { IUserResponse } from "../User";
import { IPageParams } from "../paginate/Page";
import { ITagResponse } from "./tag/Tag";

export interface IPatientResponse {
    id: number,
    firstname: string,
    lastname: string,
    gender: boolean,
    dob: string,
    rangeOfMotion: boolean,
    underlyingDisease?: string,
    functionalLevel: number,
    residualLimbLength: number,
    residualLimbShape: string,
    amputatedLeg: string,
    weight: number,
    height: number,
    muscleStrength: boolean,
    prosthesisSocket: string,
    prosthesisStructure: string,
    prosthesisLinear: string,
    prosthesisSuspension: string,
    prosthesisFoot: string,
    createdAt: Date,
    updatedAt: Date,
    createdBy: IUserResponse,
    updatedBy: IUserResponse,
    tags: ITagResponse[],
}

export interface IPatientParams extends IPageParams {
    firstname?: string
    lastname?: string
    tags?: number[]
}

export interface IPatientRequest {
    firstname: string,
    lastname: string,
    gender: boolean,
    dob: Date,
    rangeOfMotion: boolean,
    underlyingDisease?: string,
    functionalLevel: number,
    residualLimbLength: number,
    residualLimbShape: string,
    amputatedLeg: string,
    weight: number,
    height: number,
    muscleStrength: boolean,
    prosthesisSocket: string,
    prosthesisStructure: string,
    prosthesisLinear: string,
    prosthesisSuspension: string,
    prosthesisFoot: string,
    tagIds: number[]
}