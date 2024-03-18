import { IPageParams } from "../../paginate/Page"

export interface IGroupResponse {
    id: number
    name: string
    description: string
}

export interface IGroupParams extends IPageParams {
    name?: string
}

export interface IGroupRequest {
    name: string
    description: string | undefined
}