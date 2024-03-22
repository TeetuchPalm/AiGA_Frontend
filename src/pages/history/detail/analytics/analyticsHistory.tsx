import { ReactElement, useEffect, useRef, useState } from "react";
import { IHistoryModelResponse, IHistoryModelResultLeftResponse, IHistoryModelResultRightResponse } from "../../../../interfaces/history/historyModel/historyModel";
import { useNavigate, useParams } from "react-router-dom";
import { getDiagnosisData, getHistoryById } from "../../../../services/api/aigaService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import "./analyticsHistory.css"
import LoadingModal from "../../../../components/loading/loading";
import POGSModal from "../../../../components/modal/POGS/pogsModal";
import { IHistoryResponse } from "../../../../interfaces/history/History";
import ExportPdf from "../../../../components/export/pdf/exportPdf";
import ExportExcel from "../../../../components/export/excel/exportExcel";

function AnalyticsHistory(): ReactElement {
    const { id } = useParams()
    const [historyAnalytics, setHistoryAnalytics] = useState<IHistoryModelResponse>()
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const chartKneeRef = useRef<ChartJS>(null)
    const chartHipRef = useRef<ChartJS>(null)
    const tableLeftRef = useRef<HTMLDivElement>(null)
    const tableRightRef = useRef<HTMLDivElement>(null)
    const abnormalRange = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const [history, setHistory] = useState<IHistoryResponse>()

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        LineController
    )

    useEffect(() => {
        if (id) {
            getHistoryAnalytics(id)
        }
    }, [])

    const optionsKnee = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Knee Angle Left And Right Leg',
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItem: any) => {
                        return `Frame ${tooltipItem[0].label}:`
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'angle'
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'frame'
                },
                offset: true,
            },
        }

    }

    const optionsHip = {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: false,
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Hip Angle Left And Right Leg',
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItem: any) => {
                        return `Frame ${tooltipItem[0].label}:`
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'angle'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'frame'
                },
                offset: true,
            }
        }

    }

    const getHistoryAnalytics = async (id: string) => {
        try {
            setIsLoading(true)
            const response: IHistoryModelResponse = await getDiagnosisData(id)
            setHistoryAnalytics(response)
            const history: IHistoryResponse = await getHistoryById(id)
            setHistory(history)
            setIsLoading(false)
        } catch (e) {
            navigate('/history')
            setIsLoading(false)
        }
    }

    const calulateMaximumSizeLabelKnee = (): number[] => {
        const leftLabelLength = historyAnalytics?.result.left.left_knee.length !== 0 ? historyAnalytics?.result.left.left_knee[0].map((data) => data.frame).length!! : 0
        const rightLabelLength = historyAnalytics?.result.right.right_knee.length !== 0 ? historyAnalytics?.result.right.right_knee[0].map((data) => data.frame).length!! : 0
        if (leftLabelLength > rightLabelLength) {
            return historyAnalytics?.result.left.left_knee[0].map((data) => data.frame)!!
        } else if (leftLabelLength === 0 && rightLabelLength === 0) {
            return [1, 2, 3, 4]
        } else {
            return historyAnalytics?.result.right.right_knee[0].map((data) => data.frame)!!
        }
    }

    const calulateMaximumSizeLabelHip = (): number[] => {
        const leftLabelLength = historyAnalytics?.result.left.left_hip.length !== 0 ? historyAnalytics?.result.left.left_hip[0].map((data) => data.frame).length!! : 0
        const rightLabelLength = historyAnalytics?.result.right.right_hip.length !== 0 ? historyAnalytics?.result.right.right_hip[0].map((data) => data.frame).length!! : 0
        if (leftLabelLength > rightLabelLength) {
            return historyAnalytics?.result.left.left_hip[0].map((data) => data.frame)!!
        } else if (leftLabelLength === 0 && rightLabelLength === 0) {
            return [1, 2, 3, 4]
        } else {
            return historyAnalytics?.result.right.right_knee[0].map((data) => data.frame)!!
        }
    }

    const renderGraphKnee = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const leftKneeData: number[] | undefined = historyAnalytics?.result.left.left_knee.length !== 0 ? historyAnalytics?.result.left.left_knee[0].map((data) => data.angle) : []
        const rightKneeData: number[] | undefined = historyAnalytics?.result.right.right_knee.length !== 0 ? historyAnalytics?.result.right.right_knee[0].map((data) => data.angle) : []
        const chartData = {
            labels: calulateMaximumSizeLabelKnee(),
            datasets: [
                {
                    fill: false,
                    label: 'Left Leg',
                    data: leftKneeData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    fill: false,
                    label: 'Right Leg',
                    data: rightKneeData,
                    borderColor: '#77C3EC',
                    backgroundColor: 'rgb(119, 195, 236, 0.5)',
                }
            ],
        }
        return (
            <div id="canvas-container">
                <Chart type="line" options={optionsKnee} data={chartData} width={300} height={400} ref={chartKneeRef} />
            </div>
        )
    }

    const renderGraphHip = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const leftHipData: number[] | undefined = historyAnalytics?.result.left.left_hip.length !== 0 ? historyAnalytics?.result.left.left_hip[0].map((data) => data.angle) : []
        const rightHipData: number[] | undefined = historyAnalytics?.result.right.right_hip.length !== 0 ? historyAnalytics?.result.right.right_hip[0].map((data) => data.angle) : []
        const chartData = {
            labels: calulateMaximumSizeLabelHip(),
            datasets: [
                {
                    fill: false,
                    label: 'Left Leg',
                    data: leftHipData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    fill: false,
                    label: 'Right Leg',
                    data: rightHipData,
                    borderColor: '#77C3EC',
                    backgroundColor: 'rgb(119, 195, 236, 0.5)',
                }
            ],
        }

        return (
            <div>
                <Chart type="line" options={optionsHip} data={chartData} width={300} height={400} ref={chartHipRef} />
            </div>
        )
    }

    const weightGenerate = (score: number): string => {
        if (0 < score && score <= 0.667) {
            return 'yellow'
        } else if (0.667 < score && score <= 1.333) {
            return 'orange'
        } else if (1.333 < score) {
            return 'red'
        } else {
            return 'white'
        }
    }

    const renderTable = (historyAnalytics: IHistoryModelResultLeftResponse | undefined | IHistoryModelResultRightResponse): React.JSX.Element => {
        return (
            <tbody className="text-center">
                <tr>
                    <td className="text-start">Intitial Contact</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.IC!!)}`}>{historyAnalytics?.score_1.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.IC!!)}`}>{historyAnalytics?.score_2.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.IC!!)}`}>{historyAnalytics?.score_3.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.IC!!)}`}>{historyAnalytics?.score_4.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.IC!!)}`}>{historyAnalytics?.score_5.IC.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Loading Response</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.LR!!)}`}>{historyAnalytics?.score_1.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.LR!!)}`}>{historyAnalytics?.score_2.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.LR!!)}`}>{historyAnalytics?.score_3.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.LR!!)}`}>{historyAnalytics?.score_4.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.LR!!)}`}>{historyAnalytics?.score_5.LR.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Midstance</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.MST!!)}`}>{historyAnalytics?.score_1.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.MST!!)}`}>{historyAnalytics?.score_2.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.MST!!)}`}>{historyAnalytics?.score_3.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.MST!!)}`}>{historyAnalytics?.score_4.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.MST!!)}`}>{historyAnalytics?.score_5.MST.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Terminal stance</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.TST!!)}`}>{historyAnalytics?.score_1.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.TST!!)}`}>{historyAnalytics?.score_2.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.TST!!)}`}>{historyAnalytics?.score_3.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.TST!!)}`}>{historyAnalytics?.score_4.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.TST!!)}`}>{historyAnalytics?.score_5.TST.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Preswing</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.PS!!)}`}>{historyAnalytics?.score_1.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.PS!!)}`}>{historyAnalytics?.score_2.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.PS!!)}`}>{historyAnalytics?.score_3.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.PS!!)}`}>{historyAnalytics?.score_4.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.PS!!)}`}>{historyAnalytics?.score_5.PS.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Intitial Swing</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.IS!!)}`}>{historyAnalytics?.score_1.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.IS!!)}`}>{historyAnalytics?.score_2.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.IS!!)}`}>{historyAnalytics?.score_3.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.IS!!)}`}>{historyAnalytics?.score_4.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.IS!!)}`}>{historyAnalytics?.score_5.IS.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Mid Swing</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.MSW!!)}`}>{historyAnalytics?.score_1.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.MSW!!)}`}>{historyAnalytics?.score_2.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.MSW!!)}`}>{historyAnalytics?.score_3.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.MSW!!)}`}>{historyAnalytics?.score_4.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.MSW!!)}`}>{historyAnalytics?.score_5.MSW.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Terminal Swing</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_1.TSW!!)}`}>{historyAnalytics?.score_1.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_2.TSW!!)}`}>{historyAnalytics?.score_2.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_3.TSW!!)}`}>{historyAnalytics?.score_3.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_4.TSW!!)}`}>{historyAnalytics?.score_4.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(historyAnalytics?.score_5.TSW!!)}`}>{historyAnalytics?.score_5.TSW.toPrecision(3)}</td>
                </tr>
            </tbody>
        )
    }

    const renderScore6Table = (historyAnalytics: IHistoryModelResultLeftResponse | undefined | IHistoryModelResultRightResponse) => {
        return (
            <tbody className="text-center">
                <tr>
                    <td className="text-start">Score 6</td>
                    <td className={`text-start table-row ${weightGenerate(Number(historyAnalytics?.score_6[0].score.toPrecision(3)))}`}>{historyAnalytics?.score_6[0].score.toPrecision(3)}</td>
                    <td className={`text-start table-row ${weightGenerate(Number(historyAnalytics?.score_6[1].score.toPrecision(3)))}`}>{historyAnalytics?.score_6[1].score.toPrecision(3)}</td>
                </tr>
            </tbody>
        )
    }

    return (
        <div id="analytiesHistory">
            <LoadingModal showLoadingModal={isLoading} />
            <POGSModal isShowModal={isShowModal} showModal={value => setIsShowModal(value)} />
            <div className="container-fluid history-graph">
                <div className="button-area">
                    <div>
                        <button className="btn btn-secondary button-page" type="button" onClick={() => navigate("/history")}>Back</button>
                        <button className="btn btn-primary button-page" type="button" onClick={() => navigate("/history/" + id)}>History Detail</button>
                    </div>
                    <div className="export-button">
                        <ExportPdf
                            pictureOne={chartKneeRef}
                            pictureTwo={chartHipRef}
                            pictureThree={tableLeftRef}
                            pictureFour={tableRightRef}
                            abnormalRange={abnormalRange}
                            history={history}
                            sendIsLoading={(value) => {
                                setIsLoading(value)
                            }}
                            disable={!history}
                            pictureThreeResearch={null}
                            pictureFourResearch={null}
                        />
                        <ExportExcel
                            analyticResult={historyAnalytics}
                            sendIsLoading={(value) => {
                                setIsLoading(value)
                            }}
                            disable={!historyAnalytics}
                        />
                    </div>
                </div>
                <form>
                    <div className="card shadow mb-3 graph-box">
                        <div className="card-body">
                            <div className="row graph">
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                                    <div className="mb-3"><label className="form-label"><strong>Knee Angle</strong></label></div>
                                    {renderGraphKnee(historyAnalytics)}
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6"><label className="form-label"><strong>Hip Angle</strong></label>
                                    <div className="mb-3"></div>
                                    {renderGraphHip(historyAnalytics)}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="container-fluid table-gait">
                <div className="d-sm-flex justify-content-between align-items-center mb-4"></div>
                <form>
                    <div className="card shadow mb-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3 header-text"><label className="form-label"><strong>Left Leg Gait Table</strong></label></div>
                                    <div ref={tableLeftRef}>
                                        <div className="table-responsive table-box">
                                            <table
                                                className="table table-striped table tablesorter"
                                                id="ipi-table"
                                            >
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-capitalize text-start">
                                                            Gait phase   /   Score
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 1
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 2
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 3
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 4
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 5
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {renderTable(historyAnalytics?.result.left)}
                                            </table>
                                        </div>
                                        <div className="table-responsive score6-table">
                                            <table
                                                className="table table-striped table tablesorter"
                                                id="ipi-table"
                                            >
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-capitalize text-start">
                                                            State
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Early
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Late
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {renderScore6Table(historyAnalytics?.result.left)}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3 header-text">
                                        <label className="form-label"><strong>Right Leg Gait Table</strong></label>
                                        <button className="btn btn-secondary show-modal-button" type="button" onClick={() => setIsShowModal(true)}>Gait Scroe Detail</button>
                                    </div>
                                    <div ref={tableRightRef}>
                                        <div className="table-responsive table-box">
                                            <table
                                                className="table table-striped table tablesorter"
                                                id="ipi-table"
                                            >
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-capitalize text-start">
                                                            Gait phase   /   Score
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 1
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 2
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 3
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 4
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Score 5
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {renderTable(historyAnalytics?.result.right)}
                                            </table>
                                        </div>
                                        <div className="table-responsive score6-table">
                                            <table
                                                className="table table-striped table tablesorter"
                                                id="ipi-table"
                                            >
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th className="text-capitalize text-start">
                                                            State
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Early
                                                        </th>
                                                        <th className="text-capitalize text-start">
                                                            Late
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {renderScore6Table(historyAnalytics?.result.right)}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="show-weight-range" ref={abnormalRange}>
                                <div className="weight-range">
                                    <div className="white"> </div>
                                    <div className="yellow"> </div>
                                    <div className="orange"> </div>
                                    <div className="red"> </div>
                                </div>
                                <div className="range-mean">
                                    <div>Normal</div>
                                    <div>Abnormal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AnalyticsHistory