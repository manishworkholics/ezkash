import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import logoLeft from '../assets/images/logoLeft.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';



const URL = process.env.REACT_APP_URL;

const ForgetPassword = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        newPassword: ''
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
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

        if (name === 'newPassword') {
            const validations = {
                minLength: value.length >= 8,
                upperCase: /[A-Z]/.test(value),
                lowerCase: /[a-z]/.test(value),
                number: /\d/.test(value),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            };
            setPasswordValidation(validations);
        }
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
                                        className="form-control rounded-3"
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

                                    <div className="text-muted small mb-3">
                                        Your password must include
                                        <li className={passwordValidation.minLength ? "text-success" : "text-danger"}>Minimum characters 8</li>
                                        <li className={passwordValidation.upperCase ? "text-success" : "text-danger"}>One uppercase character</li>
                                        <li className={passwordValidation.lowerCase ? "text-success" : "text-danger"}>One lowercase character</li>
                                        <li className={passwordValidation.specialChar ? "text-success" : "text-danger"}>One special character</li>
                                        <li className={passwordValidation.number ? "text-success" : "text-danger"}>One number</li>
                                    </div>


                                    <input
                                        className="form-control mb-2 rounded-3"
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    {confirmPassword && formData.newPassword !== confirmPassword && (
                                        <small className="text-danger">Passwords do not match</small>
                                    )}



                                    <button
                                        className="btn w-100 sign-btn mb-3"
                                        onClick={handleSubmit}
                                        disabled={
                                            !Object.values(passwordValidation).every(Boolean) ||
                                            formData.newPassword !== confirmPassword ||
                                            loading
                                        }

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
                                            Back to Sign In
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
