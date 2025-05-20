import React, { useState } from 'react';
// import logoLeft from '../assets/images/logoLeft.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signLogo from '../assets/images/signLogo.png'
const URL = process.env.REACT_APP_URL;

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

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
        setFormData({ ...formData, [name]: value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email.trim() || !password.trim()) {
            setTimeout(() => {
                toast.error('Please fill in all required fields.');
            }, 1000)
            return;
        }
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${URL}/admin/login`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status >= 200 && response.status < 300) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("adminId", response.data.adminId);
                setTimeout(() => {
                    toast.success('Signed in successfully.');
                }, 1000);
                setTimeout(() => {
                    navigate('/cm-admin/dashboard');
                }, 2000);
            } else {
                setTimeout(() => {
                    toast.error("Sign-in failed. Please try again.");
                }, 2000);
            }
        } catch (error) {
            console.log("User not registered. Please try again!", error);
            toast.error(error.response?.data?.message || 'User not registered. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="container-fluid sign-page bg-EEEEEE">
                <div className="row sign-main-container">
                    {/* <div className="col-lg-6 sign-left-bg h-100 d-none d-lg-flex justify-content-center align-items-center">
                        <img src={logoLeft} alt="" className="" />
                    </div> */}
                    <div className="col-lg-6 mx-auto sign-right-bg h-100 position-relative pt-4 pb-5">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-block d-md-flex justify-content-center align-items-center">
                                <div className="w-100">
                                    <div className="text-center mb-5">
                                        <img src={signLogo} alt="" className="sign-logo" />
                                    </div>
                                    <h3 className="fw-semibold">Welcome!</h3>
                                    <h6 className="mb-4 text-445B64">Please enter your credentials to log in</h6>

                                    <input
                                        className="form-control mb-3 rounded-3"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="Your email address"
                                        aria-label="example"
                                        required
                                    />

                                    <div className="position-relative mb-3">
                                        <input
                                            className="form-control mb-1 rounded-3"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Your password"
                                            aria-label="example"
                                            required
                                        />
                                        <span
                                            className="position-absolute end-0 top-0 mt-3 me-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={togglePasswordVisibility}
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-445B64`}></i>
                                        </span>
                                    </div>

                                    {/* <h6 className="text-end text-445B64 mb-3">
                                        <Link to="/cm-admin/" className="text-00C7BE text-decoration-none">
                                            Forget Password
                                        </Link>
                                    </h6> */}

                                    <button type="button" className="btn w-100 sign-btn mb-3" onClick={handleSubmit} disabled={loading}>
                                        {loading ? 'Processing...' : 'Sign In'}
                                    </button>
                                    {/* <h6 className="text-center text-445B64">
                                        Don't have an account?
                                        <Link to="/cm-admin/sign-up" className="text-00C7BE text-decoration-none"> Sign up</Link>
                                    </h6> */}
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 w-100">
                            <h6 className="text-445B64 text-center">
                                <Link to="/cm-admin/terms&conditions" className='text-445B64 text-decoration-none'>Terms & Conditions</Link>
                                <span className="mx-2">•</span>
                                <Link to="/cm-admin/privacy-policy" className='text-445B64 text-decoration-none'>Privacy Policy</Link>
                            </h6>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default SignIn