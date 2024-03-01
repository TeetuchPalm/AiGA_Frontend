import { IPageParams } from "../../paginate/Page"

export interface IGroupResponse {
    id: number
    name: string
}

export interface IGroupParams extends IPageParams {
    name?: string
}