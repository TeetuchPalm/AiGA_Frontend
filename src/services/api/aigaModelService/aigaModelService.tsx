import { IHistoryModelRequest } from "../../../interfaces/history/History";
import axios from "axios";

const modelAxios = axios.create()
export const createModelData = async (request: IHistoryModelRequest) => {
    await modelAxios.post("https://model.aiga-project.site/api/pose/gait_estimate", request)
}