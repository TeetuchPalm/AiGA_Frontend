import axios from "axios";
import { IHistoryModelRequest } from "../../../interfaces/history/History";
import axiosWithInterceoter from "../../../axios/axiosWithIntercepter";

export const createModelData = async (request: IHistoryModelRequest) => {
    await axiosWithInterceoter.post("http://localhost:8001/api/pose/gait_estimate", request)
}