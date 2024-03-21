import axios from 'axios'
import { IRefreshTokenResponse } from '../interfaces/auth/RefreshToken';
import { IResponse } from '../interfaces/Common';
import { HandleError } from '../interfaces/error/handleError';
import swal from "sweetalert2"

const refreshAxios = axios.create()
refreshAxios.defaults.withCredentials = true
const axiosWithInterceoter = axios.create()
axiosWithInterceoter.defaults.withCredentials = true
axiosWithInterceoter.interceptors.response.use(
    response => response,
    async function (error) {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken: string | null = localStorage.getItem('refreshToken')
                const newToken: IResponse<IRefreshTokenResponse> = await refreshAxios.post('https://api.aiga-project.site/api/aiga/auth/refreshtoken', { refreshToken: refreshToken })
                localStorage.setItem('token', newToken.data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${newToken.data.accessToken}`
                return axios(originalRequest)
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Token has not existed or expired',
                    text: 'Please Login'
                }).then(() => {
                    localStorage.clear()
                    window.location.href = "/login"
                })
            }
        } else if (error.response.status === 400 || error.response.status === 404) {
            const e: HandleError = error as HandleError
            swal.fire({
                icon: 'warning',
                title: 'Failed',
                text: e.response.data.errorMessage
            }) 
        } else if (error.response.status === 500){
            const e: HandleError = error as HandleError
            swal.fire({
                icon: 'error',
                title: 'Erroe',
                text: e.response.data.errorMessage
            }) 
        }
        return Promise.reject(error)
    }
)

export default axiosWithInterceoter