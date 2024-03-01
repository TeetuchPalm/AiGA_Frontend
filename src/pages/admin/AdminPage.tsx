import React, { ReactElement, useEffect, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import "./AdminPage.scss";
import { useNavigate } from "react-router-dom";
import { IClinicianParams, IClinicianResponse } from "../../interfaces/clinician/Clinician";
import { IPageResponse } from "../../interfaces/paginate/Page";
import { getClinicians, updateAvailable } from "../../services/api/aigaService";
import swal from "sweetalert2"
import { HandleError } from "../../interfaces/error/handleError";
import { convertDate, getTime } from "../../plugins";
import Pagination from "../../components/paginate/paginate";
import ReactSwitch from "react-switch";
import LoadingModal from "../../components/loading/loading";
import ClincianListFilter from "../../components/filter/clinician-list/ClinicianListFilter";


function AdminPage(): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultClinicianParams: IClinicianParams = {
        pageNumber: 1,
        pageSize: 7,
        sortBy: "id",
        sortType: "asc",
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [clinicianParams, setClinicianParams] = useState<IClinicianParams>({})
    const [clinicianPaginate, setClinicianPaginate] = useState<IPageResponse<IClinicianResponse[]>>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowFilter, setIsShowFilter] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        setSearchParamsToClinicianParams();
    }, [])

    useEffect(() => {
        fetchClinicians(clinicianParams);
    }, [clinicianParams])

    const fetchClinicians = async (params: IClinicianParams) => {
        if (Object.keys(clinicianParams ?? {})?.length) {
            setClinicianParamsToSearchParams(clinicianParams);
            try {
                setIsLoading(true)
                const response = await getClinicians(params)
                setClinicianPaginate(response);
                setIsLoading(false)
            } catch (e) {
                const error: HandleError = e as HandleError
                setIsLoading(false)
                swal.fire({
                    icon: 'error',
                    title: 'Failed Error code: ' + error.response.data.errorCode,
                    text: error.response.data.errorMessage
                })
            }
        }
    }

    const setSearchParamsToClinicianParams = () => {
        let params: IClinicianParams = defaultClinicianParams
        if (!![...searchParams?.keys()]?.length) {
            const newParams: IClinicianParams = {}
            for (const [key, value] of searchParams?.entries()) {
                newParams[key as keyof IClinicianParams] = value as any
            }
            params = { ...newParams, pageNumber: 1 }
        }
        setClinicianParams(params)
    }

    const setClinicianParamsToSearchParams = (params: IClinicianParams) => {
        const newSearchParams: URLSearchParamsInit = {}
        for (const [key, value] of Object.entries(params)) {
            if (!!value) {
                newSearchParams[key] = value;
            }
        }
        setSearchParams(newSearchParams);
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        setClinicianParams({ ...clinicianParams, pageNumber: pageNumber })
    }

    const handleOnClickToggle = async (id: number, isAvailable: boolean) => {
        await updateAvailable({ isAvailable: !isAvailable }, id)
        window.location.reload()
    }

    const showDetailFilter = (): JSX.Element => {
        const paramsPath: URLSearchParams = new URLSearchParams(window.location.search)
        const result: Array<JSX.Element> = []
        if (paramsPath.get('firstname') !== null) {
            result.push(<label className="text-filter-box"><strong>Firstname : </strong>{paramsPath.get('firstname')}</label>)
        }
        if (paramsPath.get('lastname') !== null) {
            result.push(<label className="text-filter-box"><strong>Surname : </strong>{paramsPath.get('lastname')}</label>)
        }
        if (paramsPath.get('username') !== null) {
            result.push(<label className="text-filter-box"><strong>Username : </strong>{paramsPath.get('username')}</label>)
        }
        if (paramsPath.get('isOTP') !== null) {
            result.push(<label className="text-filter-box"><strong>is OTP? : </strong>{'Yes'}</label>)
        }
        if (paramsPath.get('isAvailable') !== null) {
            result.push(<label className="text-filter-box"><strong>is Available : </strong>{'Yes'}</label>)
        }
        return <label id="showDetailFilter">{result}</label>
    }

    const dataRender = (list: IClinicianResponse[] | undefined): React.JSX.Element[] | undefined => {
        if (list?.length) {
            return list?.map((item: IClinicianResponse, index: number) => {
                return (
                    <tr key={index}>
                        <td className="text-start">{item.id}</td>
                        <td className="text-start">{item.username}</td>
                        <td className="text-start">{item.firstname}</td>
                        <td className="text-start">{item.lastname}</td>
                        <td className="text-start">{item.role}</td>
                        <td className="text-start">
                            <div className="flex gap-xs item-center">
                                <span>{convertDate(item.createdAt)}</span>
                            </div>
                            <div className="flex gap-xs item-center">
                                <span>{getTime(item.createdAt)}</span>
                            </div>
                        </td>
                        <td className="text-start">
                            <div className="flex gap-xs item-center">
                                <span>{convertDate(item.createdAt)}</span>
                            </div>
                            <div className="flex gap-xs item-center">
                                <span>{getTime(item.createdAt)}</span>
                            </div>
                        </td>
                        <td className="text-start">
                            {item.isOTP ? "Yes" : "No"}
                        </td>
                        <td className="text-start">
                            <ReactSwitch onChange={() => { handleOnClickToggle(item.id, item.isAvailable) }} checked={item.isAvailable} disabled={item.username === 'admin'} />
                        </td>
                    </tr>
                )
            })
        } else {
            return [<h1 style={{ textAlign: "center" }}>Not Found</h1>]
        }
    }


    return (
        <>
            <LoadingModal showLoadingModal={isLoading} />
            {isShowFilter &&
                <div id="patientListFilter">
                    <ClincianListFilter
                        isShowFilter={isShowFilter}
                        showFilter={value => setIsShowFilter(value)}
                        sendParams={(params) => {
                            setClinicianParams(params)
                        }
                        }
                        filterParams={clinicianParams}
                    />
                </div>
            }
            <div id="clinicianList">
                <div className="container-fluid">
                    <div className="card" id="TableSorterCard">
                        <div className="card-header py-3 cardHeader">
                            <div className="row table-topper align-items-center option-bar">
                                <div className="pageBar">
                                    <Pagination
                                        currentPage={Number(clinicianParams.pageNumber ?? 1)}
                                        setCurrentPage={handlePageChange}
                                        lastPage={clinicianPaginate?.totalPages ?? 1}
                                        isLastPage={clinicianPaginate?.last}
                                    />
                                    <button
                                        className="btn btn-light btn-sm"
                                        id="refresh"
                                        type="button"
                                        onClick={() => window.location.reload()}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="bi bi-arrow-clockwise clockwiseArrow"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                                            ></path>
                                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        className="btn btn-light btn-sm filter-button"
                                        type="button"
                                        onClick={() => setIsShowFilter(true)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="bi bi-funnel"
                                        >
                                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"></path>
                                        </svg>
                                    </button>
                                    {showDetailFilter()}
                                </div>
                            </div>
                        </div>
                        <div className="row row-header">
                            <div className="col-12 row-header-container">
                                <div className="table-responsive">
                                    <table
                                        className="table table-striped table tablesorter"
                                        id="ipi-table"
                                    >
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-capitalize text-start">
                                                    Clinician ID
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    <strong>Username</strong>
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Firstname
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Lastname
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Role
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Created at
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Updated at
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    2FA-Enable?
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    is-Available?
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {dataRender(clinicianPaginate?.entities)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminPage;