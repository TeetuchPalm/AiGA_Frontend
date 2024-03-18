import React, { ReactElement, useEffect} from 'react'
import { Navigate, Route, Routes, useLocation, redirect} from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/register'
import CreateHistory from './pages/history/create/CreateHistory'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { IUserJWT } from './interfaces/User'
import jwtDecode from 'jwt-decode'
import PatientList from './pages/patient/list/PatientList'
import PatientCreate from './pages/patient/create/PatientCreate'
import PatientEdit from './pages/patient/edit/PatientEdit'
import ListHistory from './pages/history/list/ListHistory'
import DetailHistory from './pages/history/detail/DetailHistory'
import AnalyticsHistory from './pages/history/detail/analytics/analyticsHistory'
import PatientDetail from './pages/patient/detail/PatientDetail'
import AdminPage from './pages/admin/AdminPage'
import AnalyticsHistoryResearcher from './pages/history/detail/analytics/researcher/analyticsHistoryResearcher'
import CreateHistoryPatient from './pages/history/create/createHistoryPatient'
import RequestResetPassword from './pages/resetPassword/requestReset/requestReset'
import ResetPassword from './pages/resetPassword/reset/resetPassword'
function RequireAuth({ children }: { children: ReactElement}): ReactElement {
    const { pathname } = useLocation()
    const withouNavRoutes = ["/login", "/register"];
    if(localStorage.getItem('token') === null && !withouNavRoutes.some((item) => pathname.includes(item))) {
        return <Navigate to="/login" state={{ from: pathname }} replace />
    }
    // useEffect(() => {
    //     dayjs.extend(timezone)
    //     dayjs.extend(utc)
    //     const bangkokTimeZone: string = 'Asia/Bangkok'
    //     const token: string = localStorage.getItem('token') ?? ''
    //     const now = dayjs(new Date()).tz(bangkokTimeZone)
        // const userDetail: IUserJWT = jwtDecode(token) as IUserJWT
    //     const expired = dayjs.unix(userDetail['exp'] ?? now.unix()).tz(bangkokTimeZone) ?? 0
    //     const diff = expired.diff(now)
    //     if(diff <= 0) {
    //         localStorage.clear()
    //         window.location.href = "/login"
    //     }
    // }, [])
    return children
}

function RoleAuth({ children, roles }: { children: ReactElement, roles: Array<string> }): ReactElement {
    const { pathname } = useLocation()
    const token: string | null = localStorage.getItem('token')
    if(token) {
        const userDetail: IUserJWT = jwtDecode(token) as IUserJWT
        if(!roles.includes(userDetail.role)) {
            return <Navigate to="/patient" state={{ from: pathname }} replace />
        }
    }
    return children
}

function Router(): ReactElement {
    return (
        <Routes>
            <Route path='/patient' element={<RequireAuth><PatientList/></RequireAuth>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/history/create' element={<RequireAuth><CreateHistory/></RequireAuth>}/>
            <Route path='/history/create/patient/:id' element={<RequireAuth><CreateHistoryPatient/></RequireAuth>}/>
            <Route path='/history' element={<RequireAuth><ListHistory/></RequireAuth>}/>
            <Route path='/admin' element={<RequireAuth><RoleAuth roles={["ROLE_ADMIN"]}><AdminPage/></RoleAuth></RequireAuth>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/patient/create' element={<RequireAuth><PatientCreate/></RequireAuth>}/>
            <Route path='/history/:id' element={<RequireAuth><DetailHistory/></RequireAuth>}/>
            <Route path='/patient/:id/edit' element={<RequireAuth><PatientEdit/></RequireAuth>}/>
            <Route path='/patient/:id' element={<RequireAuth><PatientDetail/></RequireAuth>}/>
            <Route path='/history/:id/analytics/clinician' element={<RequireAuth><AnalyticsHistory/></RequireAuth>}/>
            <Route path='/history/:id/analytics/researcher' element={<RequireAuth><AnalyticsHistoryResearcher/></RequireAuth>}/>
            <Route path='/forget/password' element={<RequestResetPassword/>}/>
            <Route path='/reset/password/:token' element={<ResetPassword/>}/>
            <Route path="*" element={<Navigate to='/patient' replace/>}/>
        </Routes>
    )
}
export default Router