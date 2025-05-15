import React from 'react'
import logoLeft from '../assets/images/logoLeft.png'
import emailVerified from '../assets/images/emailVerified.png'
import { Link } from 'react-router-dom'

const VerifyEmailSuccess = () => {
    const email = localStorage.getItem('email')
    return (
        <>
            <div className="container-fluid sign-page">
                <div className="row sign-main-container">
                    <div className="col-lg-6 sign-left-bg h-100 justify-content-center d-none d-lg-flex align-items-center">
                        <img src={logoLeft} alt="" className="" />
                    </div>
                    <div className="col-lg-6 sign-right-bg h-100 bg-EEEEEE position-relative">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
                                <div className="w-100 text-center">
                                    <img src={emailVerified} alt="" className="mb-3" style={{ width: '70px' }} />
                                    <h5 className="text-center fw-semibold">Account verified</h5>
                                    <h6 className="mb-4 text-445B64 fs-14 text-center">Congratulations! your email account <br />
                                        <span className="fw-bolder text-0D161A">{email}</span> has been verified.</h6>
                                    <Link to='/' className="btn w-100 sign-btn mb-3">Continue to your account</Link>
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 w-100">
                            <h6 className="text-445B64 text-center">Terms & Conditions • Privacy Policy</h6>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default VerifyEmailSuccess