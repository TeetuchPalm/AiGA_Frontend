import React, { ReactElement, useEffect, useState } from "react"
import { getAllRole, signUp } from "../../services/api/aigaService"
import swal from "sweetalert2"
import Select from "react-select"
import './registor.css'
import { IUserSignUpRequest } from "../../interfaces/User"
import { IRoleResponse } from "../../interfaces/Role"
import { IReactSelect } from "../../interfaces/general-component/reactSelectInterface"
import { HandleError } from "../../interfaces/error/handleError"
import LoadingModal from "../../components/loading/loading"
import { useNavigate } from "react-router-dom"
import { set } from "lodash"
function Register(): ReactElement {
  const [userSignUpRequest, setUserSignUpRequest] = useState<IUserSignUpRequest>({
    username: null,
    password: null,
    email: null,
    isOTP: false,
    firstname: null,
    lastname: null,
    role: undefined
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [roleOptions, setRoleOptions] = useState<IReactSelect[]>([])
  const [selectedRole, setSelectedRole] = useState<IReactSelect | null>(null)
  const [password, setPassword] = useState<string>("")
  const [rePassword, setRepassword] = useState<string>("")
  const [passCheck, setPassCheck] = useState<Boolean>(false)
  const [rePassCheck, setRePassCheck] = useState<Boolean>(false)
  const [emailCheck, setEmailCheck] = useState<Boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRole()
  }, [])

  useEffect(() => {
    passwordValidate(password)
  }, [password])

  useEffect(() => {
    isEmail(userSignUpRequest.email)
  }, [userSignUpRequest.email])

  useEffect(() => {
    validateRePassword(rePassword)
  }, [rePassword])

  const fetchRole = async () => {
    try {
      setIsLoading(true)
      const response: IRoleResponse[] = await getAllRole()
      setRoleOptions(response.map(role => (
        { label: role.name, value: role.id.toString() }
      )))
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      const error: HandleError = e as HandleError
      swal.fire({
        icon: 'error',
        title: 'Failed Error code: ' + error.response.data.errorCode,
        text: error.response.data.errorMessage
      })
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const request = userSignUpRequest
      request.password = password
      console.log(request)
      await signUp(request)
      setIsLoading(false)
      swal.fire({
        title: "Register Success",
        text: "Wait for Admin activate account before use",
        icon: "success",
      }).then(() => {
        navigate("/login")
      })
      
    } catch (e) {
      setIsLoading(false)
      const error: HandleError = e as HandleError
      swal.fire({
        icon: 'error',
        title: 'Failed Error code: ' + error.response.data.errorCode,
        text: error.response.data.errorMessage
      })
    }
  }
  const validateSubmitBtn = (): boolean => {
    return !!!userSignUpRequest.username || !!!userSignUpRequest.password || !!!userSignUpRequest.firstname || !!!userSignUpRequest.lastname ||
      !!!userSignUpRequest.email || !!!userSignUpRequest.role || !passCheck || !rePassCheck || !!!password || !!!rePassword
  }

  const isEmail = (email: string | null) => {
    if (email) {
      const regexp: RegExp = RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      const serchfind: boolean = regexp.test(email)
      setEmailCheck(serchfind)
    }
    else {
      setEmailCheck(true)
    }
  }

  const formatOptionLabel = (option: IReactSelect): React.JSX.Element => {
    return (
      <div>
        {option.label}
      </div>
    )
  }

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

  return (
    <>
      <div id="register">
        <LoadingModal showLoadingModal={isLoading} />
        <div className="container">
          <div className="row d-flex d-xl-flex justify-content-center justify-content-xl-center">
            <div className="col-sm-12 col-lg-10 col-xl-9 col-xxl-7 bg-white shadow-lg" style={{ borderRadius: "5px" }}>
              <div className="p-5">
                <div className="text-center">
                  <h4 className="text-dark mb-4" style={{ fontWeight: "bold" }}>Create an Account</h4>
                </div>
                <div className="mb-3"><label>Username</label><input className="form-control form-control-user" type="text" name="username" placeholder="Username" onChange={(e) => setUserSignUpRequest({ ...userSignUpRequest, username: e.target.value })} /></div>
                <div className="mb-3"><div className="email-label"><label>E-mail</label>{!emailCheck && <div className="req-email"><div className="req-email-text">Wrong E-mail format</div></div>}</div><input className="form-control form-control-user" type="text" name="email" placeholder="Email" onChange={(e) => setUserSignUpRequest({ ...userSignUpRequest, email: e.target.value })} style={{ borderColor: !emailCheck ? "red" : "var(--bs-border-color)" }} /></div>
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0"><label>Firstname</label><input className="form-control form-control-user" type="text" name="firstname" placeholder="Firstname" onChange={(e) => setUserSignUpRequest({ ...userSignUpRequest, firstname: e.target.value })} /></div>
                  <div className="col-sm-6"><label>Surname</label><input className="form-control form-control-user" type="text" name="lastname" placeholder="Surname" onChange={(e) => setUserSignUpRequest({ ...userSignUpRequest, lastname: e.target.value })} /></div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0"><div className="password-label"><label>Password</label>{!passCheck && <div className="req-password"><div className="req-password-text">up to 8 character with number</div></div>}</div>
                    <input className="form-control form-control-user" type="password" name="password" placeholder="Password" style={{ borderColor: !passCheck ? "red" : "var(--bs-border-color)" }} onChange={(e) => {setPassword(e.target.value); setUserSignUpRequest({ ...userSignUpRequest, password: e.target.value })}} /></div>
                  <div className="col-sm-6"><div className="rePassword-label"><label>Re-Password</label>{!rePassCheck && <div className="req-rePassword"><div className="req-rePassword-text">Re-Password Not match</div></div>}</div><input className="form-control form-control-user" style={{ borderColor: !rePassCheck ? "red" : "var(--bs-border-color)" }} type="password" onChange={(e) => setRepassword(e.target.value)}
                    id="verifyPassword" placeholder="Repeat Password" /></div>
                </div>
                <div className="mb-3">
                  <div>Role</div>
                  <Select
                    className="role-select"
                    inputId="structure"
                    isSearchable={true}
                    options={roleOptions}
                    formatOptionLabel={formatOptionLabel}
                    onChange={(value: IReactSelect | null) => {
                      setSelectedRole(value)
                      setUserSignUpRequest({ ...userSignUpRequest, role: value?.label })
                    }}
                    value={selectedRole}
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={userSignUpRequest.isOTP} onChange={() => setUserSignUpRequest({ ...userSignUpRequest, isOTP: !userSignUpRequest.isOTP })} />
                    <label className="form-check-label">Want to use 2 Factor Authentication</label>
                  </div>
                </div>
                <button className="btn btn-primary d-block btn-user w-100" id="submitBtn" disabled={validateSubmitBtn()} onClick={handleSubmit}>Create an Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Register