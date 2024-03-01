import { ReactElement, useEffect, useRef, useState } from "react";
import { IHistoryModelResponse, IHistoryModelResultLeftResponse, IHistoryModelResultRightResponse, IHistoryScoreResultResponse } from "../../../../interfaces/history/historyModel/historyModel";
import { useNavigate, useParams } from "react-router-dom";
import { getDiagnosisData } from "../../../../services/api/aigaService";
import { HandleError } from "../../../../interfaces/error/handleError";
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
import swal from "sweetalert2";
import "./analyticsHistory.css"
import LoadingModal from "../../../../components/loading/loading";
import POGSModal from "../../../../components/modal/POGS/pogsModal";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReactPDF, { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Image } from "react-bootstrap";

function AnalyticsHistory(): ReactElement {
    const { id } = useParams()
    const [historyAnalytics, setHistoryAnalytics] = useState<IHistoryModelResponse>()
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const chartKneeRef = useRef<ChartJS>(null)
    const chartHipRef = useRef(null)
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

    const styles: ReactPDF.Styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    })

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>AiGA Report</Text>
                <View style={styles.section}>
                    <Image
                        // style={styles.image}
                        src= {chartKneeRef.current!!.toBase64Image().replace('data:image/png;base64,', '')}
                    />
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );

    const optionsKnee = {
        responsive: true,
        maintainAspectRatio: false,
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

    const calulateMaximumSizeLabelKnee = (): number[] => {
        if (historyAnalytics?.result.left.left_knee[0].map((data) => data.frame).length!! > historyAnalytics?.result.right.right_knee[0].map((data) => data.frame).length!!) {
            return historyAnalytics?.result.left.left_knee[0].map((data) => data.frame)!!
        } else {
            return historyAnalytics?.result.right.right_knee[0].map((data) => data.frame)!!
        }
    }

    const calulateMaximumSizeLabelHip = (): number[] => {
        if (historyAnalytics?.result.left.left_hip[0].map((data) => data.frame).length!! > historyAnalytics?.result.right.right_hip[0].map((data) => data.frame).length!!) {
            return historyAnalytics?.result.left.left_hip[0].map((data) => data.frame)!!
        } else {
            return historyAnalytics?.result.right.right_hip[0].map((data) => data.frame)!!
        }
    }

    const renderGraphKnee = (historyAnalytics: IHistoryModelResponse | undefined): React.JSX.Element => {
        const chartData = {
            labels: calulateMaximumSizeLabelKnee(),
            datasets: [
                {
                    fill: false,
                    label: 'Left Leg',
                    data: historyAnalytics?.result.left.left_knee[0].map((data) => data.angle),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    fill: false,
                    label: 'Right Leg',
                    data: historyAnalytics?.result.right.right_knee[0].map((data) => data.angle),
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
        const chartData = {
            labels: calulateMaximumSizeLabelHip(),
            datasets: [
                {
                    fill: false,
                    label: 'Left Leg',
                    data: historyAnalytics?.result.left.left_hip[0].map((data) => data.angle),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    fill: false,
                    label: 'Right Leg',
                    data: historyAnalytics?.result.right.right_hip[0].map((data) => data.angle),
                    borderColor: '#77C3EC',
                    backgroundColor: 'rgb(119, 195, 236, 0.5)',
                }
            ],
        }

        return (
            <div>
                <Line options={optionsHip} data={chartData} width={300} height={400} ref={chartHipRef} />
            </div>
        )
    }

    const renderTable = (historyAnalytics: IHistoryModelResultLeftResponse | undefined | IHistoryModelResultRightResponse): React.JSX.Element => {
        return (
            <tbody className="text-center">
                <tr>
                    <td className="text-start">Intitial Contact</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.IC && 'active'}`}>{historyAnalytics?.score_1.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.IC && 'active'}`}>{historyAnalytics?.score_2.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.IC && 'active'}`}>{historyAnalytics?.score_3.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.IC && 'active'}`}>{historyAnalytics?.score_4.IC.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.IC && 'active'}`}>{historyAnalytics?.score_5.IC.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Loading Response</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.LR && 'active'}`}>{historyAnalytics?.score_1.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.LR && 'active'}`}>{historyAnalytics?.score_2.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.LR && 'active'}`}>{historyAnalytics?.score_3.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.LR && 'active'}`}>{historyAnalytics?.score_4.LR.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.LR && 'active'}`}>{historyAnalytics?.score_5.LR.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Midstance</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.MST && 'active'}`}>{historyAnalytics?.score_1.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.MST && 'active'}`}>{historyAnalytics?.score_2.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.MST && 'active'}`}>{historyAnalytics?.score_3.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.MST && 'active'}`}>{historyAnalytics?.score_4.MST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.MST && 'active'}`}>{historyAnalytics?.score_5.MST.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Terminal stance</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.TST && 'active'}`}>{historyAnalytics?.score_1.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.TST && 'active'}`}>{historyAnalytics?.score_2.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.TST && 'active'}`}>{historyAnalytics?.score_3.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.TST && 'active'}`}>{historyAnalytics?.score_4.TST.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.TST && 'active'}`}>{historyAnalytics?.score_5.TST.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Preswing</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.PS && 'active'}`}>{historyAnalytics?.score_1.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.PS && 'active'}`}>{historyAnalytics?.score_2.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.PS && 'active'}`}>{historyAnalytics?.score_3.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.PS && 'active'}`}>{historyAnalytics?.score_4.PS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.PS && 'active'}`}>{historyAnalytics?.score_5.PS.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Intitial Swing</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.IS && 'active'}`}>{historyAnalytics?.score_1.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.IS && 'active'}`}>{historyAnalytics?.score_2.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.IS && 'active'}`}>{historyAnalytics?.score_3.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.IS && 'active'}`}>{historyAnalytics?.score_4.IS.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.IS && 'active'}`}>{historyAnalytics?.score_5.IS.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Mid Swing</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.MSW && 'active'}`}>{historyAnalytics?.score_1.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.MSW && 'active'}`}>{historyAnalytics?.score_2.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.MSW && 'active'}`}>{historyAnalytics?.score_3.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.MSW && 'active'}`}>{historyAnalytics?.score_4.MSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.MSW && 'active'}`}>{historyAnalytics?.score_5.MSW.toPrecision(3)}</td>
                </tr>
                <tr>
                    <td className="text-start">Terminal Swing</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_1.TSW && 'active'}`}>{historyAnalytics?.score_1.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_2.TSW && 'active'}`}>{historyAnalytics?.score_2.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_3.TSW && 'active'}`}>{historyAnalytics?.score_3.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_4.TSW && 'active'}`}>{historyAnalytics?.score_4.TSW.toPrecision(3)}</td>
                    <td className={`text-start table-row ${!!historyAnalytics?.score_5.TSW && 'active'}`}>{historyAnalytics?.score_5.TSW.toPrecision(3)}</td>
                </tr>
            </tbody>
        )
    }

    const renderScore6Table = (historyAnalytics: IHistoryModelResultLeftResponse | undefined | IHistoryModelResultRightResponse) => {
        return (
            <tbody className="text-center">
                <tr>
                    <td className="text-start">Score 6</td>
                    <td className={`text-start table-row`}>{historyAnalytics?.score_6[0].score.toPrecision(3)}</td>
                    <td className={`text-start table-row`}>{historyAnalytics?.score_6[1].score.toPrecision(3)}</td>
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
                    <button className="btn btn-primary button-page" type="button" onClick={exportExcel}>Export</button>
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
                                    <div className="table-responsive table-box">
                                        <table
                                            className="table table-striped table tablesorter"
                                            id="ipi-table"
                                        >
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th className="text-capitalize text-start">
                                                        Gait phase
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
                                <div className="col">
                                    <div className="mb-3 header-text"><label className="form-label"><strong>Right Leg Gait Table</strong></label>
                                        <button className="btn btn-secondary show-modal-button" type="button" onClick={() => setIsShowModal(true)}>Gait Scroe Detail</button>
                                    </div>
                                    <div className="table-responsive table-box">
                                        <table
                                            className="table table-striped table tablesorter"
                                            id="ipi-table"
                                        >
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th className="text-capitalize text-start">
                                                        Gait phase
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
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AnalyticsHistory