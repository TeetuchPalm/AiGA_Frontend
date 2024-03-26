import React, { ReactElement, useEffect, useState } from "react"
import Select from "react-select"
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface"
import { IPatientRequest } from "../../../interfaces/patient/Patient"
import './PatientCreate.css'
import { createPatient, getAllPageTag } from "../../../services/api/aigaService"
import { useNavigate } from "react-router-dom"
import { ITagParams, ITagResponse } from "../../../interfaces/patient/tag/Tag"
import { IPageResponse } from "../../../interfaces/paginate/Page"
import LoadingModal from "../../../components/loading/loading"
import ReactDatePicker from "react-datepicker"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'



function PatientCreate(): ReactElement {
    const [selectedResidualLimbLength, setSelectedResidualLimbLength] = useState<IReactSelect | null>(null)
    const [selectedResidualLimbShape, setSelectedResidualLimbShape] = useState<IReactSelect | null>(null)
    const [selectedFunctionLevel, setSelectedFunctionLevelOptions] = useState<IReactSelect | null>(null)
    const [selectedStructure, setSelectedStructure] = useState<IReactSelect | null>(null)
    const [selectedSocket, setSelectedSocket] = useState<IReactSelect | null>(null)
    const [selectedLiner, setSelectedLiner] = useState<IReactSelect | null>(null)
    const [selectedSuspension, setSelectedSuspension] = useState<IReactSelect | null>(null)
    const [selectedFoot, setSelectedFoot] = useState<IReactSelect | null>(null)
    const [rangeOfMotion, setRangeOfMotion] = useState<boolean>()
    const [muscleStrength, setMuscleStrength] = useState<boolean>()
    const [patientUnderlyingDisease, setPatientUnderlyingDisease] = useState<string>()
    const [amputatedLeg, setAmputatedLeg] = useState<string>()
    const [patientName, setPatientName] = useState<string>()
    const [patientDOB, setPatientDOB] = useState<Date>()
    const [patientSurname, setPatientSurname] = useState<string>()
    const [patientGender, setPatientGender] = useState<boolean>()
    const [patientWeight, setPatientWeight] = useState<number>()
    const [patientHeight, setPatientHeight] = useState<number>()
    const [tagOptions, setTagOptions] = useState<IReactSelect[]>([])
    const [tagQuery, setTagQuery] = useState<ITagParams>({
        pageNumber: 1,
        pageSize: 20
    })
    const [selectedTag, setSelectedTag] = useState<IReactSelect | null>({
        label: 'default',
        value: '1'
    })
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigate = useNavigate();

    useEffect(() => {
        if (isSearch) {
            fetchTag()
            setIsSearch(false)
        }
    }, [tagOptions])

    useEffect(() => {
        fetchTag()
    }, [])

    const residualLimbLengthOption: Array<IReactSelect> = [
        { label: 'Long Stump Length', value: '2' },
        { label: 'Medium Stump Length', value: '1' },
        { label: 'Short Stump Length', value: '0' }
    ]

    const residualLimbShapeOption: Array<IReactSelect> = [
        { label: 'Conical Shape', value: 'Conical shape' },
        { label: 'Cylindrical Shape', value: 'Cylindrical shape' },
        { label: 'Bulbous Shape', value: 'Bulbous shape' }
    ]

    const functionLevelOptions: Array<IReactSelect> = [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
    ]

    const structure: Array<IReactSelect> = [
        { label: 'Exoskeletal', value: 'EXOSKELETAL' },
        { label: 'Endoskeletal', value: 'ENDOSKELETAL' },
        { label: 'Other Structure', value: 'OTHER' }
    ]

    const socket: Array<IReactSelect> = [
        { label: 'PTB', value: 'PTB' },
        { label: 'PTB-SC', value: 'PTB-SC' },
        { label: 'PTB-SCSP', value: 'PTB-SCSP' },
        { label: 'TSB', value: 'TSB' },
        { label: 'TSB-SC', value: 'TSB-SC' },
        { label: 'TSB-SCSP', value: 'TSB-SCSP' },
        { label: 'Other Socket', value: 'OTHER' }
    ]

    const liner: Array<IReactSelect> = [
        { label: 'Pe-lite Liner', value: 'PE-LITE' },
        { label: 'EVA Liner', value: 'EVA' },
        { label: 'Silicone Liner', value: 'SILICONE' },
        { label: 'Gel Liner', value: 'GEL' },
        { label: 'Polyrethane Liner', value: 'POLYURETHANE' },
        { label: 'TPE Liner', value: 'TPE' },
        { label: 'Other Liner', value: 'OTHER' }
    ]

    const suspension: Array<IReactSelect> = [
        { label: 'Self-Suspension', value: 'SELF-SUSPENSION' },
        { label: 'Supracondylar cuff strap', value: 'SUPRACONDYLAR-CUFF-STRAP' },
        { label: 'Waist belt with fork strap', value: 'WAIST-BELT-WITH-FORK-STARP' },
        { label: 'Thigh corset', value: 'THIGH-CORSET' },
        { label: 'Locking-liner', value: 'LOCKING-LINER' },
        { label: 'Sleeve', value: 'SLEEVE' },
        { label: 'Suction', value: 'SUCTION' },
        { label: 'Other Suspension', value: 'OTHER' }
    ]

    const foot: Array<IReactSelect> = [
        { label: 'SACH foot', value: 'SACH' },
        { label: 'Single axis foot', value: 'SINGLE-AXIS' },
        { label: 'Multiaxial foot', value: 'MULTIAXIAL' },
        { label: 'Flexible keel foot', value: 'FLEXIBLE-KEEL' },
        { label: 'Dynamic-response foot', value: 'DYNAMIC-RESPONSE' },
        { label: 'Other Foot', value: 'OTHER' }
    ]

    const formatOptionLabel = (option: IReactSelect): React.JSX.Element => {
        return (
            <div>
                {option.label}
            </div>
        )
    }

    const mapStateToCreatePatientRequest = (): IPatientRequest => {
        dayjs.extend(utc)
        dayjs.extend(tz)
        const request: IPatientRequest = {
            firstname: patientName!!,
            lastname: patientSurname!!,
            gender: patientGender!!,
            dob: new Date(dayjs(patientDOB!!).tz('UTC', true).toDate()),
            weight: patientWeight!!,
            height: patientHeight!!,
            amputatedLeg: amputatedLeg!!,
            residualLimbLength: Number(selectedResidualLimbLength?.value!!),
            residualLimbShape: selectedResidualLimbShape?.value!!,
            functionalLevel: Number(selectedFunctionLevel?.value!!),
            underlyingDisease: patientUnderlyingDisease,
            rangeOfMotion: rangeOfMotion!!,
            muscleStrength: muscleStrength!!,
            prosthesisStructure: selectedStructure?.value!!,
            prosthesisSocket: selectedSocket?.value!!,
            prosthesisLinear: selectedLiner?.value!!,
            prosthesisSuspension: selectedSuspension?.value!!,
            prosthesisFoot: selectedFoot?.value!!,
            tagIds: [Number(selectedTag?.value!!)]
        }
        return request
    }

    const validateSubmitButton = (): boolean => {
        return !!!patientName || !!!patientSurname || patientGender === null || patientGender === undefined || !!!patientDOB || !!!patientWeight
            || !!!patientHeight || !!!amputatedLeg || !!!selectedResidualLimbLength || !!!selectedResidualLimbShape || !!!selectedFunctionLevel
            || rangeOfMotion === null || rangeOfMotion === undefined || muscleStrength === null || muscleStrength === undefined || !!!selectedStructure || !!!selectedStructure
            || !!!selectedSocket || !!!selectedLiner || !!!selectedSuspension || !!!selectedFoot || !!!selectedTag
    }

    const validateInputNumberOnly = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault()
        }
    }

    const createPatientHandle = async () => {
        const request = mapStateToCreatePatientRequest()
        try {
            setIsLoading(true)
            await createPatient(request)
            navigate('/patient')
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }

    const fetchTag = async () => {
        const response: IPageResponse<ITagResponse[]> = await getAllPageTag(tagQuery)
        setTagOptions(tagOptions.concat(response.entities.map(tag => (
            {
                label: tag.name, value: tag.id.toString()
            }))))
    }

    const calculateAge = (dob: Date | undefined): string => {
        if (dob) {
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            return age.toString()
        } else {
            return ""
        }
    }


    return (
        <div id="createPatient">
            <LoadingModal showLoadingModal={isLoading} />
            <div className="container-fluid">
                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-dark mb-0">Patient Demographic Data</h3>
                </div>
                <div className="form-data">
                    <div className="card shadow mb-3">
                        <div className="card-header py-3">
                            <p className="m-0 fw-bold">Fill In The Required Fields <span>*</span></p>
                        </div>
                        <div className="card-body">
                            <div className="part-header">
                                <p className="m-0 fw-bold lable-header">Part: 1 General Information</p>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Name <span>*</span></strong></label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Name"
                                            value={patientName}
                                            onChange={e => {
                                                setPatientName(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Surname <span>*</span></strong></label>
                                        <input
                                            type="text"
                                            name="surname"
                                            className="form-control"
                                            placeholder="Surname"
                                            value={patientSurname}
                                            onChange={e => {
                                                setPatientSurname(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Gender <span>*</span></strong></label>
                                        <div className="form-group mb-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-1" name="genderOption" onChange={() => { setPatientGender(true) }} />
                                                <label className="form-check-label">Male</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-2" name="genderOption" onChange={() => { setPatientGender(false) }} />
                                                <label className="form-check-label">Female</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Tag <span>*</span></strong></label>
                                        <Select
                                            inputId="tag"
                                            isSearchable={true}
                                            filterOption={() => true}
                                            options={tagOptions}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedTag(value)
                                            }}
                                            onMenuScrollToBottom={() => {
                                                setTagQuery(tagQuery => ({ ...tagQuery, pageNumber: tagQuery.pageNumber!! + 1 }))
                                                if (tagOptions.length === tagQuery.pageSize!! * (tagQuery.pageNumber!! - 1)) {
                                                    fetchTag()
                                                }
                                            }}
                                            onInputChange={(value) => {
                                                if (value.length >= 3 || value.length <= 0) {
                                                    setIsSearch(true)
                                                    setTagOptions([])
                                                    setTagQuery(tagQuery => ({ ...tagQuery, name: value, pageNumber: 1 }))
                                                }
                                            }}
                                            value={selectedTag}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3 date-picker"><label className="form-label"><strong>Date of Birth <span>*</span></strong></label>
                                        {/* <input
                                            className="form-control"
                                            type="date"
                                            name="DOB"
                                            placeholder="dd-mm-yyyy"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => (e.target.type = "text")}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => { setPatientDOB(new Date(e.target.value)) }} /> */}
                                        <ReactDatePicker
                                            className="form-control"
                                            selected={patientDOB}
                                            onChange={(date) => setPatientDOB(date || undefined)}
                                            placeholderText="dd/MM/yyyy"
                                            dateFormat={'dd/MM/yyyy'}
                                            showYearDropdown
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                            fixedHeight />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Age (years) <span>*</span></strong></label>
                                        <input
                                            type="text"
                                            name="age"
                                            disabled={true}
                                            className="form-control"
                                            placeholder="Age"
                                            value={calculateAge(patientDOB)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Weight (kg) <span>*</span></strong></label>
                                        <input
                                            type="text"
                                            name="weight"
                                            className="form-control"
                                            placeholder="Weight"
                                            value={patientWeight}
                                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => validateInputNumberOnly(event)}
                                            onChange={e => {
                                                setPatientWeight(Number(e.target.value) || undefined)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Height (cm) <span>*</span></strong></label>
                                        <input
                                            type="text"
                                            name="height"
                                            className="form-control"
                                            placeholder="Height"
                                            value={patientHeight}
                                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => validateInputNumberOnly(event)}
                                            onChange={e => {
                                                setPatientHeight(Number(e.target.value) || undefined)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div className="part-header">
                                <p className="m-0 fw-bold label-header">Part: 2 Medical Information</p>
                            </div>
                            <div className="mb-3"><label className="form-label"><strong>Amputated Leg <span>*</span></strong></label>
                                <div className="form-group mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" id="id_service_payment_validated-3" name="amputatedLegOption" value="LEFT" onChange={(e) => setAmputatedLeg(e.target.value)} />
                                        <label className="form-check-label">Left</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" id="id_service_payment_validated-4" name="amputatedLegOption" value="RIGHT" onChange={(e) => setAmputatedLeg(e.target.value)} />
                                        <label className="form-check-label">Right</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" id="id_service_payment_validated-4" name="amputatedLegOption" value="BOTH" onChange={(e) => setAmputatedLeg(e.target.value)} />
                                        <label className="form-check-label">Both</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Residual Limb Length&nbsp;<span>*</span></strong></label>
                                        <Select
                                            inputId="residualLimbLength"
                                            isSearchable={true}
                                            options={residualLimbLengthOption}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedResidualLimbLength(value)
                                            }}
                                            value={selectedResidualLimbLength}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Residual Limb Shape&nbsp;<span>*</span></strong></label>
                                        <Select
                                            inputId="residualLimbShape"
                                            isSearchable={true}
                                            options={residualLimbShapeOption}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedResidualLimbShape(value)
                                            }}
                                            value={selectedResidualLimbShape}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Functional Level <span>*</span></strong></label>
                                        <Select
                                            inputId="residualLimbShape"
                                            isSearchable={true}
                                            options={functionLevelOptions}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedFunctionLevelOptions(value)
                                            }}
                                            value={selectedFunctionLevel}
                                        />
                                    </div>
                                </div>
                                <div className="col"><label className="form-label"><strong>Underlying Disease (Optional)</strong></label>
                                    <input
                                        type="text"
                                        name="underlyingDisease"
                                        className="form-control"
                                        placeholder="underlying disease"
                                        value={patientUnderlyingDisease}
                                        onChange={e => {
                                            setPatientUnderlyingDisease(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Lower Limb Range of Motion is normally<span>*</span></strong></label>
                                        <div className="form-group mb-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-3" name="rangeOfMotionOption" onChange={() => { setRangeOfMotion(true) }} />
                                                <label className="form-check-label">Yes</label></div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-4" name="rangeOfMotionOption" onChange={() => { setRangeOfMotion(false) }} />
                                                <label className="form-check-label">No</label></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-8 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Lower Limb Muscle Strength level is between 4-5 (ฺBased on Oxford scale) <span>*</span></strong></label>
                                        <div className="form-group mb-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-3" name="muscleStrengthOption" onChange={() => { setMuscleStrength(true) }} />
                                                <label className="form-check-label">Yes</label></div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" id="id_service_payment_validated-4" name="muscleStrengthOption" onChange={() => { setMuscleStrength(false) }} />
                                                <label className="form-check-label">No</label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginBottom: "32px" }} />
                            <div className="part-header">
                                <p className="m-0 fw-bold lable-header">Part: 3 Prosthetic Information</p>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="mb-3"><label className="form-label"><strong>Structure <span>*</span></strong></label>
                                        <Select
                                            inputId="structure"
                                            isSearchable={true}
                                            options={structure}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedStructure(value)
                                            }}
                                            value={selectedStructure}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="mb-3"><label className="form-label"><strong>Socket <span>*</span></strong></label>
                                        <Select
                                            inputId="socket"
                                            isSearchable={true}
                                            options={socket}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedSocket(value)
                                            }}
                                            value={selectedSocket}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="mb-3"><label className="form-label"><strong>Liner <span>*</span></strong></label>
                                        <Select
                                            inputId="linear"
                                            isSearchable={true}
                                            options={liner}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedLiner(value)
                                            }}
                                            value={selectedLiner}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="mb-3"><label className="form-label"><strong>Suspension <span>*</span></strong></label>
                                        <Select
                                            inputId="suspension"
                                            isSearchable={true}
                                            options={suspension}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedSuspension(value)
                                            }}
                                            value={selectedSuspension}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="mb-3"><label className="form-label"><strong>Foot <span>*</span></strong></label>
                                        <Select
                                            inputId="foot"
                                            isSearchable={true}
                                            options={foot}
                                            formatOptionLabel={formatOptionLabel}
                                            onChange={(value: IReactSelect | null) => {
                                                setSelectedFoot(value)
                                            }}
                                            value={selectedFoot}
                                        /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end d-xxl-flex justify-content-xxl-center mb-3 button-area">
                        <button className="btn btn-primary btn-lg submit-button" disabled={validateSubmitButton()} onClick={() => { createPatientHandle() }}>Save</button>
                        <button className="btn btn-danger btn-lg cancel-button" role="button" onClick={() => { navigate(`/patient`) }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default PatientCreate