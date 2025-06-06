import React, { useState } from 'react'
import { toast } from "react-toastify";
// import logoLeft from '../assets/images/logoLeft.png'
import { Link, useNavigate } from 'react-router-dom'


import signLogo from '../assets/images/signLogo.png'
import axios from 'axios';
const URL = process.env.REACT_APP_URL;

const SignUp = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [activeField, setActiveField] = useState("");
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

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validateForm = () => {
    const { firstname, lastname, email, mobile, password, confirmPassword } = formData;
    const passwordRules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
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

    // if (mobile.trim() === '') {
    //   errors.mobile = 'Mobile number is required.';
    // } else {
    //   const mobilePattern = /^\+?[1-9]\d{1,14}$/;

    //   const sanitizedMobile = mobile.replace(/[\s\-()]/g, '');

    //   if (!mobilePattern.test(sanitizedMobile)) {
    //     errors.mobile = 'Invalid mobile number.';
    //   }
    // }


    if (mobile.trim() === '') {
      errors.mobile = 'Mobile number is required.';
    } else {
      // Remove spaces, dashes, parentheses
      const sanitizedMobile = mobile.replace(/\D/g, '');

      // Check if it's a 10-digit number
      if (sanitizedMobile.length === 10) {
        // Convert to (XXX) XXX-XXXX format
        const formattedMobile = `(${sanitizedMobile.slice(0, 3)}) ${sanitizedMobile.slice(3, 6)}-${sanitizedMobile.slice(6)}`;

        // You can save or display this formatted number as needed
        console.log("Formatted:", formattedMobile); // or setFormattedMobile(formattedMobile)
      } else {
        errors.mobile = 'Please enter a valid 10-digit mobile number.';
      }
    }



    if (!passwordRules.hasUpperCase || !passwordRules.hasLowerCase || !passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
      errors.password = "";
    }

    if (password.trim() === '') {
      errors.password = 'Password is required.';
    }
    // if (password.length < 8) {
    //   errors.password = "Password must be at least 8 characters long.";
    // }
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

    if (name === 'password') {
      const pwd = value;
      setPasswordValidations({
        minLength: pwd.length >= 8,
        hasUpperCase: /[A-Z]/.test(pwd),
        hasLowerCase: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecialChar: /[^A-Za-z0-9]/.test(pwd),
      });
    }

    if (name === 'mobile') {
      // Remove all non-digit characters
      const cleaned = value.replace(/\D/g, '');

      // Format as (XXX) XXX-XXXX
      let formatted = cleaned;
      if (cleaned.length <= 3) {
        formatted = cleaned;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }

      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

      if (response.status === 201 || response.status === 200) {
        const message = response.status === 201
          ? 'Code has been sent to your email. Please verify to continue.'
          : 'A new code has been sent. Please verify to complete registration.';

        toast.success(message);
        localStorage.setItem("email", formData.email);

        // Delay navigation so the toast is visible
        setTimeout(() => {
          navigate('/verify-otp');
        }, 1000);
      } else if (response.status === 409) {
        toast.error("This email is already registered and verified. Please log in.");

        setTimeout(() => {
          navigate('/');
        }, 1000);
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
          {/* <div className="col-lg-6 sign-left-bg justify-content-center d-none d-lg-flex align-items-center">
            <img src={logoLeft} alt="" className="" />
          </div> */}
          <div className="col-lg-6 mx-auto sign-right-bg position-relative pt-4 pb-5">
            <div className="row h-100 w-100">
              <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto d-block d-md-flex justify-content-center align-items-center">
                <div className="w-100">
                  <div className="text-center mb-5">
                    <img src={signLogo} alt="" className="sign-logo" />
                  </div>
                  <h3 className="fw-semibold">Register Now</h3>
                  <h6 className="mb-4 text-445B64">Please enter your details to create an account.</h6>
                  {/* Business */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='bussiness' name='bussiness' value={formData.bussiness} onChange={handleChange} placeholder="Business name (optional)" aria-label="example" />
                  </div>
                  {/* first name */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='firstname' name='firstname' value={formData.firstname} onChange={handleChange} placeholder="First name" aria-label="example" required />
                    {formErrors.firstname && <small className="text-danger">{formErrors.firstname}</small>}
                  </div>
                  {/* Middle name */}
                  <div className="mb-3">
                    <input className="form-control rounded-3" type="text" id='middlename' name='middlename' value={formData.middlename} onChange={handleChange} placeholder="Middle name (optional)" aria-label="example" />
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
                  {/* <div className="mb-3">
                    <input className="form-control rounded-3" type="number" id='mobile' name='mobile' value={formData.mobile} onChange={handleChange} placeholder="Your phone number" aria-label="example" required />
                    {formErrors.mobile && <small className="text-danger">{formErrors.mobile}</small>}
                  </div> */}


                  <div className="mb-3">
                    <input
                      className="form-control rounded-3"
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      aria-label="example"
                      required
                    />
                    {formErrors.mobile && <small className="text-danger">{formErrors.mobile}</small>}
                  </div>


                  {/* Password */}
                  <div className="mb-3 position-relative">
                    <input
                      className="form-control rounded-3"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        setActiveField("password");
                      }}
                      placeholder="Password"
                      aria-label="example"
                      required
                    />
                    <span
                      className="position-absolute top-0 end-0"
                      style={{ cursor: 'pointer', margin: '14px' }}
                      onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </span>
                    {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                    {activeField === "password" && (
                      <div className="text-muted small mb-4">
                        Your password must include
                        <li className={passwordValidations.minLength ? "text-success ms-1" : "text-danger ms-1"}>at least 8 characters</li>
                        <li className={passwordValidations.hasUpperCase ? "text-success ms-1" : "text-danger ms-1"}>an uppercase letter</li>
                        <li className={passwordValidations.hasLowerCase ? "text-success ms-1" : "text-danger ms-1"}>a lowercase letter</li>
                        <li className={passwordValidations.hasNumber ? "text-success ms-1" : "text-danger ms-1"}>a number</li>
                        <li className={passwordValidations.hasSpecialChar ? "text-success ms-1" : "text-danger ms-1"}>a special character</li>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3 position-relative">
                    <input
                      className="form-control rounded-3"
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        handleChange(e);
                        setActiveField("confirmPassword");
                      }}
                      placeholder="Confirm your password"
                      aria-label="example"
                      required
                    />
                    <span
                      className="position-absolute top-0 end-0"
                      style={{ cursor: 'pointer', margin: '14px' }}
                      onClick={() => setshowPassword(!showPassword)}
                    >
                      <EyeIcon visible={showPassword} />
                    </span>
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

                  <h6 className="text-center text-445B64 mb-3">Already have an account? <Link to='/' className='text-00C7BE text-decoration-none'> Sign in</Link></h6>
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