import { ReactElement, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import "./navbar.css"
import { logoutRef } from "../../services/api/aigaService"
import { IUserJWT } from "../../interfaces/User"
import jwtDecode from "jwt-decode"
import logo from "../../assets/img/AiGalogoblack.svg"
import hamburger from "../../assets/img/burgerMenu.svg"

const NavBar = (): ReactElement => {
    const navigate = useNavigate()
    const [showNavbar, setShowNavbar] = useState(false)
    const { pathname } = useLocation()

    const withouNavRoutes = ["/login", "/register","/forget/password","/reset/password"];

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar)
    }

    const logout = async () => {
        const refToken = localStorage.getItem('refreshToken')
        if(refToken) {
            await logoutRef(refToken)
        }
        navigate('/login')
        localStorage.clear()
    }

    const adminTabShow = (): boolean => {
        const token: string | null = localStorage.getItem('token')
        if(token) {
            const userDetail: IUserJWT = jwtDecode(token) as IUserJWT
            return userDetail.role === 'ROLE_ADMIN'
        } else {
            return false
        }
    }

    if (!withouNavRoutes.some((item) => pathname.includes(item))) {
    return (
        <div id="navbar">
            <nav className="navbar navbar-expand-md fixed-top bg-body py-3">
                <div className="container-fluid">
                    <div className="container">
                        <div className="aiga-image">
                            <img
                                className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                src={logo}
                                width="96"
                                height="55"
                            />
                        </div>
                        <div className="menu-icon" onClick={handleShowNavbar}>
                            <img
                                className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                src={hamburger}
                                width="96"
                                height="55"
                            />
                        </div>
                        <div className={`nav-elements  ${showNavbar && 'active'}`}>
                            <ul>
                                <li>
                                    <NavLink to="/patient" className="nav-item">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="bi bi-person-plus nav-icon"
                                        >
                                            <path
                                                d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                                            ></path>
                                            <path
                                                fillRule="evenodd"
                                                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                                            ></path>
                                        </svg>
                                        <span className="nav-text" >Patient</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/history" className="nav-item">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="bi bi-record-circle nav-icon"
                                        >
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                            ></path>
                                            <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                                        </svg>
                                        <span className="nav-text" >History</span>
                                    </NavLink>
                                </li>
                            </ul>
                            <div className="right-wrap">
                                {adminTabShow() && <NavLink to="/admin" className="nav-item">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        className="bi bi-person-gear nav-icon"
                                    >
                                        <path
                                            d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
                                        ></path>
                                    </svg>
                                    <span className="nav-text" >Admin</span>
                                </NavLink>}
                                <NavLink to="/login" className="nav-item" onClick={logout}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        className="bi bi-power nav-icon"
                                    >
                                        <path d="M7.5 1v7h1V1h-1z"></path>
                                        <path
                                            d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"
                                        ></path>
                                    </svg>
                                    <span className="nav-text" >Logout</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
    } else {
        return <></>
    }
}

export default NavBar