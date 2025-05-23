import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signLogo from '../assets/images/signLogo.png'
import { Link } from 'react-router-dom';
const URL = process.env.REACT_APP_URL;

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const [loading, setLoading] = useState(false);
    const [loadingResent, setLoadingResent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);

    useEffect(() => {
        if (timeLeft <= 0) { navigate('/email-verification-expired'); return; }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, navigate]);

    const handleChange = (element, index) => {
        const value = element.value;
        if (!/^\d*$/.test(value)) return; // Only allow digits

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').trim();
        if (!/^\d+$/.test(paste)) return;

        const pastedOtp = paste.slice(0, 6).split('');
        const newOtp = [...otp];
        for (let i = 0; i < pastedOtp.length; i++) {
            newOtp[i] = pastedOtp[i];
        }
        setOtp(newOtp);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "") {
                if (index > 0) {
                    const prevInput = e.target.previousSibling;
                    if (prevInput) {
                        prevInput.focus();
                    }
                }
            }
            let newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };
    const isOtpComplete = otp.every(val => val.trim() !== '');


    const handleVerify = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        setLoading(true);
        try {
            const res = await axios.post(`${URL}/auth/verify-otp`, {
                email,
                otp: enteredOtp
            });
            if (res.status === 200) {
                setTimeout(() => {
                    toast.success("Code Verified Successfully!")
                }, 1000);
                setTimeout(() => {
                    navigate('/email-verification-successfully');
                }, 2000);
            }
        } catch (err) {
            setTimeout(() => {
                toast.error("Code verification failed. Please enter the correct code.")
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
                    toast.success("Code has been resent successfully.")
                    setTimeLeft(300);
                    setOtp(new Array(6).fill(""));
                }, 1000);
            } else {
                setTimeout(() => {
                    toast.success("There was a problem resending the Code. Please try again.")
                }, 1000);
            }
        } catch (error) {
            setTimeout(() => {
                toast.error("Failed to resend Code. Please try again.")
            }, 1000);
        } finally {
            setLoadingResent(false);
        }
    };


    return (
        <>
            <div className="container-fluid sign-page bg-EEEEEE">
                <div className="row sign-main-container">

                    <div className="col-lg-6 mx-auto sign-right-bg h-100 bg-EEEEEE position-relative pt-4 pb-5">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
                                <div className="w-100">
                                    <div className="text-center mb-5">
                                        <img src={signLogo} alt="" className="sign-logo" />
                                    </div>
                                    <h3 className="fw-semibold">Email Verification</h3>
                                    <h6 className="mb-4 text-445B64">Enter the 6-digit code sent to your email address.</h6>


                                    <form onSubmit={handleVerify}>
                                        <div className="d-flex justify-content-around">
                                            {otp.map((data, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className={`form-control mb-3 rounded-3 otp-input text-center ${data ? 'border-success' : 'border-danger'}`}
                                                    maxLength="1"
                                                    value={otp[index]}
                                                    onChange={e => handleChange(e.target, index)}
                                                    onKeyDown={e => handleKeyDown(e, index)}
                                                    onPaste={handlePaste}
                                                    onFocus={e => e.target.select()}
                                                />
                                            ))}


                                        </div>
                                        
                                        <button type="submit" className="btn w-100 sign-btn mb-3" disabled={!isOtpComplete || loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Verifying...
                                                </>
                                            ) : (
                                                "Verify"
                                            )}
                                        </button>

                                    </form>

                                    <button type="submit" className="btn w-100 sign-btn mb-3" onClick={handleResendOtp}> {loadingResent ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resend Code
                                        </>
                                    ) : (
                                        "Resend Code"
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
        </>
    );
};

export default Otp;
