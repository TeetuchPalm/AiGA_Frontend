import React, { ReactElement } from "react"
import "./exportExcel.scss"
import XLSX from "xlsx";
import { saveAs } from "file-saver"
import { IHistoryModelResponse, IHistoryScoreResultResponse } from "../../../interfaces/history/historyModel/historyModel";
interface IProps {
    analyticResult: IHistoryModelResponse | undefined
    sendIsLoading: (isLoading: boolean) => void
    disable: boolean
}

function ExportExcel({ analyticResult, sendIsLoading, disable }: IProps): ReactElement {
    const createLeftWorkSheet = (): XLSX.WorkSheet => {
        const wsl: XLSX.WorkSheet = XLSX.utils.sheet_new()
        const scoreName = [{ name: 'Score1' }, { name: 'Score2' }, { name: 'Score3' }, { name: 'Score4' }, { name: 'Score5' }]
        const header: string[] = ['state', 'score']
        const scoreLeft: IHistoryScoreResultResponse[] = []
        var maxRowLeft: number = 0
        scoreLeft.push(analyticResult?.result.left.score_1!!)
        scoreLeft.push(analyticResult?.result.left.score_2!!)
        scoreLeft.push(analyticResult?.result.left.score_3!!)
        scoreLeft.push(analyticResult?.result.left.score_4!!)
        scoreLeft.push(analyticResult?.result.left.score_5!!)
        XLSX.utils.sheet_add_aoa(wsl, [['History ID']], { origin: { r: 0, c: 0 } })
        XLSX.utils.sheet_add_aoa(wsl, [[analyticResult?.history_id]], { origin: { r: 0, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsl, [['Score']], { origin: { r: 1, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, scoreName, { origin: { r: 2, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, scoreLeft, { origin: { r: 2, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsl, [['Score6']], { origin: { r: 9, c: 0 } })
        XLSX.utils.sheet_add_json(wsl, analyticResult?.result.left.score_6!!, { header: header, origin: { r: 9, c: 1 } })
        analyticResult?.result.left.left_hip.forEach((lefthip, index) => {
            if (maxRowLeft < lefthip.length) {
                maxRowLeft = lefthip.length
            }
            XLSX.utils.sheet_add_aoa(wsl, [('Hip ' + (index + 1)).split(" ")], { origin: { r: 15, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsl, lefthip, { origin: { r: 17, c: 0 + (index * 4) } })
        })
        analyticResult?.result.left.left_knee.forEach((leftknee, index) => {
            XLSX.utils.sheet_add_aoa(wsl, [('Knee ' + (index + 1)).split(" ")], { origin: { r: maxRowLeft + 21, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsl, leftknee, { origin: { r: maxRowLeft + 23, c: 0 + (index * 4) } })
        })
        return wsl
    }

    const createRightWorkSheet = (): XLSX.WorkSheet => {
        const wsr: XLSX.WorkSheet = XLSX.utils.sheet_new()
        const scoreName = [{ name: 'Score1' }, { name: 'Score2' }, { name: 'Score3' }, { name: 'Score4' }, { name: 'Score5' }]
        const header: string[] = ['state', 'score']
        var maxRowRight: number = 0
        const scoreRight: IHistoryScoreResultResponse[] = []
        scoreRight.push(analyticResult?.result.right.score_1!!)
        scoreRight.push(analyticResult?.result.right.score_2!!)
        scoreRight.push(analyticResult?.result.right.score_3!!)
        scoreRight.push(analyticResult?.result.right.score_4!!)
        scoreRight.push(analyticResult?.result.right.score_5!!)
        XLSX.utils.sheet_add_aoa(wsr, [['History ID']], { origin: { r: 0, c: 0 } })
        XLSX.utils.sheet_add_aoa(wsr, [[analyticResult?.history_id]], { origin: { r: 0, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsr, [['Score']], { origin: { r: 1, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, scoreName, { origin: { r: 2, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, scoreRight, { origin: { r: 2, c: 1 } })
        XLSX.utils.sheet_add_aoa(wsr, [['Score6']], { origin: { r: 9, c: 0 } })
        XLSX.utils.sheet_add_json(wsr, analyticResult?.result.right.score_6!!, { header: header, origin: { r: 9, c: 1 } })
        analyticResult?.result.right.right_hip.forEach((righthip, index) => {
            if (maxRowRight < righthip.length) {
                maxRowRight = righthip.length
            }
            XLSX.utils.sheet_add_aoa(wsr, [('Hip ' + (index + 1)).split(" ")], { origin: { r: 15, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsr, righthip, { origin: { r: 17, c: 0 + (index * 4) } })
        })
        analyticResult?.result.right.right_knee.forEach((rightknee, index) => {
            XLSX.utils.sheet_add_aoa(wsr, [('Knee ' + (index + 1)).split(" ")], { origin: { r: maxRowRight + 21, c: 0 + (index * 4) } })
            XLSX.utils.sheet_add_json(wsr, rightknee, { origin: { r: maxRowRight + 23, c: 0 + (index * 4) } })
        })
        return wsr
    }

    const exportExcel = async () => {
        sendIsLoading(true)
        const wsl: XLSX.WorkSheet = createLeftWorkSheet()
        const wsr: XLSX.WorkSheet = createRightWorkSheet()
        const wb: XLSX.WorkBook = XLSX.utils.book_new(wsl, 'left')
        XLSX.utils.book_append_sheet(wb, wsr, 'right', true)
        const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        saveAs(blob, 'AiGA_Execel_' + analyticResult?.history_id + '.xlsx')
        sendIsLoading(false)
    }

    return (
        <div id="exportExcel">
            <button className="btn btn-primary export-Excel" type="button" onClick={exportExcel} disabled={disable}>Export Excel</button>
        </div>
    )
}
export default ExportExcel