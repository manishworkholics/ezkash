import React, { useState } from 'react'
import logoLeft from '../assets/images/logoLeft.png'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
const URL = process.env.REACT_APP_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bussiness: '',
    firstname: '',
    lastname: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const { bussiness, firstname, lastname, name, email, mobile, password, confirmPassword } = formData;
    let errors = {};
    if (bussiness.trim() === '') {
      errors.bussiness = 'Business name is required';
    }
    if (firstname.trim() === '') {
      errors.firstname = 'First Name is required';
    }
    if (lastname.trim() === '') {
      errors.lastname = 'Last Name is required';
    }
    if (name.trim() === '') {
      errors.name = 'User Name is required';
    }
    if (email.trim() === '') {
      errors.email = 'Email is required';
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        errors.email = 'Invalid email format';
      }
    }
    if (mobile.trim() === '') {
      errors.mobile = 'Phone number is required';
    } else {
      const mobilePattern = /^[0-9]{10}$/;
      if (!mobilePattern.test(mobile)) {
        errors.mobile = 'Invalid mobile number';
      }
    }
    if (mobile.length !== 10) {
      errors.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (password.trim() === '') {
      errors.password = 'Password is required';
    }
    if (password.length < 6) {
      errors.password = "Password must 6 digits long";
    }
    if (confirmPassword.trim() === '') {
      errors.confirmPassword = "Confirm Password must be required";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Password do not match";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bussiness, firstname, lastname, name, email, mobile, password, confirmPassword } = formData;
    if (!bussiness.trim() || !firstname.trim() || !lastname.trim() || !name.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
      setTimeout(() => {
        toast.error('Please enter the fields first');
      }, 1000)
      return;
    }
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).lenght > 0) {
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(`${URL}/admin/register`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log("response", response);
      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => {
          toast.success('Admin Register successfully');
        }, 1000);
        setTimeout(() => {
          navigate('/cd-admin/');
          localStorage.setItem("email", formData.email)
        }, 2000);
      } else {
        setTimeout(() => {
          toast.error('Failed to register admin')
        }, 2000);
      }
    } catch (error) {
      console.log("Error in register user", error);
      if (error.response && error.response.status === 409) {
        toast.error('User already registered');
      } else if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error in register user');
      }
    }
  }

  return (
    <>
      <div className="container-fluid sign-page">
        <div className="row sign-main-container">
          <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <div className="col-lg-6 sign-left-bg h-100 d-flex justify-content-center align-items-center">
            <img src={logoLeft} alt="" className="" />
          </div>
          <div className="col-lg-6 h-100 bg-EEEEEE position-relative">
            <div className="row h-100">
              <div className="col-lg-6 mx-auto d-flex justify-content-center align-items-center">
                <div className="w-100">
                  <h3 className="fw-semibold">Register now</h3>
                  <h6 className="mb-4 text-445B64">Please enter your credentials to sign up</h6>
                  {/* Business */}
                  <input className="form-control mb-3 rounded-3" type="text" id='bussiness' name='bussiness' value={formData.bussiness} onChange={handleChange} placeholder="Business name" aria-label="example" required />
                  <input className="form-control mb-3 rounded-3" type="text" id='firstname' name='firstname' value={formData.firstname} onChange={handleChange} placeholder="First name" aria-label="example" required />
                  <input className="form-control mb-3 rounded-3" type="text" id='lastname' name='lastname' value={formData.lastname} onChange={handleChange} placeholder="Last name" aria-label="example" required />
                  <input className='form-control mb-3 rounded-3' type='text' id='name' name='name' value={formData.name} onChange={handleChange} placeholder='User name' aria-label='example' required />
                  <input className="form-control mb-3 rounded-3" type="email" id='email' name='email' value={formData.email} onChange={handleChange} placeholder="Your email address" aria-label="example" required />
                  <input className="form-control mb-3 rounded-3" type="number" id='mobile' name='mobile' value={formData.mobile} onChange={handleChange} placeholder="Your Phone number" aria-label="example" required />
                  <input className="form-control mb-3 rounded-3" type="password" id='password' name='password' value={formData.password} onChange={handleChange} placeholder="Password" aria-label="example" required />
                  <input className="form-control mb-3 rounded-3" type="password" id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" aria-label="example" required />
                  <button type="button" className="btn w-100 sign-btn mb-3" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Processing...' : 'Sign Up'}
                  </button>

                  <h6 className="text-center text-445B64 mb-3">Don't have an account? <Link to='/cheque-management/' className='text-00C7BE text-decoration-none'> Sign in</Link></h6>
                </div>
              </div>
            </div>
            <div className="position-absolute bottom-0 start-0 w-100">
              <h6 className="text-445B64 text-center">Terms & Conditions • Privacy Policy</h6>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default SignUp