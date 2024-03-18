import React, { ReactElement, useEffect, useState } from "react"
import Select from "react-select"
import { IReactSelect } from "../../interfaces/general-component/reactSelectInterface"
import { IPatientParams, IPatientResponse } from "../../interfaces/patient/Patient"
import { getPatients } from "../../services/api/aigaService"
import { IPageResponse } from "../../interfaces/paginate/Page"
import { HandleError } from "../../interfaces/error/handleError"
import swal from "sweetalert2"

interface IProps {
    sendSelectedPatient: (params: IReactSelect | null) => void
    selectedPatientProp: IReactSelect | null
}

function PatientDropdownComponent({ sendSelectedPatient, selectedPatientProp }: IProps): ReactElement {
    const [patientOption, setPatientOption] = useState<IReactSelect[]>([])
    const [patientQuery, setPatientQuery] = useState<IPatientParams>({
        pageNumber: 1,
        pageSize: 20
    })
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [selectedPatient, setSelectedPatient] = useState<IReactSelect | null>(selectedPatientProp)

    useEffect(() => {
        getAllPatient()
    }, [])

    useEffect(() => {
        setSelectedPatient(selectedPatientProp)
    }, [selectedPatientProp])

    useEffect(() => {
        if (isSearch) {
            getAllPatient()
            setIsSearch(false)
        }
    }, [patientOption])



    const getAllPatient = async () => {
        const response: IPageResponse<IPatientResponse[]> = await getPatients(patientQuery)
        setPatientOption(patientOption.concat(response.entities.map(patient => (
            {
                label: patient.firstname + " " + patient.lastname, value: patient.id.toString()
            }))))
    }

    const formatOptionLabel = (option: IReactSelect): React.JSX.Element => {
        return (
            <div>
                {option.label}
            </div>
        )
    }

    return (
        <div id="patientDropdown">
            <label className="form-label">
                <strong>Select
                    Patient&nbsp;
                    <span>*</span>
                </strong>
            </label>
            <Select
                inputId="structure"
                isSearchable={true}
                filterOption={() => true}
                options={patientOption}
                formatOptionLabel={formatOptionLabel}
                onChange={(value: IReactSelect | null) => {
                    setSelectedPatient(value)
                    sendSelectedPatient(value)
                }}
                onMenuScrollToBottom={() => {
                    setPatientQuery(patientQuery => ({ ...patientQuery, pageNumber: patientQuery.pageNumber!! + 1 }))
                    if (patientOption.length === patientQuery.pageSize!! * (patientQuery.pageNumber!! - 1)) {
                        getAllPatient()
                    }
                }}
                onInputChange={(value) => {
                    if (value.length >= 3 || value.length <= 0) {
                        setIsSearch(true)
                        setPatientOption([])
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
    )
}

export default PatientDropdownComponent