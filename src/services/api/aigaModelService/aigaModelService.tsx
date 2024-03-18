import { IHistoryModelRequest } from "../../../interfaces/history/History";
import axiosWithInterceoter from "../../../axios/axiosWithIntercepter";
import axios from "axios";

const modelAxios = axios.create()
export const createModelData = async (request: IHistoryModelRequest) => {
    await modelAxios.post("http://18.143.98.53:8001/api/pose/gait_estimate", request)
}