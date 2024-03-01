import axios from 'axios'
import { IRefreshTokenResponse } from '../interfaces/auth/RefreshToken';
import { IResponse } from '../interfaces/Common';

const axiosWithInterceoter = axios
axiosWithInterceoter.defaults.withCredentials = true
axiosWithInterceoter.interceptors.response.use(
    response => response,
    async function (error) {
        console.log("test")
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken: string | null = localStorage.getItem('refreshToken')
                const newToken: IResponse<IRefreshTokenResponse> = await axios.post('http://localhost:8080/api/aiga/auth/refreshtoken', { refreshToken: refreshToken })
                localStorage.setItem('token', newToken.data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${newToken.data.accessToken}`
                return axios(originalRequest)
            } catch (error) {
                localStorage.clear()
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default axiosWithInterceoter