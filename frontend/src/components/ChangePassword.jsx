import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
const url = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const ChangePassword = () => {
    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);



    const handlesave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/auth/change-password`, {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred while submitting the form');
            }
        }
    }


    const passwordValidation = {
        minLength: newPassword.length >= 8,
        upperCase: /[A-Z]/.test(newPassword),
        lowerCase: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        specialChar: /[^A-Za-z0-9]/.test(newPassword),
    };

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

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
        <div className="">
            <form>
                {/* Old Password */}
                <div className="mb-4">
                    <label className="form-label d-flex justify-content-between">
                        Old Password
                    </label>
                    <div className="input-group">
                        <input
                            type={showOld ? 'text' : 'password'}
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowOld(!showOld)}>
                            <EyeIcon visible={showOld} />
                        </span>
                    </div>
                </div>

                {/* New Password */}
                <div className="mb-2">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                        <input
                            type={showNew ? 'text' : 'password'}
                            className={`form-control ${isPasswordValid ? '' : 'border border-danger'}`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowNew(!showNew)}>
                            <EyeIcon visible={showNew} />
                        </span>
                    </div>
                    {!isPasswordValid && (
                        <div className="form-text text-danger mt-1">
                            Please add all necessary characters to create safe password.
                        </div>
                    )}
                </div>

                {/* Password Criteria */}
                <ul className="text-muted small ps-4 mb-4">
                    <li className={passwordValidation.minLength ? "text-muted" : "text-danger"}>Minimum characters 8</li>
                    <li className={passwordValidation.upperCase ? "text-muted" : "text-danger"}>One uppercase character</li>
                    <li className={passwordValidation.lowerCase ? "text-muted" : "text-danger"}>One lowercase character</li>
                    <li className={passwordValidation.specialChar ? "text-muted" : "text-danger"}>One special character</li>
                    <li className={passwordValidation.number ? "text-muted" : "text-danger"}>One number</li>
                </ul>

                {/* Confirm New Password */}
                <div className="mb-4">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowConfirm(!showConfirm)}>
                            <EyeIcon visible={showConfirm} />
                        </span>
                    </div>
                </div>

                {/* Change Password Button */}
                <button
                    type="submit"
                    className="btn sign-btn theme-btn w-100 mb-3"
                    onClick={handlesave}
                    disabled={!isPasswordValid || newPassword !== confirmPassword}
                >
                    Change Password
                </button>



            </form>
        </div>
    );
};

export default ChangePassword;
