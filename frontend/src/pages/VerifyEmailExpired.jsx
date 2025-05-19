import React, { useState } from 'react';
// import logoLeft from '../assets/images/logoLeft.png';
import emailVerifyExpired from '../assets/images/emailVerifyExpired.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const URL = process.env.REACT_APP_URL;

const VerifyEmailExpired = () => {
    const [loadingResent, setLoadingResent] = useState(false);
    const navigate = useNavigate();

    const handleResendOtp = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        if (!email) {
            toast.error("Email not found. Please go back and register again.");
            return;
        }
        setLoadingResent(true);
        try {
            const res = await axios.post(`${URL}/auth/resend-otp`, { email });
            if (res.status === 200) {
                toast.success("OTP resent!");
                setTimeout(() => {
                    navigate('/verify-otp');
                }, 1500);
            } else {
                toast.error("There is some issue in OTP resend!");
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoadingResent(false);
        }
    };

    return (
        <div className="container-fluid sign-page bg-EEEEEE">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="row sign-main-container">
                {/* <div className="col-lg-6 sign-left-bg h-100 justify-content-center d-none d-lg-flex align-items-center">
                    <img src={logoLeft} alt="" className="" />
                </div> */}
                <div className="col-lg-6 mx-auto sign-right-bg h-100 bg-EEEEEE position-relative pt-4 pb-5">
                    <div className="row h-100 w-100">
                        <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
                            <div className="w-100 text-center">
                                <img src={emailVerifyExpired} alt="" className="mb-3" style={{ width: '70px' }} />
                                <h5 className="fw-semibold">Email verification link expired</h5>
                                <h6 className="mb-4 text-445B64 fs-14">Looks like the email verification link has expired. No worries we can send the link again.</h6>
                                <button
                                    onClick={handleResendOtp}
                                    className="btn w-100 sign-btn mb-3"
                                    disabled={loadingResent}
                                >
                                    {loadingResent ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resending...
                                        </>
                                    ) : (
                                        "Resend verification link"
                                    )}
                                </button>
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
            </div>
        </div>
    );
};

export default VerifyEmailExpired;
