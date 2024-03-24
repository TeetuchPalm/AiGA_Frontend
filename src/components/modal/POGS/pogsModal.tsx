import { ReactElement } from "react";
import "./pogsModal.scss"

interface IProps {
    showModal: (showModal: boolean) => void
    isShowModal: boolean
}

function POGSModal({ showModal, isShowModal }: IProps): ReactElement {
    return (
        <div id="pogsbox">
            <div id="pogs">
                {isShowModal && (
                    <div id="pogsModal" className="modal-pogs-window">
                        <div className="modal-pogs-content">
                            <div className="pogs-content-box">
                                <div className="pogs-header">
                                    <h4>Prosthetic Observational Gait Scale</h4>
                                    <span className="close close-icon infinity-btn" onClick={() => showModal(false)}>
                                        &times;
                                    </span>
                                </div>
                                <div className="pogs-body">
                                    <div className="body-pogs-table-list">
                                        <table id="pogsListTable">
                                            <thead className="table-thead">
                                                <tr className="table-column">
                                                    <th id="scoreNo" className="row-table-thead">
                                                        Score Number
                                                    </th>
                                                    <th id="pogsHead" className="row-table-thead">
                                                        POGS
                                                    </th>
                                                    <th id="interestedPhase" className="row-table-thead">
                                                        Interested phase
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body">
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">1</td>
                                                    <td className="row-data description">Peak Hip Extension in Stance (heel off max)</td>
                                                    <td className="row-data insterested-phase">Terminal Stance</td>
                                                </tr>
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">2</td>
                                                    <td className="row-data description">Peak hip flexion in Swing</td>
                                                    <td className="row-data insterested-phase">Mid-Swing, Terminal Swing</td>
                                                </tr>
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">3</td>
                                                    <td className="row-data description">Peak Extension in Stance</td>
                                                    <td className="row-data insterested-phase">Initial Contract, Loading Response, Mid-Stance, Terminal Stance</td>
                                                </tr>
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">4</td>
                                                    <td className="row-data description">Peak Knee Flexion/Heel-Rise in Swing</td>
                                                    <td className="row-data insterested-phase">Initial Swing</td>
                                                </tr>
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">5</td>
                                                    <td className="row-data description">Knee in Terminal Swing and at Initial Contact</td>
                                                    <td className="row-data insterested-phase">Terminal Swing</td>
                                                </tr>
                                                <tr className="table-row">
                                                    <td className="row-data text-center pogs">6</td>
                                                    <td className="row-data description">Knee Flexion in Terminal Stance and Pre-swing</td>
                                                    <td className="row-data insterested-phase">Preswing</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default POGSModal