import React, { useEffect, useState } from 'react';
import logoLeft from '../assets/images/logoLeft.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div className="container-fluid sign-page">
      <ToastContainer />
      <div className="row sign-main-container">
        <div className="col-lg-6 sign-left-bg d-flex align-items-center justify-content-center">
          <img src={logoLeft} alt="Logo" />
        </div>
        <div className="col-lg-6 bg-EEEEEE">
          <div className="w-75 mx-auto mt-5">
            <h3>Welcome!</h3>
            <h6 className="mb-4">Reset Password</h6>
            <input className="form-control mb-3" type="email" value={email} readOnly />
            <input className="form-control mb-2" type="number" value={otp} placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
            <button className="btn w-100 btn-primary" onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordVerification;
