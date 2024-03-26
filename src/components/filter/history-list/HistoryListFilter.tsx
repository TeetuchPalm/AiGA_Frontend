import React, { ReactElement, useEffect, useState } from "react"
import Select from "react-select"
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface"
import { IPageParams, IPageResponse } from "../../../interfaces/paginate/Page"
import { getAllPageGroup, getClinicians, getPatients } from "../../../services/api/aigaService"
import { cloneDeep } from "lodash"
import { IHistoryParams } from "../../../interfaces/history/History"
import { IGroupParams, IGroupResponse } from "../../../interfaces/history/group/Group"
import { IClinicianParams, IClinicianResponse } from "../../../interfaces/clinician/Clinician"
import "./HistoryListFilter.scss"
import { IPatientResponse } from "../../../interfaces/patient/Patient"
interface IProps {
    filterParams: IHistoryParams
    showFilter: (showFilter: boolean) => void
    sendParams: (
        params: IHistoryParams,
        selectedPatient: IReactSelect | null,
        selectedClinician: IReactSelect | null,
        selectedGroup: IReactSelect | null
    ) => void
    isShowFilter: boolean
    selectedPatientProp: IReactSelect | null
    selectedClinicianProp: IReactSelect | null
    selectedGroupProp: IReactSelect | null
}

