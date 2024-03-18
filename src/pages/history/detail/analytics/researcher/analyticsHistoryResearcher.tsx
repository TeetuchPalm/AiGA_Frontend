import { ReactElement, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiagnosisData, getHistoryById } from "../../../../../services/api/aigaService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import './analyticsHistoryResearcher.scss'
import LoadingModal from "../../../../../components/loading/loading";
import { IHistoryGraphResponse, IHistoryModelResponse, IHistoryScoreResultResponse } from "../../../../../interfaces/history/historyModel/historyModel";
import ExportExcel from "../../../../../components/export/excel/exportExcel";
import ExportPdf from "../../../../../components/export/pdf/exportPdf";
import { IHistoryResponse } from "../../../../../interfaces/history/History";
import { forEach } from "lodash";

function AnalyticsHistoryResearcher(): ReactElement {
    const { id } = useParams()
    const [historyAnalytics, setHistoryAnalytics] = useState<IHistoryModelResponse>()
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState<IHistoryResponse>()
    const chartKneeLeftRef = useRef<ChartJS>(null)
    const chartKneeRightRef = useRef<ChartJS>(null)
    const chartHipLeftRef = useRef<ChartJS>(null)
    const chartHipRightRef = useRef<ChartJS>(null)
    const navigate = useNavigate()
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )

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
                text: 'Knee Angle',
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
                }
            }
        }

    }

    const optionsHip = {
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
                text: 'Hip Angle',
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
                }
            }
        }

    }

    useEffect(() => {
        if (id) {
            getHistoryAnalytics(id)
        }
    }, [])

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

    const calulateMaximumSizeLabel = (response: IHistoryGraphResponse[][] | undefined): number[] => {
        var maxLengthCycle: number[] = []
        if(response) {
            response.forEach((cycle) => {
            if(maxLengthCycle.length < cycle.length) {
                maxLengthCycle = cycle.map((data) => data.frame)
            }
        }) 
        }
        return maxLengthCycle.length === 0 ? [1,2,3,4] : maxLengthCycle
    }

    const renderGraphKnee = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const colorSet: string[] = ['#00BFFF', '#98FB98', '#F4A460', '#FFC0CB', '#8A2BE2', '#D70202', '#F629F2']
        const chartDataLeft = {
            labels: calulateMaximumSizeLabel(historyAnalytics?.result.left.left_knee),
            datasets: historyAnalytics?.result.left.left_knee.map((graph, index) => (
                {
                    label: 'Left Leg Graph ' + (index + 1),
                    data: graph.map((data) => data.angle),
                    borderColor: colorSet[index] || 'rgba(255, 99, 132)',
                    backgroundColor: colorSet[index] || 'rgba(255, 99, 132)',
                }
            )
            ) || [],
        }

        const chartDataRight = {
            labels: calulateMaximumSizeLabel(historyAnalytics?.result.right.right_knee),
            datasets: historyAnalytics?.result.right.right_knee.map((graph, index) => (
                {
                    label: 'Right Leg Graph ' + (index + 1),
                    data: graph.map((data) => data.angle),
                    borderColor: colorSet[index] || 'rgba(255, 99, 132)',
                    backgroundColor: colorSet[index] || 'rgba(255, 99, 132)',
                }
            )
            ) || [],
        }
        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Left</strong></label>
                    <div id="canvas-container">
                        <Chart type="line" options={optionsKnee} data={chartDataLeft} width={300} height={400} ref={chartKneeLeftRef} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Right</strong></label>
                    <div id="canvas-container">
                        <Chart type="line" options={optionsKnee} data={chartDataRight} width={300} height={400} ref={chartKneeRightRef} />
                    </div>
                </div>
            </div>
        )
    }


    const renderGraphHip = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const colorSet: string[] = ['#00BFFF', '#98FB98', '#F4A460', '#FFC0CB', '#8A2BE2', '#D70202', '#F629F2']
        const chartDataLeft = {
            labels: calulateMaximumSizeLabel(historyAnalytics?.result.left.left_hip),
            datasets: historyAnalytics?.result.left.left_hip.map((graph, index) => (
                {
                    label: 'Left Leg Graph ' + (index + 1),
                    data: graph.map((data) => data.angle),
                    borderColor: colorSet[index] || 'rgba(255, 99, 132)',
                    backgroundColor: colorSet[index] || 'rgba(255, 99, 132)',
                }
            )
            ) || [],
        }

        const chartDataRight = {
            labels: calulateMaximumSizeLabel(historyAnalytics?.result.right.right_hip),
            datasets: historyAnalytics?.result.right.right_hip.map((graph, index) => (
                {
                    label: 'Right Leg Graph ' + (index + 1),
                    data: graph.map((data) => data.angle),
                    borderColor: colorSet[index] || 'rgba(255, 99, 132)',
                    backgroundColor: colorSet[index] || 'rgba(255, 99, 132)',
                }
            )
            ) || [],
        }

        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Left</strong></label>
                    <div id="canvas-container">
                        <Chart type="line" options={optionsHip} data={chartDataLeft} width={300} height={400} ref={chartHipLeftRef} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Right</strong></label>
                    <div id="canvas-container">
                        <Chart type="line" options={optionsHip} data={chartDataRight} width={300} height={400} ref={chartHipRightRef} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="analytiesHistory">
            <LoadingModal showLoadingModal={isLoading} />
            <div className="container-fluid history-graph">
                <div className="button-area">
                    <div>
                        <button className="btn btn-secondary button-page" type="button" onClick={() => navigate("/history")}>Back</button>
                        <button className="btn btn-primary button-page" type="button" onClick={() => navigate("/history/" + id)}>History Detail</button>
                    </div>
                    <div className="export-button">
                        <ExportPdf
                            pictureOne={chartKneeLeftRef}
                            pictureTwo={chartKneeRightRef}
                            pictureThreeResearch={chartHipLeftRef}
                            pictureFourResearch={chartHipRightRef}
                            pictureThree={null}
                            pictureFour={null}
                            abnormalRange={null}
                            history={history}
                            sendIsLoading={(value) => {
                                setIsLoading(value)
                            }}
                            disable={!history}
                        />
                        {/* <button className="btn btn-primary" type="button" onClick={exportExcel}>Export Excel</button> */}
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
                                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Knee Angle</strong></label>
                                    </div>
                                    {renderGraphKnee(historyAnalytics)}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12"><label className="form-label"><strong>Hip Angle</strong></label>
                                    <div className="mb-3"></div>
                                    {renderGraphHip(historyAnalytics)}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AnalyticsHistoryResearcher