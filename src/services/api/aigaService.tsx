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
import { ITagParams, ITagResponse } from "../../interfaces/patient/tag/Tag";
import { IGroupParams, IGroupResponse } from "../../interfaces/history/group/Group";
import qs from "qs"

export const signIn = async (request: IUserSignInRequest | undefined): Promise<IUser> => {
    const response: IUserResponse = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/auth/signin", request)
    return response.data
}

export const signUp = async (request: IUserSignUpRequest | undefined): Promise<IUserSignUpResponse> => {
    const response: IResponse<IUserSignUpResponse> = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/auth/signup", request)
    return response.data

}

export const download = async (request: IFileDownloadRequest | undefined): Promise<Blob> => {
    const response = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/fileStorage/download", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token"),
                Accept: 'video/webm; codecs=vp9'
            },
            responseType: "blob"
        })
    return response.data
}

export const createHistory = async (request: ICreateHistoryRequest | undefined): Promise<IHistoryResponse> => {
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/histories", request, { headers: { Authorization: 'Bearer ' + localStorage.getItem("token") } })
    return response.data
}

export const upload = async (request: File): Promise<IApiResponse> => {
    const formData = new FormData();
    formData.append("video", request)
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/fileStorage/upload", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getPatients = async (params: IPatientParams): Promise<IPageResponse<IPatientResponse[]>> => {
    const response: IResponse<IPageResponse<IPatientResponse[]>> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/patients",
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
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/patients", request,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getPatientById = async (id: string): Promise<IPatientResponse> => {
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/patients/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
        })
    return response.data
}

export const deletePatient = async (id: string): Promise<IApiResponse> => {
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.delete("http://localhost:8080/api/aiga/patients/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const editPatient = async (request: IPatientRequest, id: string): Promise<IPatientResponse> => {
    const response: IResponse<IPatientResponse> = await axiosWithInterceoter.patch("http://localhost:8080/api/aiga/patients/" + id, request,
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
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.put("http://localhost:8080/api/aiga/histories/" + historyId, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getHistories = async (params: IHistoryParams): Promise<IPageResponse<IHistoryResponse[]>> => {
    const response: IResponse<IPageResponse<IHistoryResponse[]>> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/histories",
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
    const response: IResponse<IApiResponse> = await axiosWithInterceoter.delete("http://localhost:8080/api/aiga/histories/" + id,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        })
    return response.data
}

export const getDiagnosisData = async (id: string): Promise<IHistoryModelResponse> => {
    const response: IResponse<IHistoryModelResponse> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/histories/diagnosis/" + id, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
    return response.data
}

export const getHistoryById = async (id: string): Promise<IHistoryResponse> => {
    const response: IResponse<IHistoryResponse> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/histories/" + id, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
    return response.data
}

export const otpVerify = async (otp: string, username: string): Promise<IUser> => {
    const response: IUserResponse = await axiosWithInterceoter.post("http://localhost:8080/api/aiga/auth/otp", { username: username, otp: otp })
    return response.data
}

export const refreshOTP = async (username: string) => {
    await axiosWithInterceoter.post("http://localhost:8080/api/aiga/auth/reset/otp", { username: username })
}

export const logoutRef = async (refreshToken: string) => {
    await axiosWithInterceoter.post("http://localhost:8080/api/aiga/auth/logout", { refreshToken: refreshToken })
}

export const getAllRole = async (): Promise<IRoleResponse[]> => {
    const response: IResponse<IRoleResponse[]> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/roles")
    return response.data
}

export const getClinicians = async (params: IClinicianParams): Promise<IPageResponse<IClinicianResponse[]>> => {
    const response: IResponse<IPageResponse<IClinicianResponse[]>> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/clinicians", {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
        params: params
    })
    return response.data
}

export const updateAvailable = async (request: IClinicianRequest, id: number) => {
    await axiosWithInterceoter.patch("http://localhost:8080/api/aiga/clinicians/" + id, request, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
    })
}

export const getAllPageTag = async (params: ITagParams): Promise<IPageResponse<ITagResponse[]>> => {
    const response: IResponse<IPageResponse<ITagResponse[]>> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/tags",
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
    const response: IResponse<IPageResponse<IGroupResponse[]>> = await axiosWithInterceoter.get("http://localhost:8080/api/aiga/groups",
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