function HistoryListFilter({ filterParams, showFilter, sendParams, isShowFilter, selectedPatientProp, selectedClinicianProp, selectedGroupProp }: IProps): ReactElement {
    const [historyParams, setHistoryParams] = useState<IHistoryParams>(filterParams)
    const [groupOptions, setGroupOptions] = useState<IReactSelect[]>([])
    const [groupQuery, setGroupQuery] = useState<IGroupParams>({
        pageNumber: 1,
        pageSize: 20
    })
    const [selectedGroup, setSelectedGroup] = useState<IReactSelect | null>(selectedGroupProp)
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [clinicianOptions, setClinicianOptions] = useState<IReactSelect[]>([])
    const [selectedClinician, setSelectedClinician] = useState<IReactSelect | null>(selectedClinicianProp)
    const [clinicianQuery, setClinicianQuery] = useState<IClinicianParams>({
        pageNumber: 1,
        pageSize: 20
    })
    const [selectedPatient, setSelectedPatient] = useState<IReactSelect | null>(selectedPatientProp)
    const [patientOptions, setpatientOptions] = useState<IReactSelect[]>([])
    const [patientQuery, setPatientQuery] = useState<IPageParams>({
        pageNumber: 1,
        pageSize: 20
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (isSearch) {
            fetchGroup()
            setIsSearch(false)
        }
    }, [groupOptions])

    useEffect(() => {
        if (isSearch) {
            fetchClinician()
            setIsSearch(false)
        }
    }, [clinicianOptions])

    useEffect(() => {
        if (isSearch) {
            getAllPatient()
            setIsSearch(false)
        }
    }, [patientOptions])

    const fetchData = async () => {
        await fetchGroup()
        await fetchClinician()
        await getAllPatient()
    }

    const getAllPatient = async () => {
        const response: IPageResponse<IPatientResponse[]> = await getPatients(patientQuery)
        setpatientOptions(patientOptions.concat(response.entities.map(patient => (
            {
                label: patient.firstname + " " + patient.lastname, value: patient.id.toString()
            }))))
    }

    const fetchGroup = async () => {
        const response: IPageResponse<IGroupResponse[]> = await getAllPageGroup(groupQuery)
        setGroupOptions(groupOptions.concat(response.entities.map(tag => (
            {
                label: tag.name, value: tag.id.toString()
            }))))
    }

    const fetchClinician = async () => {
        const response: IPageResponse<IClinicianResponse[]> = await getClinicians(clinicianQuery)
        setClinicianOptions(clinicianOptions.concat(response.entities.map(clinician => (
            {
                label: clinician.firstname + " " + clinician.lastname, value: clinician.id.toString()
            }))))
    }

    const formatOptionLabel = (option: IReactSelect): React.JSX.Element => {
        return (
            <div>
                {option.label}
            </div>
        )
    }

    const clearFilter = () => {
        const params: IHistoryParams = {
            patient: undefined,
            clinician: undefined,
            groups: undefined,
            pageNumber: 1,
            pageSize: 7
        }
        setHistoryParams(params)
        sendParams(params, null, null, null)
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

    const searchHistoryList = () => {
        const historyParamsClone: IHistoryParams = cloneDeep(historyParams)
        historyParamsClone.pageNumber = 1
        sendParams(historyParamsClone, selectedPatient, selectedClinician, selectedGroup)
        closeFilter()
    }

    return (
        <div id="historyFilter">
            {isShowFilter && (
                <div id="filterBox">
                    <div id="filterHeaderBox">
                        <div id="filterHeaderText">
                            <div className="filter-text">Filter</div>
                            <div className="clear-text infinity-btn" onClick={() => clearFilter()}>
                                Clear All
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
                        {showDetailFilter('Patient: ', selectedPatient?.label || historyParams.patient?.toString() || '')}
                        {showDetailFilter('Clinician: ', selectedClinician?.label || historyParams.clinician?.toString() || '')}
                        {showDetailFilter('Groups: ', selectedGroup?.label || historyParams.groups?.toString() || '')}
                    </div>
                    <div className="filter-box">
                        <div className="warpper">
                            <label className="form-label">
                                <strong>Select
                                    Patient&nbsp;
                                </strong>
                            </label>
                            <button className="btn btn-light btn-sm clear" onClick={() => { setSelectedPatient(null); setHistoryParams({ ...historyParams, patient: undefined })}}>
                                Clear
                            </button>
                        </div>
                        <Select
                            inputId="patient"
                            isSearchable={true}
                            filterOption={() => true}
                            options={patientOptions}
                            formatOptionLabel={formatOptionLabel}
                            onChange={(value: IReactSelect | null) => {
                                setSelectedPatient(value)
                                setHistoryParams({ ...historyParams, patient: Number(value?.value) || undefined })
                            }}
                            onMenuScrollToBottom={() => {
                                setPatientQuery(patientQuery => ({ ...patientQuery, pageNumber: patientQuery.pageNumber!! + 1 }))
                                if (patientOptions.length === patientQuery.pageSize!! * (patientQuery.pageNumber!! - 1)) {
                                    getAllPatient()
                                }
                            }}
                            onInputChange={(value) => {
                                if (value.length >= 3 || value.length <= 0) {
                                    setIsSearch(true)
                                    setpatientOptions([])
                                    if (value.split(' ')[1] !== null) {
                                        setPatientQuery(patientQuery => ({ ...patientQuery, firstname: value.split(' ')[0], lastname: value.split(' ')[1], pageNumber: 1 }))
                                    } else {
                                        setPatientQuery(patientQuery => ({ ...patientQuery, firstname: value, pageNumber: 1 }))
                                    }
                                }
                            }}
                            value={selectedPatient}
                        />
                    </div>
                    <div className="filter-box">
                        <div className="warpper">
                            <label className="form-label">
                                <strong>Select
                                    Clinician&nbsp;
                                </strong>
                            </label>
                            <button className="btn btn-light btn-sm clear" onClick={() => { setSelectedClinician(null); setHistoryParams({ ...historyParams, clinician: undefined }) }}>
                                Clear
                            </button>
                        </div>
                        <Select
                            inputId="clinician"
                            isSearchable={true}
                            filterOption={() => true}
                            options={clinicianOptions}
                            formatOptionLabel={formatOptionLabel}
                            onChange={(value: IReactSelect | null) => {
                                setSelectedClinician(value)
                                setHistoryParams({ ...historyParams, clinician: Number(value?.value) || undefined })
                            }}
                            onMenuScrollToBottom={() => {
                                setClinicianQuery(clinicianQuery => ({ ...clinicianQuery, pageNumber: clinicianQuery.pageNumber!! + 1 }))
                                if (clinicianOptions.length === clinicianQuery.pageSize!! * (clinicianQuery.pageNumber!! - 1)) {
                                    fetchClinician()
                                }
                            }}
                            onInputChange={(value) => {
                                if (value.length >= 3 || value.length <= 0) {
                                    setIsSearch(true)
                                    setClinicianOptions([])
                                    if (value.split(' ')[1] !== null) {
                                        setClinicianQuery(clinicianQuery => ({ ...clinicianQuery, firstname: value.split(' ')[0], lastname: value.split(' ')[1], pageNumber: 1 }))
                                    } else {
                                        setClinicianQuery(clinicianQuery => ({ ...clinicianQuery, firstname: value, pageNumber: 1 }))
                                    }
                                }
                            }}
                            value={selectedClinician}
                        />
                    </div>
                    <div className="filter-box">
                        <div className="warpper">
                            <label className="form-label">
                                <strong>Select
                                    Group&nbsp;
                                </strong>

                            </label>
                            <button className="btn btn-light btn-sm clear" onClick={() => { setSelectedGroup(null); setHistoryParams({ ...historyParams, groups: undefined }) }}>
                                Clear
                            </button>
                        </div>
                        <Select
                            inputId="group"
                            isSearchable={true}
                            filterOption={() => true}
                            options={groupOptions}
                            formatOptionLabel={formatOptionLabel}
                            onChange={(value: IReactSelect | null) => {
                                setSelectedGroup(value)
                                setHistoryParams({ ...historyParams, groups: [Number(value?.value)] || undefined })
                            }}
                            onMenuScrollToBottom={() => {
                                setGroupQuery(groupQuery => ({ ...groupQuery, pageNumber: groupQuery.pageNumber!! + 1 }))
                                if (groupOptions.length === groupQuery.pageSize!! * (groupQuery.pageNumber!! - 1)) {
                                    fetchGroup()
                                }
                            }}
                            onInputChange={(value) => {
                                if (value.length >= 3 || value.length <= 0) {
                                    setIsSearch(true)
                                    setGroupOptions([])
                                    setGroupQuery(groupQuery => ({ ...groupQuery, name: value, pageNumber: 1 }))
                                }
                            }}
                            value={selectedGroup}
                        />
                    </div>
                    <div className="button-action">
                        <button className="button-search infinity-btn" onClick={() => searchHistoryList()}>
                            Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default HistoryListFilter
