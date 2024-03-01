import React, { ReactElement, useEffect, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import "./ListHistory.css";
import { useNavigate } from "react-router-dom";
import { deleteHistories, getHistories } from "../../../services/api/aigaService";
import { IPageResponse } from "../../../interfaces/paginate/Page";
import { convertDate, getTime } from "../../../plugins";
import Pagination from "../../../components/paginate/paginate";
import { IApiResponse } from "../../../interfaces/ApiResponse";
import swal from 'sweetalert2'
import { HandleError } from "../../../interfaces/error/handleError";
import { IHistoryParams, IHistoryResponse } from "../../../interfaces/history/History";
import LoadingModal from "../../../components/loading/loading";
import HistoryListFilter from "../../../components/filter/history-list/HistoryListFilter";
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface";

function ListHistory(): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultHistoryParams: IHistoryParams = {
        pageNumber: 1,
        pageSize: 7,
        sortBy: "id",
        sortType: "asc",
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [historyParams, setHistoryParams] = useState<IHistoryParams>({})
    const [isShowFilter, setIsShowFilter] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [historyPaginate, setHistoryPaginate] =
        useState<IPageResponse<IHistoryResponse[]>>()
    const [selectedGroup, setSelectedGroup] = useState<IReactSelect | null>(null)
    const [selectedPatient, setSelectedPatient] = useState<IReactSelect | null>(null)
    const [selectedClinician, setSelectedClinician] = useState<IReactSelect | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        setSearchParamsToHistoryParams();
    }, []);

    useEffect(() => {
        fetchHistories(historyParams);
    }, [historyParams]);

    const onNavigate = (id?: number) => {
        if (id) {
            navigate(`/history/${id}`);
        }
    };

    const fetchHistories = async (params: IHistoryParams) => {
        if (Object.keys(historyParams ?? {})?.length) {
            setHistoryParamsToSearchParams(historyParams);
            try {
                setIsLoading(true)
                const response = await getHistories(params)
                setHistoryPaginate(response)
                setIsLoading(false)
            } catch (e) {
                setIsLoading(false)
                const error: HandleError = e as HandleError
                swal.fire({
                    icon: 'error',
                    title: 'Failed Error code: ' + error.response.data.errorCode,
                    text: error.response.data.errorMessage
                })
            }
        }
    };

    const setSearchParamsToHistoryParams = () => {
        let params: IHistoryParams = defaultHistoryParams
        if (!![...searchParams?.keys()]?.length) {
            const newParams: IHistoryParams = {}
            for (const [key, value] of searchParams?.entries()) {
                newParams[key as keyof IHistoryParams] = value as any
            }
            params = { ...newParams, pageNumber: 1 }
        }
        setHistoryParams(params)
    };

    const setHistoryParamsToSearchParams = (params: IHistoryParams) => {
        const newSearchParams: URLSearchParamsInit = {}
        for (const [key, value] of Object.entries(params)) {
            if (!!value) {
                newSearchParams[key] = value;
            }
        }
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setHistoryParams({ ...historyParams, pageNumber: pageNumber });
    };

    const deleteHistoryById = async (history: IHistoryResponse) => {
        swal.fire({
            title: "Confirm",
            text: "Are you sure you want to Delete History: " + history.title + " id: " + history.id + " ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm"
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true)
                    const response: IApiResponse = await deleteHistories(history.id.toString())
                    setIsLoading(false)
                    swal.fire({
                        icon: 'success',
                        title: 'Delete success',
                        text: response.message
                    }).then(() => {
                        window.location.reload()
                    })
                } catch (e) {
                    setIsLoading(false)
                    const error: HandleError = e as HandleError
                    swal.fire({
                        icon: 'error',
                        title: 'Failed Error code: ' + error.response.data.errorCode,
                        text: error.response.data.errorMessage
                    })
                }
            }
          })
    }

    const showDetailFilter = (): JSX.Element => {
        const paramsPath: URLSearchParams = new URLSearchParams(window.location.search)
        const result: Array<JSX.Element> = []
        if (paramsPath.get('patient') !== null) {
            result.push(<label className="text-filter-box"><strong>Patient : </strong>{selectedPatient?.label || paramsPath.get('patient')}</label>)
        }
        if (paramsPath.get('clinician') !== null) {
            result.push(<label className="text-filter-box"><strong>Clinician : </strong>{selectedClinician?.label || paramsPath.get('clinician')}</label>)
        }
        if (paramsPath.get('groups') !== null) {
            result.push(<label className="text-filter-box"><strong>Group : </strong>{selectedGroup?.label || paramsPath.get('groups')}</label>)
        }
        return <label id="showDetailFilter">{result}</label>
    }

    const dataRender = (list: IHistoryResponse[] | undefined): React.JSX.Element[] | undefined => {
        if (list?.length) {
            return list?.map((item: IHistoryResponse, index: number) => {
                return (
                    <tr key={index} onClick={() => onNavigate(item.id)}>
                        <td className="text-start">{item.id}</td>
                        <td className="text-start">{item.title}</td>
                        <td className="text-start desciption-td">{item.description}</td>
                        <td className="text-start">{item.patient.firstname}</td>
                        <td className="text-start">{item.patient.lastname}</td>
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
                        <td
                            className="text-center align-middle setting-row"
                            style={{ maxHeight: "60px", height: "60px" }}
                        >
                            {item.status === "SUCCESS" &&
                                <a
                                    className="btn btnMaterial btn-flat primary semicircle"
                                    role="button"
                                    href="#"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        className="bi bi-check-circle"
                                        style={{
                                            borderColor: "green",
                                            color: "green"
                                        }}
                                    >
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                        ></path>
                                        <path
                                            d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
                                        ></path>
                                    </svg>
                                </a>}
                            {item.status === "WAITING_FOR_MODEL" &&
                                <a
                                    className="btn btnMaterial btn-flat primary semicircle"
                                    role="button"
                                    href="#"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="bi bi-clock-history"
                                    style={{
                                        borderColor: "var(--bs-warning)",
                                        color: "var(--bs-warning)"
                                    }}
                                >
                                        <path
                                            d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"
                                        ></path>
                                        <path
                                            d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"
                                        ></path>
                                        <path
                                            d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"
                                        ></path></svg></a>
                            }
                            {item.status === "FAIL" &&
                                <a
                                    className="btn btnMaterial btn-flat primary semicircle"
                                    role="button"
                                    href="#"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="bi bi-x-circle"
                                    style={{
                                        borderColor: "red",
                                        color: "red"
                                    }}
                                >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                                    </svg></a>
                            }
                            <a
                                className="btn btnMaterial btn-flat accent btnNoBorders checkboxHover check-box"
                                role="button"
                                style={{ marginLeft: "5px" }}
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                                onClick={(e) => {
                                    deleteHistoryById(item)
                                    e.stopPropagation()
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="bi bi-trash3-fill btnNoBorders"
                                    style={{ color: "#DC3545" }}
                                >
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                );
            });
        } else {
            return [<h1 style={{ textAlign: "center" }}>Not Found</h1>]
        }
    };


    return (
        <>
            <LoadingModal showLoadingModal={isLoading} />
            {isShowFilter &&
                <div id="patientListFilter">
                    <HistoryListFilter
                        selectedClinicianProp={selectedClinician}
                        selectedPatientProp={selectedPatient}
                        selectedGroupProp={selectedGroup}
                        isShowFilter={isShowFilter}
                        showFilter={value => setIsShowFilter(value)}
                        sendParams={(params, patient, clinician, group) => {
                            setHistoryParams(params)
                            setSelectedPatient(patient)
                            setSelectedClinician(clinician)
                            setSelectedGroup(group)
                        }
                        }
                        filterParams={historyParams}
                    />
                </div>
            }
            <div id="historyList">
                <div className="container-fluid">
                    <div className="card" id="TableSorterCard">
                        <div className="card-header py-3 cardHeader">
                            <div className="row table-topper align-items-center option-bar">
                                <div className="pageBar">
                                    <Pagination
                                        currentPage={Number(historyParams.pageNumber ?? 1)}
                                        setCurrentPage={handlePageChange}
                                        lastPage={historyPaginate?.totalPages ?? 1}
                                        isLastPage={historyPaginate?.last}
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
                                <div className="create-history">
                                    <button className="btn btn-light btn-sm create-button" type="button" onClick={() => navigate('/history/create')}>Create new history</button>
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
                                                    History ID
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    <strong>Title</strong>
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Description
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Patient firstname
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Patient lastname
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Created at
                                                </th>
                                                <th className="text-capitalize text-start">
                                                    Updated at
                                                </th>
                                                <th className="text-capitalize text-center filter-false sorter-false">
                                                    settings
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {dataRender(historyPaginate?.entities)}
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
export default ListHistory;