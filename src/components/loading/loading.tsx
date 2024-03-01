import { ReactElement } from "react"
import "./loading.scss"

export type Props = {
    showLoadingModal: boolean
}

export default function LoadingModal({
    showLoadingModal
}: Props) {

    return (
        <div id="myLoaderModalBox">
            <div id="LoaderModal">
                {showLoadingModal
                    && <div id="myLoaderModal" className="modal-loader-window">
                        <div className="modal-content">
                            <label className="text">Loading..</label>
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    )
}