import { IHistoryModelRequest } from "../../../interfaces/history/History";
import axios from "axios";

const modelAxios = axios.create()
export const createModelData = async (request: IHistoryModelRequest) => {
    await modelAxios.post("https://ec2-18-143-98-53.ap-southeast-1.compute.amazonaws.com:8001/api/pose/gait_estimate", request)
}