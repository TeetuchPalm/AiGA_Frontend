import React, { ReactElement, useState } from "react"
import { signIn } from "../../services/api/aigaService"
import swal from "sweetalert2"
import './login.css'
import LoginComponent from "../../components/login/loginCompornent"
import { IUserSignInRequest } from "../../interfaces/User"
import OTPComponent from "../../components/otp/otpComponent"
function Login(): ReactElement {
  const [isShowLogin, setIsShowLogin] = useState<boolean>(true)
  const [isShowOTP, setIsShowOTP] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")

  return (
    <>
    {isShowLogin && <LoginComponent sendLogin = {(signInRequest: IUserSignInRequest, showlogin: boolean, showOTP: boolean) => {
        setIsShowLogin(showlogin)
        setIsShowOTP(showOTP)
        setUsername(signInRequest.username)
      }}/>}
    {isShowOTP && <OTPComponent username={username}/>}
    </>
  )
}
export default Login