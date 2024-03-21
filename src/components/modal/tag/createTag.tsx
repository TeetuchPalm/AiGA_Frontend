import { ReactElement, useState } from "react";
import "./createTag.scss"
import { createTagPatient } from "../../../services/api/aigaService";
import LoadingModal from "../../loading/loading";
import swal from "sweetalert2";
import { ITagRequest, ITagResponse } from "../../../interfaces/patient/tag/Tag";

interface IProps {
    showModal: (showModal: boolean) => void
    isShowModal: boolean
}

function CreateTagModal({ showModal, isShowModal }: IProps): ReactElement {

    const [tagName, setTagName] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const createTag = async () => {
        try {
            setIsLoading(true)
            const request = mapRequest()
            const response: ITagResponse = await createTagPatient(request)
            setIsLoading(false)
            swal.fire({
                title: "Success",
                text: "Create Tag: " + response.name + " success",
                icon: "success",
            }).then(() => {
                showModal(false)
            })
        } catch (e) {
            setIsLoading(false)
        }
    }

    const mapRequest = (): ITagRequest => {
        const request: ITagRequest = {
            name: tagName!!
        }
        return request
    }

    const validateSubmitButton = (): boolean => {
        return !!!tagName
    }

    return (
        <div id="createTagBox">
            <LoadingModal showLoadingModal={isLoading} />
            <div id="createTag">
                {isShowModal && (
                    <div id="createTagModal" className="modal-create-tag-window">
                        <div className="modal-create-tag-content">
                            <div className="create-tag-content-box">
                                <div className="create-tag-header">
                                    <h4>Create Tag of Patient</h4>
                                    <span className="close close-icon infinity-btn" onClick={() => showModal(false)}>
                                        &times;
                                    </span>
                                </div>
                                <div className="create-tag-body">
                                    <div className="name-box">
                                        <label className="form-label input-label-name">
                                            <strong>Name&nbsp;
                                            </strong>
                                        </label>
                                        <input className="form-control input-name" name="name" type="text" placeholder="Name" onChange={(e) => setTagName(e.target.value)} />
                                    </div>
                                    <button className="btn btn-primary btn-lg submit-button" disabled={validateSubmitButton()} onClick={() => { createTag() }}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateTagModal