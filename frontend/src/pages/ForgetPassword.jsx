import React, { useEffect, useState } from 'react';
// import logoLeft from '../assets/images/logoLeft.png';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL = process.env.REACT_APP_URL;

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        newPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const { email, newPassword } = formData;
        let errors = {};
        if (email.trim() === '') {
            errors.email = 'Email is required';
        } else {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!emailPattern.test(email)) {
                errors.email = 'Invalid email format';
            }
        }
        if (newPassword.trim() === '') {
            errors.newPassword = 'Password is required';
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, newPassword } = formData;
        if (!email.trim() || !newPassword.trim()) {
            setTimeout(() => {
                toast.error('Please enter the fields first');
            }, 1000);
            return;
        }
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${URL}/auth/reset-password`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status >= 200 && response.status < 300) {
                setTimeout(() => {
                    toast.success('Password Reset successfully');
                }, 1000);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setTimeout(() => {
                    toast.error("Failed to reset password!");
                }, 2000);
            }
        } catch (error) {
            console.error("Reset password error response:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to reset password!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem("resetEmail");
        if (storedEmail) {
            setFormData(prev => ({ ...prev, email: storedEmail }));
        }
    }, []);

    return (
        <>
            <div className="container-fluid sign-page bg-EEEEEE">
                <div className="row sign-main-container">
                    <ToastContainer position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    {/* <div className="col-lg-6 sign-left-bg h-100 d-flex justify-content-center align-items-center">
                        <img src={logoLeft} alt="" />
                    </div> */}
                    <div className="col-lg-6 mx-auto sign-right-bg h-100 position-relative pt-4 pb-5">
                        <div className="row h-100 w-100">
                            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-block d-md-flex justify-content-center align-items-center">
                                <div className="w-100">
                                    <h3 className="fw-semibold">Forgot Password?</h3>
                                    <h6 className="mb-4 text-445B64">No worries, we’ll help you reset your password.</h6>
                                    <input
                                        className="form-control mb-3 rounded-3"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your email address"
                                        aria-label="example"
                                        readOnly
                                        required
                                    />
                                    {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                                    <input
                                        className="form-control mb-3 rounded-3"
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter New Password"
                                        aria-label="example"
                                        required
                                    />
                                    {formErrors.newPassword && <small className="text-danger">{formErrors.newPassword}</small>}
                                    <button
                                        className="btn w-100 sign-btn mb-3"
                                        onClick={handleSubmit}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Set Password
                                            </>
                                        ) : (
                                            "Set Password"
                                        )}
                                    </button>
                                    <h6 className="text-center text-445B64">
                                        <Link to='/' className='text-00C7BE text-decoration-none'>
                                            <i className="fa-solid fa-chevron-left me-2"></i>
                                            Back to Sign-in
                                        </Link>
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 w-100">
                            <h6 className="text-445B64 text-center">
                                Terms & Conditions • Privacy Policy
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;
