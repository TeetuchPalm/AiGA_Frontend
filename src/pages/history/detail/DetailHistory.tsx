import { ReactElement, useEffect, useState } from "react";
import "./DetailHistory.css"
import { IHistoryResponse } from "../../../interfaces/history/History";
import { HandleError } from "../../../interfaces/error/handleError";
import swal from "sweetalert2";
import { getHistoryById } from "../../../services/api/aigaService";
import { useNavigate, useParams } from "react-router-dom";
import { convertDate, getTime } from "../../../plugins";
import LoadingModal from "../../../components/loading/loading";

function DetailHistory(): ReactElement {
    const [history, setHistory] = useState<IHistoryResponse>()
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (id) {
            fetchHistory(id)
        }
    }, [])


    const fetchHistory = async (id: string) => {
        try {
            setIsLoading(true)
            const response: IHistoryResponse = await getHistoryById(id)
            setHistory(response)
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
            navigate('/history')
        }
    }

    return (
        <div id="detailHistory">
            <LoadingModal showLoadingModal={isLoading}/>
            <div className="container-fluid history-detail">
                <div className="button-area">
                    <button className="btn btn-secondary button-page" type="button" onClick={() => navigate("/history")}>Back</button>
                    {history?.status === 'SUCCESS' && <button className="btn btn-primary button-page" type="button" onClick={() => navigate("/history/" + id + "/analytics/clinician")}>Clinician Results Analysis</button> }
                    {history?.status === 'SUCCESS' && <button className="btn btn-primary button-page" type="button" onClick={() => navigate("/history/" + id + "/analytics/researcher")}>Researcher Results Analysis</button>}
                </div>
                <form>
                    <div className="card shadow mb-3 detail-box">
                        <div className="card-header py-3">
                            <div className="row">
                                <div className="col-10 col-sm-8 col-md-8 col-lg-8 col-xxl-7 d-xxl-flex">
                                    <h3 className="text-dark mb-0" style={{ marginTop: "-2px" }}>History Details</h3>
                                </div>
                                <div className="col-1 col-sm-2 col-md-3 col-lg-3 col-xl-3 col-xxl-4 d-xxl-flex">
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row history-name">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-3">
                                    <div className="mb-3"><label className="form-label"><strong>History Name:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-6">
                                    <div className="mb-3">
                                        <p>{history?.title || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row history-description">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-3">
                                    <div className="mb-3"><label className="form-label"><strong>Description:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-9">
                                    <div className="mb-3">
                                        <p>{history?.description || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row history-created-by">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-3">
                                    <div className="mb-3"><label className="form-label"><strong>Created by:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-6">
                                    <div className="mb-3">
                                        <p>{history?.createdBy.firstname + " " + history?.createdBy.lastname || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row history-created-at">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-3">
                                    <div className="mb-3"><label className="form-label"><strong>Date Created:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-6">
                                    <div className="mb-3">
                                        <p>{convertDate(history?.createdAt) + " " + getTime(history?.createdAt) || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row history-status">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-3">
                                    <div className="mb-3"><label className="form-label"><strong>Status:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-6">
                                    <div className="mb-3">
                                        <p>{history?.status || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="container-fluid patient-detail">
                <div className="d-sm-flex justify-content-between align-items-center mb-4"></div>
                <form>
                    <div className="card shadow mb-3 patient-detail-box">
                        <div className="card-header py-3">
                            <div className="row">
                                <div className="col-10 col-sm-8 col-md-8 col-lg-8 col-xxl-7 d-xxl-flex">
                                    <h3 className="text-dark mb-0" style={{ marginTop: "-2px" }}>Patient Imformation</h3>
                                </div>
                                <div className="col-1 col-sm-2 col-md-3 col-lg-3 col-xl-3 col-xxl-4 d-xxl-flex">
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row patient-name">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Name:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-7 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{history?.patient.firstname || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Surname:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-7 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{history?.patient.lastname || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row patient-gender-age">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Gender:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-7 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{history?.patient.gender ? "Male" : "Female" || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Age (years):</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-7 col-xxl-4">
                                    <div className="mb-3">
                                        <p>18</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row patient-tag">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-5 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Tags:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-7 col-xxl-10">
                                    <div className="mb-3">
                                        <p>{history?.patient.tags[0].name || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary" type="button" onClick={() => navigate("/patient/" + history?.patient.id || "")}>More Info...</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="container-fluid video-screen">
                <div className="d-sm-flex justify-content-between align-items-center mb-4"></div>
                <form>
                    <div className="card shadow mb-3">
                        <div className="card-header py-3">
                            <div className="row">
                                <div className="col-10 col-sm-8 col-md-8 col-lg-8 col-xxl-7 d-xxl-flex">
                                    <h3 className="text-dark mb-0" style={{ marginTop: "-2px" }}>Video</h3>
                                </div>
                                <div className="col-1 col-sm-2 col-md-3 col-lg-3 col-xl-3 col-xxl-4 d-xxl-flex">
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body video-screen-box">
                            <video src={history?.video} width={700} height={500} controls loop />
                            {/* history?.video */}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DetailHistory