export interface IHistoryModelResponse {
    history_id: string,
    result: IHistoryModelResultResponse
}

export interface IHistoryModelResultResponse {
    left: IHistoryModelResultLeftResponse,
    right: IHistoryModelResultRightResponse
}

export interface IHistoryModelResultLeftResponse extends IHistoryScoresResultResponse {
    left_knee: Array<Array<IHistoryGraphResponse>>,
    left_hip: Array<Array<IHistoryGraphResponse>>
}

export interface IHistoryModelResultRightResponse extends IHistoryScoresResultResponse {
    right_knee: Array<Array<IHistoryGraphResponse>>,
    right_hip: Array<Array<IHistoryGraphResponse>>
}

export interface IHistoryScoresResultResponse {
    score_1: IHistoryScoreResultResponse,
    score_2: IHistoryScoreResultResponse,
    score_3: IHistoryScoreResultResponse,
    score_4: IHistoryScoreResultResponse,
    score_5: IHistoryScoreResultResponse,
    score_6: IHistoryScore6ResultResponse[]
}

export interface IHistoryScoreResultResponse {
    IC: number,
    LR: number,
    MST: number,
    TST: number,
    PS: number,
    MSW: number,
    TSW: number,
    IS: number
}

export interface IHistoryGraphResponse {
    frame: number,
    angle: number
}

export interface IHistoryScore6ResultResponse {
    score: number,
    state: string
}