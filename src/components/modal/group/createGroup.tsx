import { ReactElement, useState } from "react";
import "./createGroup.scss"
import { IGroupRequest, IGroupResponse } from "../../../interfaces/history/group/Group";
import { createGroupHistory } from "../../../services/api/aigaService";
import LoadingModal from "../../loading/loading";
import swal from "sweetalert2";

interface IProps {
    showModal: (showModal: boolean) => void
    isShowModal: boolean
}

function CreateGroupModal({ showModal, isShowModal }: IProps): ReactElement {

    const [groupName, setGroupName] = useState<string>()
    const [groupDescription, setGroupDescription] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const createGroup = async () => {
        try {
            setIsLoading(true)
            const request = mapRequest()
            const response: IGroupResponse = await createGroupHistory(request)
            setIsLoading(false)
            swal.fire({
                title: "Success",
                text: "Create Group: " + response.name + " success",
                icon: "success",
            }).then(() => {
                showModal(false)
            })
        }
        catch (e) {
            setIsLoading(false)
        }
    }

    const mapRequest = (): IGroupRequest => {
        const request: IGroupRequest = {
            name: groupName!!,
            description: groupDescription
        }
        return request
    }

    const validateSubmitButton = (): boolean => {
        return !!!groupName
    }

    return (
        <div id="createGroupBox">
            <LoadingModal showLoadingModal={isLoading} />
            <div id="createGroup">
                {isShowModal && (
                    <div id="createGroupModal" className="modal-create-group-window">
                        <div className="modal-create-group-content">
                            <div className="create-group-content-box">
                                <div className="create-group-header">
                                    <h4>Create Group of History</h4>
                                    <span className="close close-icon infinity-btn" onClick={() => showModal(false)}>
                                        &times;
                                    </span>
                                </div>
                                <div className="create-group-body">
                                    <div className="name-box">
                                        <label className="form-label input-label-name">
                                            <strong>Name&nbsp;
                                            </strong>
                                        </label>
                                        <input className="form-control input-name" name="name" type="text" placeholder="Name" onChange={(e) => setGroupName(e.target.value)} />
                                    </div>
                                    <div className="description-box">
                                        <div className="input-label-description">
                                            <label className="form-label label-description">
                                                <strong>Description&nbsp;
                                                </strong>
                                            </label>
                                            <p className="max-character">maximum character is 255</p>
                                        </div>
                                        <textarea className="form-control input-description" maxLength={255} name="description" placeholder="Description" onChange={(e) => setGroupDescription(e.target.value)} />
                                    </div>
                                    <button className="btn btn-primary btn-lg submit-button" disabled={validateSubmitButton()} onClick={() => { createGroup() }}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateGroupModal