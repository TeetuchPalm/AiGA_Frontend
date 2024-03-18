import React, { ReactElement, useState, useEffect, useRef } from "react"
import { createHistory, getAllPageGroup, getPatientById, uploadToS3 } from "../../../services/api/aigaService"
import './createHistoryPatient.scss'
import { ICreateHistoryRequest } from "../../../interfaces/history/History"
import { IPatientResponse } from "../../../interfaces/patient/Patient"
import PatientDropdownComponent from "../../../components/patient/patientDropdownComponet"
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface"
import { ITagResponse } from "../../../interfaces/patient/tag/Tag"
import { useNavigate, useParams } from "react-router-dom"
import { createModelData } from "../../../services/api/aigaModelService/aigaModelService"
import LoadingModal from "../../../components/loading/loading"
import dayjs from "dayjs"
import { RecordWebcamOptions, useRecordWebcam } from "react-record-webcam"
import { IPageResponse } from "../../../interfaces/paginate/Page"
import { IGroupParams, IGroupResponse } from "../../../interfaces/history/group/Group"
import Select from "react-select"

function CreateHistoryPatient(): ReactElement {
    const options: RecordWebcamOptions =
    {
        filename: dayjs().unix().toString() + ".webm",
        fileType: 'webm',
        codec: {
            audio: 'aac',
            video: 'vp8'
        },
        width: 640,
        height: 480
    }

    const recordWebcam = useRecordWebcam(options)
    const { id } = useParams()

    const [selectedPatient, setSelectedPatient] = useState<IReactSelect | null>(null)
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [patientInfo, setPatientInfo] = useState<IPatientResponse>()
    const [IsLoading, setisLoading] = useState<boolean>(false)
    const [groupOptions, setGroupOptions] = useState<IReactSelect[]>([])
    const [groupQuery, setGroupQuery] = useState<IGroupParams>({
        pageNumber: 1,
        pageSize: 20
    })
    const [selectedGroup, setSelectedGroup] = useState<IReactSelect | null>({
        label: 'default',
        value: '1'
      })
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [isUpload, setIsUpload] = useState<boolean>(false)
    const [videoSource, setVideoSource] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedPatient) {
            getPatientInfo()
        }
    }, [selectedPatient])

    useEffect(() => {
        if (selectedPatient === null) {
            if (id) {
                getPatientInfoById(id)
            }
        }
        fetchGroup()
        return () => {
            recordWebcam.close
        }
    }, [])

    useEffect(() => {
        if (isSearch) {
            fetchGroup()
            setIsSearch(false)
        }
    }, [groupOptions])

    const getPatientInfo = async () => {
        const response: IPatientResponse = await getPatientById(selectedPatient?.value!!)
        setPatientInfo(response)
    }

    const getPatientInfoById = async (patientId: string) => {
        try {
            const response: IPatientResponse = await getPatientById(patientId)
            setSelectedPatient({ label: response.firstname + " " + response.lastname, value: response.id.toString() })
            setPatientInfo(response)
        } catch (e) {
            navigate('/history')
        }
    }

    const fetchGroup = async () => {
        const response: IPageResponse<IGroupResponse[]> = await getAllPageGroup(groupQuery)
        setGroupOptions(groupOptions.concat(response.entities.map(tag => (
            {
                label: tag.name, value: tag.id.toString()
            }))))
    }

    const handleOnClickSaveButton = async () => {
        try {
            setisLoading(true)
            const request = mapStateToRequest()
            const videoBlob: any = await recordWebcam.getRecording()
            const file: File = isUpload ? new File([videoSource!!], dayjs().unix().toString() + '.' + videoSource?.type.split('/')[1], { lastModified: new Date().getTime(), type: videoSource?.type })
                : new File([videoBlob as Blob], dayjs().unix().toString() + ".webm", { lastModified: new Date().getTime(), type: "video/webm" })
            const response = await createHistory(request)
            const uploadResponse = await uploadToS3(file, response.id)
            await createModelData({ history_id: uploadResponse.id.toString(), video_url: uploadResponse.video })
            setisLoading(false)
            navigate('/history')
        } catch (e) {
            setisLoading(false)
        }
    }

    const validateSaveButton = () => {
        return !!!title || !!!selectedPatient || (recordWebcam.status !== 'PREVIEW' && !isUpload) || !!!selectedGroup || (!!!videoSource && isUpload)
    }

    const mapStateToRequest = () => {
        const historyRequest: ICreateHistoryRequest = {
            title: title!!,
            description: description,
            patientId: Number(selectedPatient?.value),
            groupIds: [Number(selectedGroup?.value) || 0]
        }
        return historyRequest
    }

    const maleOrFemale = (bool: boolean): string => {
        if (bool) {
            return 'Male'
        } else {
            return 'Female'
        }
    }

    const formatOptionLabel = (option: IReactSelect): React.JSX.Element => {
        return (
            <div>
                {option.label}
            </div>
        )
    }

    const rederGroupList = (tagList: ITagResponse[]): React.JSX.Element[] => {
        return tagList.map((tag: ITagResponse, index: number) => {
            return (
                <span key={index} style={{ fontFamily: 'Noto Sans Thai, sans-serif', marginRight: "16px" }}>{tag.name}</span>
            )
        })
    }

    const renderPatientInformation = (): React.JSX.Element | undefined => {
        if (patientInfo) {
            return (
                <div>
                    <div className="row">
                        <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    style={{ marginRight: "16px" }}
                                ><strong>Patient Name</strong>
                                </label>
                                <span style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}
                                >{patientInfo.firstname} {patientInfo.lastname}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 col-lg-4 col-xxl-6">
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    style={{ marginRight: "16px" }}
                                ><strong>Patient ID</strong></label>
                                <span style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}
                                >{patientInfo.id}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                            <div className="mb-3">
                                <label className="form-label" style={{ marginRight: "16px" }}>
                                    <strong>Gender</strong>
                                </label>
                                <span style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}
                                >{maleOrFemale(patientInfo.gender)}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                            <div className="mb-3">
                                <label className="form-label" style={{ marginRight: "16px" }}>
                                    <strong>Tags</strong>
                                </label>
                                {rederGroupList(patientInfo.tags)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return undefined
        }
    }

    const renderRecordVideo = (): React.JSX.Element => {
        return (
            <>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h3 className="text-dark mb-0" style={{ marginTop: "24px", fontWeight: "bold", textAlign: "center" }}>Camera 1 : Front View
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex justify-content-center video-area">
                            {(recordWebcam.status === 'CLOSED' || recordWebcam.status === 'INIT') && <div className="temp-video-image">
                                <img width={480} height={360} src="/src/assets/img/AiGalogoblack.svg" />
                            </div>}
                            <video
                                ref={recordWebcam.previewRef}
                                style={{
                                    display: `${recordWebcam.status === "PREVIEW" ? "block" : "none"}`
                                }}
                                width="640"
                                height="480"
                                autoPlay
                                controls
                                loop
                            />
                            <video
                                ref={recordWebcam.webcamRef}
                                style={{
                                    display: `${recordWebcam.status === "OPEN" ||
                                        recordWebcam.status === "RECORDING"
                                        ? "block"
                                        : "none"
                                        }`
                                }}
                                width="640"
                                height="480"
                                autoPlay
                                muted
                            />
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-xxl-12 status-area">
                            <p className="status-text" >Camera : 1<br />Status : {recordWebcam.status}</p>
                        </div>
                    </div>
                    <div className="row" style={{ marginBottom: "8px" }}>
                        <div className="col d-xxl-flex justify-content-xxl-center" style={{ marginBottom: "-1px" }}>
                            <h6>Camera Mode:</h6>
                        </div>
                        <div className="col d-xxl-flex justify-content-xxl-center" style={{ marginBottom: "-1px" }}>
                            <h6>Record Mode:</h6>
                        </div>
                        <div className="col d-xxl-flex justify-content-xxl-center" style={{ marginBottom: "-1px" }}>
                            <h6>File Management Mode:</h6>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "6px", marginBottom: "50px" }}>
                        <div className="col d-xxl-flex justify-content-xxl-center" >
                            <button
                                className="btn btn-success"
                                type="button"
                                style={{ marginRight: "16px" }}
                                onClick={recordWebcam.open}
                                disabled={
                                    recordWebcam.status === "OPEN" ||
                                    recordWebcam.status === "RECORDING" ||
                                    recordWebcam.status === "PREVIEW"
                                }> Open</button>
                            <button
                                className="btn btn-light"
                                type="button"
                                onClick={recordWebcam.close}
                                disabled={
                                    recordWebcam.status === "CLOSED" ||
                                    recordWebcam.status === "INIT"
                                }>Close</button>
                        </div>
                        <div className="col d-xxl-flex justify-content-xxl-center" >
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={{ marginRight: "16px" }}
                                onClick={recordWebcam.start}
                                disabled={
                                    recordWebcam.status === "CLOSED" ||
                                    recordWebcam.status === "RECORDING" ||
                                    recordWebcam.status === "PREVIEW" ||
                                    recordWebcam.status === "INIT"
                                }>Start</button>
                            <button
                                className="btn btn-light"
                                type="button"
                                style={{ marginRight: "16px" }}
                                onClick={recordWebcam.stop}
                                disabled={
                                    recordWebcam.status !== "RECORDING"
                                }>Stop</button>
                            <button
                                className="btn btn-light"
                                type="button"
                                onClick={recordWebcam.retake}
                                disabled={
                                    recordWebcam.status !== "PREVIEW"
                                }
                            >Retake</button>
                        </div>
                        <div className="col d-xxl-flex justify-content-xxl-center" >
                            <button
                                className="btn btn-primary submit-button"
                                type="button"
                                style={{ marginRight: "16px" }}
                                onClick={() => handleOnClickSaveButton()}
                                disabled={validateSaveButton()}
                            >Save</button>
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => {
                                    recordWebcam.close()
                                    navigate('/history')
                                }}
                            >Cancel</button></div>
                    </div>
                </div>
            </>
        )
    }

    const renderUploadVideo = (): React.JSX.Element => {
        return (
            <>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h3 className="text-dark mb-0" style={{ marginTop: "24px", fontWeight: "bold", textAlign: "center" }}>Upload Video
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex justify-content-center video-area">
                            {!videoSource && <div className="temp-video-image">
                                <img width={480} height={360} src="/src/assets/img/AiGalogoblack.svg" />
                            </div>}
                            {videoSource &&
                                <video
                                    src={URL.createObjectURL(videoSource!!)}
                                    style={{
                                        display: `${videoSource ? "block" : "none"}`
                                    }}
                                    width="640"
                                    height="480"
                                    autoPlay
                                    controls
                                    loop
                                />}
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-xxl-12 status-area">
                            <p className="status-text" >Insert your video file</p>
                            <input
                                ref={inputRef}
                                style={{ display: 'none' }}
                                onChange={(e) => setVideoSource(e.target.files ? e.target.files[0] : null)}
                                type="file"
                                accept="video/*"
                            />
                            <button className="btn btn-primary" style={{ border: '1px', borderColor: 'black' }} onClick={() => inputRef.current?.click()}>Choose File</button>
                            <div>{videoSource?.name || "No selected file"}</div>
                        </div>
                        <div className="col d-xxl-flex justify-content-xxl-center" style={{ marginTop: '10px', marginBottom: '50px' }}>
                            <button
                                className="btn btn-primary submit-button"
                                type="button"
                                style={{ marginRight: "16px" }}
                                onClick={() => handleOnClickSaveButton()}
                                disabled={validateSaveButton()}
                            >Save</button>
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => {
                                    recordWebcam.close()
                                    navigate('/history')
                                }}
                            >Cancel</button></div>
                    </div>
                </div>
            </>
        )
    }
    const handleChangeIsUpload = (e: React.MouseEvent, upload: boolean) => {
        e.preventDefault()
        setIsUpload(upload)
    }


    return (
        <>
            <div id="createHistoryPatient">
                <LoadingModal showLoadingModal={IsLoading} />
                <div className="container-fluid" style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}>
                    <div className="d-sm-flex justify-content-between align-items-center mb-4">
                        <h3 className="text-dark mb-0" style={{ marginTop: "24px", fontWeight: "bold" }}>Create History</h3>
                    </div>
                    <form>
                        <div className="card shadow mb-3">
                            <div className="card-header py-3">
                                <p className="text-primary m-0 fw-bold">Fill in the fields</p>
                            </div>
                            <div className="card-body" style={{ marginBottom: "40px" }}>
                                <div className="row">
                                    <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                        <div className="mb-3">
                                            <PatientDropdownComponent selectedPatientProp={selectedPatient} sendSelectedPatient={selectedPatient => setSelectedPatient(selectedPatient)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                        <div className="mb-3"><label className="form-label"><strong>Add History
                                            Name<span>*</span></strong></label><input className="form-control" name="title" type="text" placeholder="tile" onChange={(e) => setTitle(e.target.value)} /></div>
                                    </div>
                                    <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                        <div className="mb-3 description-box">
                                            <div className="description-header">
                                                <label className="form-label"><strong>Add History Description</strong></label>
                                                <p className="max-character">maximum character is 255</p>
                                            </div>
                                            <textarea className="form-control input-description" maxLength={255} name="description" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                        <div className="mb-3"><label className="form-label"><strong>Add Group</strong></label>
                                            <Select
                                                inputId="group"
                                                isSearchable={true}
                                                filterOption={() => true}
                                                options={groupOptions}
                                                formatOptionLabel={formatOptionLabel}
                                                onChange={(value: IReactSelect | null) => {
                                                    setSelectedGroup(value)
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
                                            /></div>
                                        <div className="mb-3 upload-toggle">
                                            <label className="form-label"><strong>Select your video source</strong></label>
                                            <div>
                                                <button className="btn btn-light button-is-upload" onClick={(e) => { handleChangeIsUpload(e, false) }}>Camera</button>
                                                <button className="btn btn-light button-is-upload" onClick={(e) => { handleChangeIsUpload(e, true) }}>Upload</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="mb-3">
                                    <label className="form-label">
                                        <strong>Patient Information:</strong>
                                    </label>
                                </div>
                                {renderPatientInformation()}
                            </div>
                        </div>
                        <div className="text-end mb-3"></div>
                    </form>
                </div>
                {isUpload ? renderUploadVideo() : renderRecordVideo()}
            </div >
        </>
    )
}
export default CreateHistoryPatient