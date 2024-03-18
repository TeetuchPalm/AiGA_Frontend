import axios from "axios";
import { IUser, IUserResponse, IUserSignInRequest, IUserSignUpRequest, IUserSignUpResponse } from "../../interfaces/User";
import { IFileDownloadRequest } from "../../interfaces/File";
import { ICreateHistoryRequest, IHistoryParams, IHistoryResponse } from "../../interfaces/history/History";
import { IApiResponse } from "../../interfaces/ApiResponse";
import { IPatientParams, IPatientRequest, IPatientResponse } from "../../interfaces/patient/Patient";
import { IResponse } from "../../interfaces/Common";
import { IPageResponse } from "../../interfaces/paginate/Page";
import { IHistoryModelResponse } from "../../interfaces/history/historyModel/historyModel";
import axiosWithInterceoter from "../../axios/axiosWithIntercepter";
import { IRoleResponse } from "../../interfaces/Role";
import { IClinicianParams, IClinicianRequest, IClinicianResponse } from "../../interfaces/clinician/Clinician";
import { ITagParams, ITagRequest, ITagResponse } from "../../interfaces/patient/tag/Tag";
import { IGroupParams, IGroupRequest, IGroupResponse } from "../../interfaces/history/group/Group";
import qs from "qs"
import { ICheckResetPasswordResponse, IResetPasswordRequest } from "../../interfaces/auth/ResetPassword";

const axiosNoIntercepter = axios.create()
axiosNoIntercepter.defaults.baseURL = 'https://ec2-13-228-142-11.ap-southeast-1.compute.amazonaws.com:8080/api/aiga'
axiosWithInterceoter.defaults.baseURL = 'https://ec2-13-228-142-11.ap-southeast-1.compute.amazonaws.com:8080/api/aiga'
axiosNoIntercepter.defaults.withCredentials = true
export const signIn = async (request: IUserSignInRequest | undefined): Promise<IUser> => {
    const response: IUserResponse = await axiosNoIntercepter.post("/auth/signin", request)
    return response.data
}

export const signUp = async (request: IUserSignUpRequest | undefined): Promise<IUserSignUpResponse> => {
    const response: IResponse<IUserSignUpResponse> = await axiosNoIntercepter.post("/auth/signup", request)
    return response.data

}

export const download = async (request: IFileDownloadRequest | undefined): Promise<Blob> => {
    const response = await axiosWithInterceoter.post("/fileStorage/download", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token"),
                Accept: 'video/mp4; codecs=vp9'
            },
            responseType: "blob"
        })
    return response.data
}

export const createHistory = async (request: ICreateHistoryRequest | undefined): Promise<IHistoryResponse> => {
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.post("/histories", request, { headers: { Authorization: 'Bearer ' + localStorage.getItem("token") } })
    return response.data
}

export const upload = async (request: File): Promise<IApiResponse> => {
    const formData = new FormData();
    formData.append("video", request)
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.post("/fileStorage/upload", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getPatients = async (params: IPatientParams): Promise<IPageResponse<IPatientResponse[]>> => {
    const response: IResponse<IPageResponse<IPatientResponse[]>> = await axiosWithInterceoter.get("/patients",
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        })
    return response.data
}

export const createPatient = async (request: IPatientRequest): Promise<IPatientResponse> => {
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.post("/patients", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getPatientById = async (id: string): Promise<IPatientResponse> => {
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.get("/patients/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
        })
    return response.data
}

export const deletePatient = async (id: string): Promise<IApiResponse> => {
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.delete("/patients/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const editPatient = async (request: IPatientRequest, id: string): Promise<IPatientResponse> => {
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.patch("/patients/" + id, request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const uploadToS3 = async (request: File, historyId: number): Promise<IHistoryResponse> => {
    const formData = new FormData();
    formData.append("video", request)
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.put("/histories/" + historyId, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getHistories = async (params: IHistoryParams): Promise<IPageResponse<IHistoryResponse[]>> => {
    const response: IResponse<IPageResponse<IHistoryResponse[]>> = await axiosWithInterceoter.get("/histories",
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        }
    )
    return response.data
}

export const deleteHistories = async (id: string): Promise<IApiResponse> => {
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.delete("/histories/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getDiagnosisData = async (id: string): Promise<IHistoryModelResponse> => {
    const response: IResponse<IHistoryModelResponse> = await axiosWithInterceoter.get("/histories/diagnosis/" + id, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
    return response.data
}

export const getHistoryById = async (id: string): Promise<IHistoryResponse> => {
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.get("/histories/" + id, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
    return response.data
}

export const otpVerify = async (otp: string, username: string): Promise<IUser> => {
    const response: IUserResponse = await axiosWithInterceoter.post("/auth/otp", { username: username, otp: otp })
    return response.data
}

export const refreshOTP = async (username: string) => {
    await axiosWithInterceoter.post("/auth/reset/otp", { username: username })
}

export const logoutRef = async (refreshToken: string) => {
    await axiosWithInterceoter.post("/auth/logout", { refreshToken: refreshToken })
}

export const getAllRole = async (): Promise<IRoleResponse[]> => {
    const response: IResponse<IRoleResponse[]> = await axiosWithInterceoter.get("/roles")
    return response.data
}

export const getClinicians = async (params: IClinicianParams): Promise<IPageResponse<IClinicianResponse[]>> => {
    const response: IResponse<IPageResponse<IClinicianResponse[]>> = await axiosWithInterceoter.get("/clinicians", {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
        params: params
    })
    return response.data
}

export const updateAvailable = async (request: IClinicianRequest, id: number) => {
    await axiosWithInterceoter.patch("/clinicians/" + id, request, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
}

export const getAllPageTag = async (params: ITagParams): Promise<IPageResponse<ITagResponse[]>> => {
    const response: IResponse<IPageResponse<ITagResponse[]>> = await axiosWithInterceoter.get("/tags",
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        })
    return response.data
}

export const getAllPageGroup = async (params: IGroupParams): Promise<IPageResponse<IGroupResponse[]>> => {
    const response: IResponse<IPageResponse<IGroupResponse[]>> = await axiosWithInterceoter.get("/groups",
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        })
    return response.data
}

export const createGroupHistory = async (request: IGroupRequest): Promise<IGroupResponse> => {
    const response: IResponse<IGroupResponse> = await axiosWithInterceoter.post("/groups", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const createTagPatient = async (request: ITagRequest): Promise<ITagResponse> => {
    const response: IResponse<ITagResponse> = await axiosWithInterceoter.post("/tags", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const forgetPassword = async (email: string) => {
    await axiosWithInterceoter.post("/auth/forget/password",
        {
            email: email
        })
}

export const resetPassword = async (request: IResetPasswordRequest) => {
    await axiosWithInterceoter.patch("/auth/reset/password", request)
}

export const checkResetPasswordToken = async (token: string): Promise<ICheckResetPasswordResponse> => {
    const response: IResponse<ICheckResetPasswordResponse> = await axiosNoIntercepter.get("/auth/check/reset/" + token)
    return response.data
}
