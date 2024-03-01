import React, { ReactElement, useEffect, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import "./PatientList.css";
import {
  IPatientParams,
  IPatientResponse,
} from "../../../interfaces/patient/Patient";
import { useNavigate } from "react-router-dom";
import { deletePatient, getPatients } from "../../../services/api/aigaService";
import { IPageResponse } from "../../../interfaces/paginate/Page";
import { convertDate, getTime } from "../../../plugins";
import Pagination from "../../../components/paginate/paginate";
import { IApiResponse } from "../../../interfaces/ApiResponse";
import swal from 'sweetalert2'
import { HandleError } from "../../../interfaces/error/handleError";
import LoadingModal from "../../../components/loading/loading";
import PatientListFilter from "../../../components/filter/patient-list/PatientListFilter";
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface";

function PatientList(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultPaitentParams: IPatientParams = {
    pageNumber: 1,
    pageSize: 7,
    sortBy: "id",
    sortType: "desc",
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [patientParams, setPatientParams] = useState<IPatientParams>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [patientPaginate, setPatientPaginate] =
    useState<IPageResponse<IPatientResponse[]>>()
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false)
  const [selectedTag, setSelectedTag] = useState<IReactSelect | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParamsToPatientParams();
  }, []);

  useEffect(() => {
    fetchPatients(patientParams);
  }, [patientParams]);

  const onNavigate = (id?: number) => {
    if (id) {
      navigate(`/patient/${id}`);
    }
  };

  const fetchPatients = async (params: IPatientParams) => {
    setIsLoading(true)
    if (Object.keys(patientParams ?? {})?.length) {
      setPatientParamsToSearchParams(patientParams);
      try {
        const response = await getPatients(params);
        setPatientPaginate(response);
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
  };

  const setSearchParamsToPatientParams = () => {
    let params: IPatientParams = defaultPaitentParams
    if (!![...searchParams?.keys()]?.length) {
      const newParams: IPatientParams = {}
      for (const [key, value] of searchParams?.entries()) {
        newParams[key as keyof IPatientParams] = value as any
      }
      params = { ...newParams, pageNumber: 1 }
    }
    setPatientParams(params);
  };

  const setPatientParamsToSearchParams = (params: IPatientParams) => {
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
    setPatientParams({ ...patientParams, pageNumber: pageNumber });
  };

  const deletePatientById = async (patient: IPatientResponse) => {
    swal.fire({
      title: "Confirm",
      text: "Are you sure you want to Delete Patient: " + patient.firstname + " " + patient.lastname + " ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true)
          const response: IApiResponse = await deletePatient(patient.id.toString())
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

  const dataRender = (list: IPatientResponse[] | undefined): React.JSX.Element[] | undefined => {
    if (list?.length) {
      return list?.map((item: IPatientResponse, index: number) => {
        return (
          <tr key={index} onClick={() => onNavigate(item.id)}>
            <td className="text-start">{item.id}</td>
            <td className="text-start">{item.firstname}</td>
            <td className="text-start">{item.lastname}</td>
            <td className="text-start">
              <div>{item.gender ? "Male" : "Female"}</div>
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
              <a
                className="btn btnMaterial btn-flat success semicircle"
                role="button"
                onClick={(e) => {
                  navigate('/patient/' + item.id + '/edit')
                  e.stopPropagation()
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="bi bi-pencil-square"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  ></path>
                </svg>
              </a>
              <a
                className="btn btnMaterial btn-flat accent btnNoBorders checkboxHover check-box"
                role="button"
                style={{ marginLeft: "5px" }}
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={(e) => {
                  deletePatientById(item)
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
      return [<span style={{ textAlign: "center" }}>Not Found</span>]
    }
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
    if (paramsPath.get('tags') !== null) {
      result.push(<label className="text-filter-box"><strong>Tag : </strong>{selectedTag?.label || paramsPath.get('tags')}</label>)
    }
    return <label id="showDetailFilter">{result}</label>
  }

  return (
    <>
      <LoadingModal showLoadingModal={isLoading} />
      {isShowFilter &&
        <div id="patientListFilter">
          <PatientListFilter
            isShowFilter={isShowFilter}
            showFilter={value => setIsShowFilter(value)}
            sendParams={(params, tag) => {
              setPatientParams(params), setSelectedTag(tag)
            }
            }
            filterParams={patientParams}
            selectedTagProp={selectedTag}
          />
        </div>
      }
      <div id="patientList">
        <div className="container-fluid">
          <div className="card" id="TableSorterCard">
            <div className="card-header py-3 cardHeader">
              <div className="row table-topper align-items-center option-bar">
                <div className="pageBar">
                  <Pagination
                    currentPage={Number(patientParams.pageNumber ?? 1)}
                    setCurrentPage={handlePageChange}
                    lastPage={patientPaginate?.totalPages ?? 1}
                    isLastPage={patientPaginate?.last}
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
                <div className="create-patient">
                  <button className="btn btn-light btn-sm create-button" type="button" onClick={() => navigate('/patient/create')}>Create new Patient</button>
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
                          Patient ID
                        </th>
                        <th className="text-capitalize text-start">
                          <strong>Patient Firstname</strong>
                        </th>
                        <th className="text-capitalize text-start">
                          Patient Lastname
                        </th>
                        <th className="text-capitalize text-start">
                          Patient Gender
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
                      {dataRender(patientPaginate?.entities)}
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
export default PatientList;
