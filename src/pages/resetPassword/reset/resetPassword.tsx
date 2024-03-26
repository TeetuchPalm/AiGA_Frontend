import { ReactElement, useEffect, useState } from "react"
import "./resetPassword.scss"
import { checkResetPasswordToken, resetPassword } from "../../../services/api/aigaService"
import { useNavigate, useParams } from "react-router-dom"
import LoadingModal from "../../../components/loading/loading"
import swal from "sweetalert2"
import logo from "../../../assets/img/AiGAlogowhite.svg"



function ResetPassword(): ReactElement {
    const [password, setPassword] = useState<string>("")
    const [rePassword, setRepassword] = useState<string>("")
    const [passCheck, setPassCheck] = useState<Boolean>(false)
    const [rePassCheck, setRePassCheck] = useState<Boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        } else {
            checkToken()
        }
    }, [])

    useEffect(() => {
        passwordValidate(password)
    }, [password])

    useEffect(() => {
        validateRePassword(rePassword)
    }, [rePassword])

    const passwordValidate = (password: string) => {
        if (password) {
            const regex: RegExp = RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{8,}$")
            const serchfind: boolean = regex.test(password)
            setPassCheck(serchfind)
        } else {
            setPassCheck(true)
        }
    }

    const validateRePassword = (rePassword: string) => {
        if (rePassword) {
            setRePassCheck(password === rePassword)
        } else {
            setRePassCheck(true)
        }
    }

    const validateSubmitBtn = (): boolean => {
        return !passCheck || !rePassCheck || !!!password || !!!rePassword
    }

    const checkToken = async () => {
        try {
            setIsLoading(true)
            const response = await checkResetPasswordToken(token!!)
            if (response.expried === true) {
                setIsLoading(false)
                swal.fire({
                    icon: 'warning',
                    title: 'Reset password token expired',
                    text: 'Please send forget password request again'
                }).then(() => {
                    navigate('/login')
                })
            }
            setIsLoading(false)
        } catch {
            setIsLoading(false)
            swal.fire({
                icon: 'warning',
                title: 'Reset password token is not exist',
                text: 'Please send forget password request first'
            }).then(() => {
                navigate('/login')
            })
        }
    }

    const handleOnSubmit = async () => {
        try {
            setIsLoading(true)
            await resetPassword({
                token: token || '',
                password: password
            })
            setIsLoading(false)
            swal.fire({
                title: "Reset password success",
                text: "Go to login page",
                icon: "success",
            }).then(() => {
                navigate("/login")
            })
        } catch {
            setIsLoading(false)
            navigate('/login')
        }
    }

    return (
        <div id="resetPassword">
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
                                <div className="card-body d-flex flex-column align-items-center">
                                    <h3 className="fw-bold card-header-text">Reset Password</h3>
                                    <hr className="card-hr" />
                                    <div className="text-center card-form">
                                        <p className="text-center">Enter a new password.</p>
                                        <div className="mb-3">
                                            <div className="text-label">
                                                <label>Password</label>
                                                {!passCheck && <div className="req-input">
                                                    <div className="req-text">Need up to 8 character with number</div>
                                                </div>}
                                            </div>
                                            <input className="form-control form-control-user" type="password" name="password" placeholder="Password" style={{ borderColor: !passCheck ? "red" : "var(--bs-border-color)" }} onChange={(e) => { setPassword(e.target.value) }} />
                                        </div>
                                        <div className="mb-3">
                                            <div className="text-label">
                                                <label>Confirm Password</label>
                                                {!rePassCheck && <div className="req-Input">
                                                    <div className="req-text">Confirm password not match</div>
                                                </div>}
                                            </div>
                                            <input className="form-control form-control-user" style={{ borderColor: !rePassCheck ? "red" : "var(--bs-border-color)" }} type="password" onChange={(e) => setRepassword(e.target.value)}
                                                id="verifyPassword" placeholder="Repeat Password" />
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-dark d-block w-100" disabled={validateSubmitBtn()} onClick={handleOnSubmit}>Reset Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )

}

export default ResetPassword