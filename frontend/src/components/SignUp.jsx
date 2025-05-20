import React, { useState } from 'react'
// import logoLeft from '../assets/images/logoLeft.png'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signLogo from '../assets/images/signLogo.png'
import axios from 'axios';
const URL = process.env.REACT_APP_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bussiness: '',
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  // const [setPasswordValidations] = useState({
  //   minLength: false,
  //   hasUpperCase: false,
  //   hasLowerCase: false,
  //   hasNumber: false,
  //   hasSpecialChar: false,
  // });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validateForm = () => {
    const { firstname, lastname, email, mobile, password, confirmPassword } = formData;
    // const passwordRules = {
    //   minLength: password.length >= 12,
    //   hasUpperCase: /[A-Z]/.test(password),
    //   hasLowerCase: /[a-z]/.test(password),
    //   hasNumber: /[0-9]/.test(password),
    //   hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    // };
    let errors = {};

    if (firstname.trim() === '') {
      errors.firstname = 'First name is required.';
    }

    if (lastname.trim() === '') {
      errors.lastname = 'Last name is required.';
    }
    if (email.trim() === '') {
      errors.email = 'Email is required.';
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        errors.email = 'Invalid email address format.';
      }
    }
    
    if (mobile.trim() === '') {
      errors.mobile = 'Mobile number is required.';
    } else {
      const mobilePattern = /^\+?[1-9]\d{1,14}$/;

      const sanitizedMobile = mobile.replace(/[\s\-()]/g, '');

      if (!mobilePattern.test(sanitizedMobile)) {
        errors.mobile = 'Invalid mobile number.';
      }
    }
    // if (!passwordRules.hasUpperCase || !passwordRules.hasLowerCase || !passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
    //   errors.password = "Password must include uppercase, lowercase, a number, and a special character.";
    // }

    if (password.trim() === '') {
      errors.password = 'Password is required.';
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
    if (confirmPassword.trim() === '') {
      errors.confirmPassword = "Confirm password is required.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })

    // if (name === 'password') {
    //   const pwd = value;
    //   setPasswordValidations({
    //     minLength: pwd.length >= 8,
    //     hasUpperCase: /[A-Z]/.test(pwd),
    //     hasLowerCase: /[a-z]/.test(pwd),
    //     hasNumber: /[0-9]/.test(pwd),
    //     hasSpecialChar: /[^A-Za-z0-9]/.test(pwd),
    //   });
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const response = await axios.post(`${URL}/auth/register-vendor`, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        toast.success('Code has been sent to your email. Please verify to continue.');
        localStorage.setItem("email", formData.email);
        navigate('/verify-otp');
      } else if (response.status === 200) {
        toast.success("A new code has been sent. Please verify to complete registration.");
        localStorage.setItem("email", formData.email);
        navigate('/verify-otp');
      } else if (response.status === 409) {
        toast.error("This email is already registered and verified. Please log in.");
        navigate('/'); // Redirect to login instead of OTP
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error('Something went wrong. Please try again later.');
      } else {
        toast.error(error?.response?.data?.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="container-fluid sign-page bg-EEEEEE">
        <div className="row sign-main-container">
          {/* <div className="col-lg-6 sign-left-bg justify-content-center d-none d-lg-flex align-items-center">
            <img src={logoLeft} alt="" className="" />
          </div> */}
          <div className="col-lg-6 mx-auto sign-right-bg bg-EEEEEE position-relative pt-4 pb-5">
            <div className="row h-100 w-100">
              <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-block d-md-flex justify-content-center align-items-center">
                <div className="w-100">
                  <div className="text-center mb-5">
                    <img src={signLogo} alt="" className="sign-logo" />
                  </div>
                  <h3 className="fw-semibold">Register now</h3>
                  <h6 className="mb-4 text-445B64">Please enter your details to sign up</h6>
                  {/* Business */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='bussiness' name='bussiness' value={formData.bussiness} onChange={handleChange} placeholder="Business name (optional)" aria-label="example" required />
                  </div>
                  {/* first name */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='firstname' name='firstname' value={formData.firstname} onChange={handleChange} placeholder="First name" aria-label="example" required />
                    {formErrors.firstname && <small className="text-danger">{formErrors.firstname}</small>}
                  </div>
                  {/* Middle name */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='middlename' name='middlename' value={formData.middlename} onChange={handleChange} placeholder="Middle name (optional)" aria-label="example" required />
                  </div>
                  {/* last name */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='lastname' name='lastname' value={formData.lastname} onChange={handleChange} placeholder="Last name" aria-label="example" required />
                    {formErrors.lastname && <small className="text-danger">{formErrors.lastname}</small>}
                  </div>
                  {/* Email */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="email" id='email' name='email' value={formData.email} onChange={handleChange} placeholder="Your email address" aria-label="example" required />
                    {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                  </div>
                  {/* mobile */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="number" id='mobile' name='mobile' value={formData.mobile} onChange={handleChange} placeholder="Your Phone number" aria-label="example" required />
                    {formErrors.mobile && <small className="text-danger">{formErrors.mobile}</small>}
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="password" id='password' name='password' value={formData.password} onChange={handleChange} placeholder="Password" aria-label="example" required />
                    {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                  </div>
                  {/* Confirm Password */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="password" id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" aria-label="example" required />
                    {formErrors.confirmPassword && <small className="text-danger">{formErrors.confirmPassword}</small>}
                  </div>
                  <button type="button" className="btn w-100 sign-btn mb-3" onClick={handleSubmit}>  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}</button>
                  <h6 className="text-center text-445B64 mb-3">Don't have an account? <Link to='/' className='text-00C7BE text-decoration-none'> Sign in</Link></h6>
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

export default SignUp