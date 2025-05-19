// import React, { useEffect, useState } from 'react'
// import logoLeft from '../assets/images/logoLeft.png'
import emailVerifyImg from '../assets/images/emailVerifyImg.png'
import { Link } from 'react-router-dom'
// import axios from 'axios';

const email = localStorage.getItem('email');

const VerifyEmail = () => {
    //     const [userData, setUserData] = useState(null);
    //      useEffect(() => {
    //         const fetchUser = async () => {
    //             try {
    //                 const userId = localStorage.getItem("userId")
    //                 const res = await axios.get(`${URL}/auth/get-venderById/${userId}`);
    //                 setUserData(res.data.data);
    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         };

    //         fetchUser();
    //     }, []);
    return (
        <>
            <div className="container-fluid sign-page">
                <div className="row sign-main-container">
                    {/* <div className="col-lg-6 sign-left-bg h-100 justify-content-center d-none d-lg-flex align-items-center">
                        <img src={logoLeft} alt="" className="" />
                    </div> */}
                    <div className="col-lg-6 mx-auto sign-right-bg h-100 bg-EEEEEE position-relative pt-4 pb-5">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
                                <div className="w-100 text-center">
                                    <img src={emailVerifyImg} alt="" className="mb-3" style={{ width: '70px' }} />
                                    <h5 className="text-center fw-semibold">Verify your Email</h5>
                                    <h6 className="mb-4 text-445B64 fs-14 text-center">We’ve sent an email to <span className="fw-bolder text-0D161A">{email}</span> Continue account creations using the link via email.</h6>
                                    <Link to='/email-verification-expired' className="btn w-100 sign-btn mb-3">Resend Email</Link>
                                    <Link to='/email-verification-successfully' className="btn w-100 sign-btn bg-white shadow-none text-0D161A mb-3" style={{ border: '1px solid #9E9E9E' }}>Change Email</Link>
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 w-100">
                            <h6 className="text-445B64 text-center">
                                <Link to="/terms&conditions" className='text-445B64 text-decoration-none'>Terms & Conditions</Link>
                                <span className="mx-2">•</span>
                                <Link to="/privacy-policy" className='text-445B64 text-decoration-none'>Privacy Policy</Link>
                            </h6>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default VerifyEmail