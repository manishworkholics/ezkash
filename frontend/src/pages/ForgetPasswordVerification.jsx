import React, { useEffect, useState } from 'react';
// import logoLeft from '../assets/images/logoLeft.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signLogo from '../assets/images/signLogo.png'

const URL = process.env.REACT_APP_URL;

const ForgetPasswordVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("OTP is required.");
      return;
    }
    try {
      const response = await axios.post(`${URL}/auth/verify-otp-for-password`, {
        email,
        otp,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/forget-password');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container-fluid sign-page bg-EEEEEE">
      <ToastContainer />
      <div className="row sign-main-container">
        {/* <div className="col-lg-6 sign-left-bg d-flex align-items-center justify-content-center">
          <img src={logoLeft} alt="Logo" />
        </div> */}
        <div className="col-lg-6 mx-auto sign-right-bg h-100 position-relative pt-4 pb-5">
          <div className="row h-100 w-100">
            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-flex justify-content-center align-items-center">
              <div className="w-100">
                <div className="text-center mb-5">
                  <img src={signLogo} alt="" className="sign-logo" />
                </div>
                <h3>Welcome!</h3>
                <h6 className="mb-4">Reset Password</h6>
                <input className="form-control mb-3" type="email" value={email} readOnly />
                <input className="form-control mb-3" type="number" value={otp} placeholder="Enter code" onChange={(e) => setOtp(e.target.value)} />
                <button className="btn w-100 sign-btn mb-3" onClick={handleVerifyOtp}>Verify Code</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordVerification;
