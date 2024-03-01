import React, { ReactElement, useState } from "react"
import { cloneDeep } from "lodash"
import { IHistoryParams } from "../../../interfaces/history/History"
import { IClinicianParams } from "../../../interfaces/clinician/Clinician"
import "./ClinicianListFilter.scss"
interface IProps {
    filterParams: IHistoryParams
    showFilter: (showFilter: boolean) => void
    sendParams: (
        params: IClinicianParams,
    ) => void
    isShowFilter: boolean
}

function ClincianListFilter({ filterParams, showFilter, sendParams, isShowFilter }: IProps): ReactElement {
    const [clinicianParams, setClinicianParams] = useState<IClinicianParams>(filterParams)


    const clearFilter = () => {
        const params: IClinicianParams = {
            pageNumber: 1,
            pageSize: 7
        }
        setClinicianParams(params)
        sendParams(params)
        closeFilter()
    }

    const showFilterDetailHeader = (isShow: boolean): JSX.Element | null => {
        let result: JSX.Element | null = null
        if (isShow) {
            result = (
                <div id="filterHeader">
                    <label id="filterHeaderText">Filter detail</label>
                </div>
            )
        }
        return result
    }

    const showDetailFilter = (title: string, value: string): JSX.Element | null => {
        let result: JSX.Element | null = null
        if (value.length > 0) {
            result = (
                <div className="detail-history-list-text-box">
                    <div className="detail-history-list-text-key-box">
                        <label className="detail-history-list-text-key">{title}</label>
                    </div>
                    <div className="detail-history-list-text-value-box">
                        <label className="detail-history-list-text-value">{value}</label>
                    </div>
                </div>
            )
        }
        return result
    }

    const closeFilter = () => {
        showFilter(false)
    }

    const searchClinicianList = () => {
        const clinicianParamsClone: IClinicianParams = cloneDeep(clinicianParams)
        clinicianParamsClone.pageNumber = 1
        sendParams(clinicianParamsClone)
        closeFilter()
    }

    return (
        <div id="clinicianFilter">
            {isShowFilter && (
                <div id="filterBox">
                    <div id="filterHeaderBox">
                        <div id="filterHeaderText">
                            <div className="filter-text">Filter</div>
                            <div className="clear-text infinity-btn" onClick={() => clearFilter()}>
                                Clear all
                            </div>
                        </div>
                        <div id="closeHeaderBox">
                            <div className="close-filter" onClick={() => closeFilter()}>
                                <div>X</div>
                            </div>
                        </div>
                    </div>
                    <hr className="filter-line" />
                    <div id="filterDetailsBox">
                        {showFilterDetailHeader(true)}
                        {showDetailFilter('Firstname: ', clinicianParams?.firstname || '')}
                        {showDetailFilter('Surname: ', clinicianParams?.lastname || '')}
                        {showDetailFilter('Username: ', clinicianParams?.username || '')}
                        {showDetailFilter('is OTP?: ', clinicianParams?.isOTP ? 'Yes' : '')}
                        {showDetailFilter('is Available?: ', clinicianParams?.isAvailable ? 'Yes' : '')}
                    </div>
                    <div className="filter-box">
                        <label className="form-label">
                            <strong>
                                Firstname&nbsp;
                            </strong>
                        </label>
                        <input type="text" className="form-control" value={clinicianParams?.firstname} onChange={(e) => { setClinicianParams({ ...clinicianParams, firstname: e.target.value }) }} />
                        <div className="filter-box">
                            <label className="form-label">
                                <strong>
                                    Surname&nbsp;
                                </strong>
                            </label>
                            <input type="text" className="form-control" value={clinicianParams?.lastname} onChange={(e) => { setClinicianParams({ ...clinicianParams, lastname: e.target.value }) }} />
                        </div>
                        <div className="filter-box">
                            <label className="form-label">
                                <strong>
                                    Username&nbsp;
                                </strong>
                            </label>
                            <input type="text" className="form-control" value={clinicianParams?.username} onChange={(e) => { setClinicianParams({ ...clinicianParams, username: e.target.value }) }} />
                        </div>
                        <div className="filter-box">
                            <input className="form-check-input" type="checkbox" defaultChecked={clinicianParams.isOTP} onChange={() => setClinicianParams({ ...clinicianParams, isOTP: !clinicianParams.isOTP })} />
                            <label className="form-label checkbox-label">
                                <strong>
                                    is OTP?&nbsp;
                                </strong>
                            </label>
                        </div>
                        <div className="filter-box">
                            <input className="form-check-input" type="checkbox" defaultChecked={clinicianParams.isAvailable} onChange={() => setClinicianParams({ ...clinicianParams, isOTP: !clinicianParams.isAvailable })} />
                            <label className="form-label checkbox-label">
                                <strong>
                                    is Available&nbsp;
                                </strong>
                            </label>
                        </div>
                        <div className="button-action">
                            <button className="button-search infinity-btn" onClick={() => searchClinicianList()}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ClincianListFilter
