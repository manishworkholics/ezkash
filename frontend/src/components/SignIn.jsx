import React, { useState } from 'react';
import { toast } from "react-toastify";
// import logoLeft from '../assets/images/logoLeft.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


import signLogo from '../assets/images/signLogo.png'

const URL = process.env.REACT_APP_URL;

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const validateForm = () => {
    const { email, password } = formData;
    let errors = {};
    if (email.trim() === '') {
      errors.email = 'Email is required.';
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        errors.email = 'Invalid email address format.';
      }
    }
    if (password.trim() === '') {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`${URL}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status >= 200 && response.status < 300) {
        try {
          // Try to use localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("userId", response.data.userId);
          document.cookie = `userId=${response.data.userId}; path=/; max-age=86400`; // 1 day
        } catch (err) {

          // Fallback to sessionStorage
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("role", response.data.role);
          sessionStorage.setItem("userId", response.data.userId);
        }


        toast.success('Signed in successfully.');
        setTimeout(() => {
          navigate('/checks');
        }, 2000);
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
    } catch (error) {
      console.log("Sign-in error:", error);
      toast.error(error.response?.data?.message || 'User not registered. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${URL}/auth/forget-password`, { email: forgotEmail });
      if (response.status >= 200 && response.status < 300) {
        toast.success('Verification code sent to your email');
        localStorage.setItem("resetEmail", forgotEmail);
        setTimeout(() => {
          navigate('/forget-password-verification');
        }, 2000);
      } else {
        toast.error('Failed to send code.');
      }
    } catch (error) {
      console.error('Code sending error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while sending the code');
    } finally {
      setLoading(false);
    }
  };


  const EyeIcon = ({ visible }) => (
    <>
      {visible ? (
        <i className="fa-solid fa-eye"></i>
      ) : (
        <i className="fa-solid fa-eye-slash"></i>
      )}
    </>
  );

  return (
    <>

      <div className="container-fluid sign-page bg-EEEEEE">
        <div className="row sign-main-container">
          {/* <div className="col-lg-6 sign-left-bg h-100 justify-content-center d-none d-lg-flex align-items-center">
            <img src={logoLeft} alt="logo" />
          </div> */}

          <div className="col-lg-6 mx-auto sign-right-bg h-100 position-relative pt-4 pb-5">
            <div className="row h-100 w-100">
              <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-block d-md-flex justify-content-center align-items-center">
                <div className="w-100">
                  {showForgotPassword ? (
                    <>
                      <div className="text-center mb-5">
                        <img src={signLogo} alt="" className="sign-logo" />
                      </div>
                      <h3 className="fw-semibold">Forgot password</h3>
                      <h6 className="mb-4 text-445B64">Enter your email to receive a verification code</h6>
                      <input
                        className="form-control mb-3 rounded-3"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      <button className="btn w-100 sign-btn mb-3" onClick={handleForgetPassword}>
                        {loading ? 'Sending Code...' : 'Send Code'}
                      </button>
                      <h6 className="text-center text-445B64">
                        <span
                          className="text-00C7BE text-decoration-none"
                          onClick={() => setShowForgotPassword(false)}
                          style={{ cursor: 'pointer' }}
                        >
                          Back to Sign In
                        </span>
                      </h6>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-5">
                        <img src={signLogo} alt="" className="sign-logo" />
                      </div>
                      <h3 className="fw-semibold">Welcome!</h3>
                      <h6 className="mb-4 text-445B64">Enter your email and password to sign in</h6>
                      <div className=" mb-3">
                        <input
                          className="form-control rounded-3"
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                      </div>

                      <div className=" mb-3">
                        <div className="input-group">
                          <input
                            className="form-control mb-1 rounded-3"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Your password"
                          />
                          <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setshowPassword(!showPassword)}>
                            <EyeIcon visible={showPassword} />
                          </span>
                        </div>
                        {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                      </div>

                      <h6 className="text-end text-445B64 mb-4">
                        <span
                          className="text-00C7BE text-decoration-none"
                          onClick={() => setShowForgotPassword(true)}
                          style={{ cursor: 'pointer' }}
                        >
                          Forgot your password?
                        </span>
                      </h6>
                      <button className="btn w-100 sign-btn mb-3" onClick={handleSubmit}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                      <h6 className="text-center text-445B64">
                        Don't have an account?
                        <Link to="/sign-up" className="text-00C7BE text-decoration-none"> Sign up</Link>
                      </h6>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="position-absolute bottom-0 start-0 w-100">
              <h6 className="text-445B64 text-center">
                <Link to="/terms&conditions" className='text-445B64 text-decoration-none'>Terms and Conditions</Link>
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

export default SignIn;
