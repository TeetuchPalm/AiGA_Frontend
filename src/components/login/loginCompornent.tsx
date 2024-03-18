import { ReactElement, useState } from "react"
import { IUserSignInRequest } from "../../interfaces/User"
import swal from "sweetalert2"
import { signIn } from "../../services/api/aigaService"
import "./loginComponent.scss"
import LoadingModal from "../loading/loading"


interface IProps {
  sendLogin: (signInRequest: IUserSignInRequest, showlogin: boolean, showOTP: boolean) => void
}

function LoginComponent({ sendLogin }: IProps): ReactElement {
  const [singInRequest, setSingInRequest] = useState<IUserSignInRequest>({
    username: "",
    password: ""
  })
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.MouseEvent<any>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await signIn(singInRequest)
      setIsLoading(false)
      if (response.message === "OTP") {
        sendLogin(singInRequest, false, true)
      } else {
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('test', JSON.stringify(response))
        window.location.href = "/patient"
      }
    } catch (error: any) {
      setIsLoading(false)
      if (error.code === "ERR_BAD_REQUEST") {
        swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response.data.errorMessage,
        })
        if (error.response.data.errorMessage === "Wrong password") {
          setInvalidPassword(true)
        }
        else {
          setInvalidUsername(true)
          setInvalidPassword(true)
        }
      } else {
        swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.code,
        })
      }
    }
  }

  return (
    <>
      <div id="login">
        <LoadingModal showLoadingModal={isLoading} />
        <section className="position-relative py-4 py-xl-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col">
                <img className="d-xxl-flex justify-content-xxl-center" src="src/assets/img/AiGAlogowhite.svg" style={{ width: "135px" }} width="135" height="55.8" />
              </div>
            </div>
            <div className="row d-flex justify-content-center" style={{ marginLeft: "-60px", marginRight: "-60px" }}>
              <div className="col-8 col-xl-4 col-xxl-4" style={{ maxWidth: '500px' }}>
                <div className="card login-card">
                  <div className="card-body d-flex flex-column align-items-center" style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}>
                    <div className="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-people">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"></path>
                    </svg></div>
                    <h1 className="fw-bold" style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}>Login</h1>
                    <hr style={{ width: "80px", marginTop: "0px", height: "2px", color: "var(--bs-primary-text-emphasis)", marginBottom: "8px" }} />
                    <form className="text-center" style={{ paddingLeft: "0px" }}>
                      <p className="text-center">Welcome back!&nbsp;Login to access the AiGA.</p>
                      <div className="mb-3">
                        <p className="text-start" style={{ textAlign: "center", marginTop: "0px", marginBottom: "0px" }}>Username</p><input className="form-control" type="text" placeholder="username" onChange={e => { setSingInRequest({ ...singInRequest, username: e.target.value }); setInvalidUsername(false) }} style={{ borderColor: invalidUsername ? "red" : "inherit" }} />
                      </div>
                      <div className="mb-3">
                        <div className="password-label">
                          <p className="text-start" style={{ textAlign: "center", marginTop: "0px", marginBottom: "0px" }}>Password</p>
                          <p className="text-start forget-password" style={{ textAlign: "center", marginTop: "0px", marginBottom: "0px" }}>{<a href={"/forget/password"}>forget password?</a>}</p>
                        </div>
                        <input className="form-control" type="password" placeholder="password" onChange={e => { setSingInRequest({ ...singInRequest, password: e.target.value }); setInvalidPassword(false) }} style={{ borderColor: invalidPassword ? "red" : "inherit" }} />
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary d-block w-100" type="submit" onClick={handleSubmit}>Login</button>
                        </div>
                    </form>
                    <p className="text-center">Don't have an account? {<a href={"/register"}>Sign up</a>}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LoginComponent