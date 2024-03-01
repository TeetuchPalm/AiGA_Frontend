export interface IPageResponse<T> {
    entities: T
    first: boolean
    last: boolean
    pageInformation: IPageInformation
    sequence: number
    totalPages: number
    totalElements?: number
  }

export interface IPageParams {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    sortType?: string
    sort?: string
}

export interface IPageInformation {
    number: number
    size: number
  }