import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiagnosisData } from "../../../../../services/api/aigaService";
import { HandleError } from "../../../../../interfaces/error/handleError";
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
import { Line } from 'react-chartjs-2';
import swal from "sweetalert2";
import './analyticsHistoryResearcher.scss'
import LoadingModal from "../../../../../components/loading/loading";
import { IHistoryModelResponse, IHistoryScoreResultResponse } from "../../../../../interfaces/history/historyModel/historyModel";
import XLSX from "xlsx";
import { saveAs } from "file-saver";

function AnalyticsHistoryResearcher(): ReactElement {
    const { id } = useParams()
    const [historyAnalytics, setHistoryAnalytics] = useState<IHistoryModelResponse>()
    const [isLoading, setIsLoading] = useState(false)
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
        maintainAspectRatio: false,
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
            setIsLoading(false)
        } catch (e) {
            const error: HandleError = e as HandleError
            swal.fire({
                icon: 'error',
                title: 'Failed Error code: ' + error.response.data.errorCode,
                text: error.response.data.errorMessage
            })
            setIsLoading(false)
        }
    }

    const createLeftWorkSheet = (): XLSX.WorkSheet => {
        const wsl: XLSX.WorkSheet = XLSX.utils.sheet_new()
        const scoreName = [{ name: 'Score1' }, { name: 'Score2' }, { name: 'Score3' }, { name: 'Score4' }, { name: 'Score5' }]
        const header: string[] = ['state', 'score']
        const scoreLeft: IHistoryScoreResultResponse[] = []
        var maxRowLeft: number = 0
        scoreLeft.push(historyAnalytics?.result.left.score_1!!)
        scoreLeft.push(historyAnalytics?.result.left.score_2!!)
        scoreLeft.push(historyAnalytics?.result.left.score_3!!)
        scoreLeft.push(historyAnalytics?.result.left.score_4!!)
        scoreLeft.push(historyAnalytics?.result.left.score_5!!)
        XLSX.utils.sheet_add_aoa(wsl, [['Score']], { origin: { r: 0, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, scoreName, { origin: { r: 1, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, scoreLeft, { origin: { r: 1, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsl, [['Score6']], { origin: { r: 8, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, historyAnalytics?.result.left.score_6!!, { header: header, origin: { r: 8, c: 1 } })
        historyAnalytics?.result.left.left_hip.forEach((lefthip, index) => {
            if (maxRowLeft < lefthip.length) {
                maxRowLeft = lefthip.length
            }
            XLSX.utils.sheet_add_aoa(wsl, [('Hip ' + (index + 1)).split(" ")], { origin: { r: 14, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsl, lefthip, { origin: { r: 16, c: 0 + (index * 4) } })
        })
        historyAnalytics?.result.left.left_knee.forEach((leftknee, index) => {
            XLSX.utils.sheet_add_aoa(wsl, [('Knee ' + (index + 1)).split(" ")], { origin: { r: maxRowLeft + 20, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsl, leftknee, { origin: { r: maxRowLeft + 22, c: 0 + (index * 4) } })
        })
        return wsl
    }

    const createRightWorkSheet = (): XLSX.WorkSheet => {
        const wsr: XLSX.WorkSheet = XLSX.utils.sheet_new()
        const scoreName = [{ name: 'Score1' }, { name: 'Score2' }, { name: 'Score3' }, { name: 'Score4' }, { name: 'Score5' }]
        const header: string[] = ['state', 'score']
        var maxRowRight: number = 0
        const scoreRight: IHistoryScoreResultResponse[] = []
        scoreRight.push(historyAnalytics?.result.right.score_1!!)
        scoreRight.push(historyAnalytics?.result.right.score_2!!)
        scoreRight.push(historyAnalytics?.result.right.score_3!!)
        scoreRight.push(historyAnalytics?.result.right.score_4!!)
        scoreRight.push(historyAnalytics?.result.right.score_5!!)
        XLSX.utils.sheet_add_aoa(wsr, [['Score']], { origin: { r: 0, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, scoreName, { origin: { r: 1, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, scoreRight, { origin: { r: 1, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsr, [['Score6']], { origin: { r: 8, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, historyAnalytics?.result.right.score_6!!, { header: header, origin: { r: 8, c: 1 } })
        historyAnalytics?.result.right.right_hip.forEach((righthip, index) => {
            if (maxRowRight < righthip.length) {
                maxRowRight = righthip.length
            }
            XLSX.utils.sheet_add_aoa(wsr, [('Hip ' + (index + 1)).split(" ")], { origin: { r: 14, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsr, righthip, { origin: { r: 16, c: 0 + (index * 4) } })
        })
        historyAnalytics?.result.right.right_knee.forEach((rightknee, index) => {
            XLSX.utils.sheet_add_aoa(wsr, [('Knee ' + (index + 1)).split(" ")], { origin: { r: maxRowRight + 20, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsr, rightknee, { origin: { r: maxRowRight + 22, c: 0 + (index * 4) } })
        })
        return wsr
    }

    const exportExcel = async () => {
        const wsl: XLSX.WorkSheet = createLeftWorkSheet()
        const wsr: XLSX.WorkSheet = createRightWorkSheet()
        const wb: XLSX.WorkBook = XLSX.utils.book_new(wsl, 'left')
        XLSX.utils.book_append_sheet(wb, wsr, 'right', true)
        const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        saveAs(blob, 'test.xlsx')
    }

    const renderGraphKnee = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const colorSet: string[] = ['#00BFFF', '#98FB98', '#F4A460', '#FFC0CB', '#8A2BE2', '#D70202', '#F629F2']
        const chartDataLeft = {
            labels: historyAnalytics?.result.left.left_knee[0].map((data) => data.frame),
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
            labels: historyAnalytics?.result.right.right_knee[0].map((data) => data.frame),
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
                        <Line options={optionsKnee} data={chartDataLeft} width={300} height={400} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Right</strong></label>
                    <div id="canvas-container">
                        <Line options={optionsKnee} data={chartDataRight} width={300} height={400} />
                    </div>
                </div>
            </div>
        )
    }


    const renderGraphHip = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const colorSet: string[] = ['#00BFFF', '#98FB98', '#F4A460', '#FFC0CB', '#8A2BE2', '#D70202', '#F629F2']
        const chartDataLeft = {
            labels: historyAnalytics?.result.left.left_hip[0].map((data) => data.frame),
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
            labels: historyAnalytics?.result.right.right_hip[0].map((data) => data.frame),
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
                        <Line options={optionsHip} data={chartDataLeft} width={300} height={400} />
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                    <label className="form-label"><strong>Right</strong></label>
                    <div id="canvas-container">
                        <Line options={optionsHip} data={chartDataRight} width={300} height={400} />
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
                    <button className="btn btn-primary button-page" type="button" onClick={exportExcel}>Export</button>
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