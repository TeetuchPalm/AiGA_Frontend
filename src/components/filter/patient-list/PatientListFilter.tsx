import React, { ReactElement, useEffect, useState } from "react"
import Select from "react-select"
import "./PatientListFilter.css"
import { IPatientParams } from "../../../interfaces/patient/Patient"
import { IReactSelect } from "../../../interfaces/general-component/reactSelectInterface"
import { IPageResponse } from "../../../interfaces/paginate/Page"
import { ITagParams, ITagResponse } from "../../../interfaces/patient/tag/Tag"
import { getAllPageTag } from "../../../services/api/aigaService"
import { cloneDeep } from "lodash"
interface IProps {
  filterParams: IPatientParams
  showFilter: (showFilter: boolean) => void
  sendParams: (params: IPatientParams, selectedTag: IReactSelect | null) => void
  selectedTagProp: IReactSelect | null
  isShowFilter: boolean
}

function PatientListFilter({ filterParams, showFilter, sendParams, isShowFilter, selectedTagProp }: IProps): ReactElement {
  const [patientparams, setPatientparams] = useState<IPatientParams>(filterParams)
  const [tagOptions, setTagOptions] = useState<IReactSelect[]>([])
  const [tagQuery, setTagQuery] = useState<ITagParams>({
    pageNumber: 1,
    pageSize: 20
  })
  const [selectedTag, setSelectedTag] = useState<IReactSelect | null>(selectedTagProp)
  const [isSearch, setIsSearch] = useState<boolean>(false)

  useEffect(() => {
    fetchTag()
  }, [])

  useEffect(() => {
    if (isSearch) {
      fetchTag()
      setIsSearch(false)
    }
  }, [tagOptions])

  const fetchTag = async () => {
      const response: IPageResponse<ITagResponse[]> = await getAllPageTag(tagQuery)
      setTagOptions(tagOptions.concat(response.entities.map(tag => (
        {
          label: tag.name, value: tag.id.toString()
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
    const params: IPatientParams = {
      firstname: undefined,
      lastname: undefined,
      tags: undefined,
      pageNumber: 1,
      pageSize: 7
    }
    setPatientparams(params)
    sendParams(params, null)
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
        <div className="detail-patient-list-text-box">
          <div className="detail-patient-list-text-key-box">
            <label className="detail-patient-list-text-key">{title}</label>
          </div>
          <div className="detail-patient-list-text-value-box">
            <label className="detail-patient-list-text-value">{value}</label>
          </div>
        </div>
      )
    }
    return result
  }

  const closeFilter = () => {
    showFilter(false)
  }

  const searchPatientList = () => {
    const patientparamsClone: IPatientParams = cloneDeep(patientparams)
    patientparamsClone.pageNumber = 1
    sendParams(patientparamsClone, selectedTag)
    closeFilter()
  }

  return (
    <div id="patientfilter">
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
            {showDetailFilter('Firstname: ', patientparams?.firstname || '')}
            {showDetailFilter('Surname: ', patientparams?.lastname || '')}
            {showDetailFilter('tags: ', selectedTag?.label || patientparams.tags?.toString() || '')}
          </div>
          <div className="filter-box">
            <label className="form-label">
              <strong>Firstname&nbsp;
              </strong>
            </label>
            <input type="text" className="form-control" value={patientparams?.firstname} onChange={(e) => { setPatientparams({ ...patientparams, firstname: e.target.value }) }} />
          </div>
          <div className="filter-box">
            <label className="form-label">
              <strong>Surname&nbsp;
              </strong>
            </label>
            <input type="text" className="form-control" value={patientparams?.lastname} onChange={(e) => { setPatientparams({ ...patientparams, lastname: e.target.value }) }} />
          </div>
          <div className="filter-box">
            <label className="form-label">
              <strong>Select
                Tag&nbsp;
              </strong>
            </label>
            <Select
              inputId="tag"
              isSearchable={true}
              filterOption={() => true}
              options={tagOptions}
              formatOptionLabel={formatOptionLabel}
              onChange={(value: IReactSelect | null) => {
                setSelectedTag(value)
                setPatientparams({ ...patientparams, tags: [Number(value?.value)] || undefined })
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
          <div className="button-action">
            <button className="button-search infinity-btn" onClick={() => searchPatientList()}>
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default PatientListFilter