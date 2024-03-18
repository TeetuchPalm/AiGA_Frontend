import { ReactElement, useEffect, useState } from "react";
import { IPatientResponse } from "../../../interfaces/patient/Patient";
import { getPatientById } from "../../../services/api/aigaService";
import swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom";
import { HandleError } from "../../../interfaces/error/handleError";
import LoadingModal from "../../../components/loading/loading";
import './PatientDetail.css'

function PatientDetail(): ReactElement {
    const { id } = useParams()
    const [patient, setPatient] = useState<IPatientResponse>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            getPatientData(id)
        }
    }, [])

    const getPatientData = async (id: string) => {
        try {
            setIsLoading(true)
            const response = await getPatientById(id)
            setPatient(response)
            setIsLoading(false)
        } catch (e) {
            navigate('/patient')
            setIsLoading(false)
        }

    }

    const calculateAge = (dobString: string | undefined): string => {
        if (dobString) {
            const dob = new Date(dobString)
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            return age.toString()
        } else {
            return ""
        }
    }

    return (
        <div id="patientDetail">
            <LoadingModal showLoadingModal={isLoading} />
            <div className="container-fluid patient-detail">
                <div className="d-sm-flex justify-content-between align-items-center mb-4"></div>
                <form>
                    <div className="card shadow mb-3">
                        <div className="card-header py-3">
                            <div className="patient-header">
                                <div className="patient-label">
                                    <h3 className="text-dark mb-0">Patient Imformation</h3>
                                </div>
                                <div className="button">
                                    <button className="btn btn-secondary btn-sm d-xxl-flex" type="submit" style={{ marginRight: "8px" }} onClick={() => navigate("/patient/" + id + "/edit")}>Edit</button>
                                    <button className="btn btn-primary btn-sm d-xxl-flex" type="submit" style={{ width: "max-content" }} onClick={() => navigate("/history/create/patient/" + id)}>Create History</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body patient-part1">
                            <div style={{ marginBottom: "16px" }}>
                                <p className="m-0 fw-bold">Part: 1 General Information</p>
                                <hr style={{ marginBottom: "32px" }} />
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Personal Code:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.id || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Name:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.firstname || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Surname:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.lastname || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Gender:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{(patient?.gender ? "Male" : "Female") || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Date of Birth:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.dob || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Age (years):</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{calculateAge(patient?.dob)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Weight (kg):</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.weight || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Height (cm):</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.height || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div style={{ marginBottom: "16px" }}>
                                <p className="m-0 fw-bold">Part: 2 Medical Information</p>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Amputated leg:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.amputatedLeg || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Residual limb length:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.residualLimbLength === 0 ? "Short stump length" :
                                            patient?.residualLimbLength === 1 ? "Medium stump length" : "Long stump length" || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Residual limb shape:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.residualLimbShape || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Functional level:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.functionalLevel || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Underlying disease:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.underlyingDisease || "-"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Range of motion:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.rangeOfMotion ? "Yes" : "No" || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Muscle strength:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.muscleStrength ? "Yes" : "No" || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div style={{ marginBottom: "16px" }}>
                                <p className="m-0 fw-bold">Part: 3 Prosthetic Information</p>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Structure:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.prosthesisStructure || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Socket:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.prosthesisSocket || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Liner:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.prosthesisLinear || ""}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Suspension:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.prosthesisSuspension || ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-2">
                                    <div className="mb-3"><label className="form-label"><strong>Foot:</strong></label></div>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-8 col-xl-6 col-xxl-4">
                                    <div className="mb-3">
                                        <p>{patient?.prosthesisFoot || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default PatientDetail