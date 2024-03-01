import { IPageParams } from "../../paginate/Page"

export interface ITagResponse {
    id: number
    name: string
}

export interface ITagParams extends IPageParams {
    name?: string
}