import { ReactElement, useEffect, useState } from "react"
import "./requestReset.scss"
import { forgetPassword } from "../../../services/api/aigaService"
import LoadingModal from "../../../components/loading/loading"
import swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import logo from "../../../assets/img/AiGAlogowhite.svg"



function RequestResetPassword(): ReactElement {
    const [emailCheck, setEmailCheck] = useState<boolean>(false)
    const [email, setEmail] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        isEmail(email)
    }, [email])

    const isEmail = (email: string | null | undefined) => {
        if (email) {
            const regexp: RegExp = RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
            const serchfind: boolean = regexp.test(email)
            setEmailCheck(serchfind)
        }
        else {
            setEmailCheck(true)
        }
    }

    const validateSubmitButton = (): boolean => {
        return !!!email || !emailCheck
    }

    const handleOnSubmit = async () => {
        try {
            setIsLoading(true)
            await forgetPassword(email!!)
            setIsLoading(false)
            swal.fire({
                title: "Success",
                text: "Reset password link sent to your E-mail that expire in 5 minutes",
                icon: "success",
              }).then(() => {
                navigate("/login")
              })
        } catch {
            setIsLoading(false)
        }
    }

    return (
        <div id="requestReset">
            <LoadingModal showLoadingModal={isLoading} />
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col">
                            <img className="d-xxl-flex justify-content-xxl-center" src={logo} style={{ width: "135px" }} width="135" height="55.8" />
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-8 col-xl-4 col-xxl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center request-card" >
                                    <div className="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-shield-lock">
                                        <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56"></path>
                                        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"></path>
                                    </svg>
                                    </div>
                                    <h1 className="fs-3 fw-bold card-header-text" >Forget Password</h1>
                                    <hr className="card-hr" />
                                    <div className="text-center">
                                        <p className="text-center">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                                        <div className="mb-3">
                                            <div className="email-label">
                                                <p className="text-start input-email-label">E-mail</p>
                                                {!emailCheck &&
                                                    <div className="req-email">
                                                        <div className="req-email-text">
                                                            Wrong E-mail format
                                                        </div>
                                                    </div>}
                                            </div>
                                            <input className="form-control form-control-user" type="text" name="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} style={{ borderColor: !emailCheck ? "red" : "var(--bs-border-color)" }} />
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit" disabled={validateSubmitButton()} onClick={handleOnSubmit}>Continue</button>
                                            <button className="btn btn-secondary d-block w-100" style={{marginTop: "5px"}} onClick={() => navigate('/login')}>Back</button>
                                        </div>
                                    </div>
                                    <p className="text-center">Don't have an account? {<a href={"/register"}>Sign Up</a>}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    )

}

export default RequestResetPassword