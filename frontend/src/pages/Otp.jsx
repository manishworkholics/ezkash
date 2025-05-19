import React, { useEffect, useState } from 'react';
// import logoLeft from '../assets/images/logoLeft.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signLogo from '../assets/images/signLogo.png'
import { Link } from 'react-router-dom';
const URL = process.env.REACT_APP_URL;

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const [loading, setLoading] = useState(false);
    const [loadingResent, setLoadingResent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);

    useEffect(() => {
        if (timeLeft <= 0) {
            navigate('/email-verification-expired');
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        setLoading(true);
        try {
            const res = await axios.post(`${URL}/auth/verify-otp`, {
                email,
                otp: enteredOtp
            });
            if (res.data.message === "OTP verified. Registration complete.") {
                setTimeout(() => {
                    toast.success("OTP Verified Successfully!")
                }, 1000);
                setTimeout(() => {
                    navigate('/email-verification-successfully');
                }, 2000);
            }
        } catch (err) {
            setTimeout(() => {
                toast.error("OTP Verified Failed. Please enter the correct  OTP!")
            }, 1000);
        } finally {
            setLoading(false)
        }
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem("email");
        if (!email) {
            setTimeout(() => {
                toast.error("Email not found. Please go back and register again.")
            }, 1000);
            return;
        }
        setLoadingResent(true);
        try {
            const res = await axios.post(`${URL}/auth/resend-otp`, {
                email,
            });
            if (res.status === 200) {
                setTimeout(() => {
                    toast.success("otp resent !")
                    setTimeLeft(300);
                    setOtp(new Array(6).fill(""));
                }, 1000);
            } else {
                setTimeout(() => {
                    toast.success("There is some issue in otp the resent!")
                }, 1000);
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            setTimeout(() => {
                toast.error("Failed to resend OTP. Please try again.")
            }, 1000);
        } finally {
            setLoadingResent(false);
        }
    };


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="container-fluid sign-page">
                <div className="row sign-main-container">
                    {/* <div className="col-lg-6 sign-left-bg h-100 justify-content-center d-none d-lg-flex align-items-center">
                        <img src={logoLeft} alt="" className="" />
                    </div> */}
                    <div className="col-lg-6 mx-auto sign-right-bg h-100 bg-EEEEEE position-relative pt-4 pb-5">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
                                <div className="w-100">
                                    <div className="text-center mb-5">
                                        <img src={signLogo} alt="" className="sign-logo" />
                                    </div>
                                    <h3 className="fw-semibold">Welcome!</h3>
                                    <h6 className="mb-4 text-445B64">Please enter code to verify</h6>
                                    <div className="text-center mb-3 text-danger">
                                        Code expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                    </div>
                                    <form onSubmit={handleVerify}>
                                        <div className="d-flex justify-content-around">
                                            {otp.map((data, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control mb-3 rounded-3 otp-input text-center"
                                                    maxLength="1"
                                                    value={otp[index]}
                                                    onChange={e => handleChange(e.target, index)}
                                                    onFocus={e => e.target.select()}
                                                />
                                            ))}
                                        </div>
                                        <button type="submit" className="btn w-100 sign-btn mb-3">  {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Verify Code
                                            </>
                                        ) : (
                                            "Verify"
                                        )}</button>
                                    </form>
                                    <button type="submit" className="btn w-100 sign-btn mb-3" onClick={handleResendOtp}> {loadingResent ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resent Code
                                        </>
                                    ) : (
                                        "Resent Code"
                                    )}</button>
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
        </>
    );
};

export default Otp;
