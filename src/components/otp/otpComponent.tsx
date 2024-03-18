import { ReactElement, useEffect, useRef, useState } from "react";
import { otpVerify, refreshOTP } from "../../services/api/aigaService";
import { IUser } from "../../interfaces/User";
import { HandleError } from "../../interfaces/error/handleError";
import swal from "sweetalert2"
import "./otpComponent.scss"
import LoadingModal from "../loading/loading";
interface IProps {
    username: string
}
export default function OTPComponent({ username }: IProps): ReactElement {
    const [otp, setOtp] = useState<string>()
    const [counter, setCounter] = useState(60)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (counter <= 0) {
            return
        }

        const timeout = setTimeout(() => {
            setCounter(counter - 1)
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [counter])

    useEffect(() => {
        startCountdown()
    }, [])



    const handleOnSubmit = async () => {
        const otpResponse: IUser = await otpVerify(otp!!, username)
        localStorage.setItem('token', otpResponse.token)
        localStorage.setItem('refreshToken', otpResponse.refreshToken)
        localStorage.setItem('test', JSON.stringify(otpResponse))
        window.location.href = "/patient"
    }

    const startCountdown = () => {
        setCounter(60)
    }

    const resendOTP = async () => {
        try {
            setIsLoading(true)
            await refreshOTP(username)
            swal.fire('resend OTP Success').then(() => {
                startCountdown()
                setIsLoading(false)
            })
        } catch (e) {
            setIsLoading(false)
        }
    }

    const validateInputNumberOnly = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault()
        }
    }

    return (
        <div id="otpComponent">
            <LoadingModal showLoadingModal={isLoading} />
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col">
                            <div className="otp-image">
                                <img className="d-xxl-flex justify-content-xxl-center" src="src/assets/img/AiGAlogowhite.svg" width="135" height="55.8" />
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center otp-content">
                        <div className="col-8 col-xl-4 col-xxl-4" style={{maxWidth: '500px'}}>
                            <div className="card">
                                <div className="card-body d-flex flex-column align-items-center otp-card">
                                    <div className="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-123">
                                        <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138m6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z"></path>
                                    </svg></div>
                                    <h1 className="fs-5 otp-card-header">Two-Factor Authentication</h1>
                                    <div className="text-center">
                                        <p className="text-start text-muted otp-card-title" >A authentication code has been sent to your mail. Please check your inbox and enter a&nbsp;code below. The code will expire in {counter} .&nbsp;</p>
                                        <p className="text-start otp-card-input-label" >Enter a authentication code:</p>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="otp"
                                                placeholder="Enter a code"
                                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => validateInputNumberOnly(event)}
                                                onChange={(e) => setOtp(e.target.value)} />
                                        </div>
                                        <div className="mb-3"></div><button className="btn btn-primary d-block w-100 otp-card-submit-button" onClick={handleOnSubmit}>Login</button>
                                    </div>
                                    <p className="text-start otp-card-resend" onClick={resendOTP}>Resend code</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )

}