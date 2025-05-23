import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { toast } from "react-toastify";

const URL = process.env.REACT_APP_URL;

const UserList = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setformData] = useState({ firstname: '', middlename: '', lastname: '', mobile: '', email: '', password: '', confirmPassword: '', bussiness: '', role: 'vender', otp: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/get-all-users`);
            if (response.status >= 200 && response.status < 300) {
                setUsers(response?.data?.data)
            }
        } catch (error) {
            console.log("Error in fetching users", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const filteredUsers = users.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.firstname?.toLowerCase().includes(search) ||
            item.middlename?.toLowerCase().includes(search) ||
            item.lastname?.toLowerCase().includes(search) ||
            item.mobile?.toString().toLowerCase().includes(search) ||
            item.email?.toLowerCase().includes(search) ||
            item.bussiness?.toLowerCase().includes(search) ||
            item.role?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search)

        )
    })

    const indexOfLastRow = currentPage * itemsPerPage;
    const indexOfFirstRow = indexOfLastRow - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Add user Logic


    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const [formErrors, setFormErrors] = useState({});



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

        if (mobile.trim() === '') {
            errors.mobile = 'Mobile number is required.';
        } else {
            const mobilePattern = /^\+?[1-9]\d{1,14}$/;

            const sanitizedMobile = mobile.replace(/[\s\-()]/g, '');

            if (!mobilePattern.test(sanitizedMobile)) {
                errors.mobile = 'Invalid mobile number.';
            }
        }
        if (!passwordRules.hasUpperCase || !passwordRules.hasLowerCase || !passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
            errors.password = "Password must include uppercase, lowercase, a number, and a special character.";
        }

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
        setformData({ ...formData, [name]: value })

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
    };


    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await axios.delete(`${URL}/admin/delete-users/${id}`);
            if (response.status >= 200 && response.status < 300) {
                toast.success("User deleted successfully!");
                fetchUsers();
            }
        } catch (error) {
            toast.error("Error in deleting user: " + error.message);
            console.error("Error in deleting user", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            const { confirmPassword, ...dataToSend } = formData;

            const response = await axios.post(`${URL}/admin/add-user`, dataToSend);
            if (response.status >= 200 && response.status < 300) {
                toast.success("User added successfully!");
                setShowModal(false);
                setformData({
                    firstname: '',
                    middlename: '',
                    lastname: '',
                    mobile: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    bussiness: '',
                    role: '',
                });
                fetchUsers();
            } else if (response.status === 400) {
                toast.error("Email already exists");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'An unexpected error occurred.');
            console.error("Add user error", error);
        }
    };


    return (
        <>
            <div className="container-fluid">
              
                <Header />
                <div className="">
                    <div className="row mh-100vh">
                        <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
                            <Sidebar />
                        </div>
                        <div className="col-lg-9 col-xl-10 bg-F6F6F6">
                            <div className="main-content">
                                <div className="container-fluid p-3 px-2">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card border-0 rounded-3 mb-1">
                                                <div className="card-body p-2">
                                                    <div className="row">

                                                        <div className="col-6 col-md-3 col-lg-3">
                                                            <div className="d-flex justify-content-between mb-2 mb-md-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 16" fill="none">
                                                                            <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-semibold">All User</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6 d-flex justify-content-end align-items-center d-md-none">
                                                            <button
                                                                style={{ background: '#008CFF' }}
                                                                className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0 mb-2'
                                                                onClick={() => setShowModal(true)}
                                                            >
                                                                <i className="fa fa-plus me-2"></i>Add User
                                                            </button>
                                                        </div>

                                                        <div className="col-12 col-md-9 col-lg-9">
                                                            <div className="row justify-content-end">
                                                                <div className="col-md-9">
                                                                    <div className="d-flex position-relative" style={{ width: "100%;" }}>
                                                                        <input className="form-control form-control-sm rounded-3 me-lg-2 shadow-none bg-F0F5F6" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" aria-label="Search" type="search" style={{ paddingLeft: "35px" }} />
                                                                        <i class="fa fa-search text-445B64 position-absolute top-0 start-0" style={{ margin: "8px" }}></i>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3 mt-3 mt-md-0 d-none d-md-flex justify-content-end align-items-center">
                                                                    <button className="btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium" onClick={() => setShowModal(true)} style={{ background: "#008cff" }}><i class="fa fa-plus me-2"></i>Add User</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border-0 rounded-3">
                                                <div className="card-body p-0">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="table-responsive">
                                                                <table className="table rounded-3">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="text-445B64">#</th>
                                                                            <th scope="col" className="text-445B64">Name</th>
                                                                            <th scope="col" className="text-445B64">Phone Number</th>
                                                                            <th scope="col" className="text-445B64">Email Address</th>
                                                                            <th scope="col" className="text-445B64">Company Name</th>
                                                                            <th scope="col" className="text-445B64">Status</th>
                                                                            <th scope="col" className="text-445B64">Role</th>
                                                                            <th scope="col" className="text-445B64 text-center">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {loading ? (
                                                                            <tr>
                                                                                <td colSpan="11" className="text-center py-5">
                                                                                    <div className="spinner-border text-primary" role="status">
                                                                                        <span className="visually-hidden">Loading...</span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ) : filteredUsers.length > 0 ? (
                                                                            currentUsers.map((user, index) => (
                                                                                <tr key={user._id}>
                                                                                    <td>{indexOfFirstRow + index + 1}</td>
                                                                                    <td>{user?.firstname} {user?.lastname}</td>
                                                                                    <td>{user?.mobile}</td>
                                                                                    <td>{user?.email}</td>
                                                                                    <td>{user?.bussiness}</td>
                                                                                    <td>{user?.isActive ? "active" : "not active"}</td>
                                                                                    <td>{user?.role}</td>
                                                                                    <td>
                                                                                        <div className="d-flex justify-content-center">
                                                                                            <Link to={`/cd-admin/user-information/${user._id}`} className="btn border-0">
                                                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                                                            </Link>
                                                                                            <button className="btn" onClick={() => handleDeleteUser(user._id)}>
                                                                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                            </button>
                                                                                            <Link to={`/cd-admin/report/${user._id}`} className="btn border-0">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                                                                                    <path d="M7.875 6.45H12.6875L7.875 1.775V6.45ZM1.75 0.5H8.75L14 5.6V15.8C14 16.2509 13.8156 16.6833 13.4874 17.0021C13.1592 17.3209 12.7141 17.5 12.25 17.5H1.75C1.28587 17.5 0.840752 17.3209 0.512563 17.0021C0.184374 16.6833 0 16.2509 0 15.8V2.2C0 1.2565 0.77875 0.5 1.75 0.5ZM2.625 15.8H4.375V10.7H2.625V15.8ZM6.125 15.8H7.875V9H6.125V15.8ZM9.625 15.8H11.375V12.4H9.625V15.8Z" fill="#008cff" />
                                                                                                </svg>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="11" className='text-center'>No cheques found</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>

                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Pagination Controls */}
                                            <div className="d-block d-lg-flex justify-content-between mt-4 mb-1 pt-2">
                                                <h6 className="mb-3 mb-lg-0 text-445B64">Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, users.length)} of {users.length} entries</h6>
                                                <nav>
                                                    <ul className="pagination justify-content-end">
                                                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                                            <button className="page-link border-0" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                                                <i className="fa-solid fa-angle-left"></i>
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: totalPages }, (_, i) => (
                                                            <li
                                                                key={i + 1}
                                                                className={`page-item ${currentPage === i + 1 && 'active'}`}
                                                            >
                                                                <button className="page-link border-0 mx-1 px-3 rounded-2" onClick={() => setCurrentPage(i + 1)}>
                                                                    {i + 1}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                                                            <button className="page-link border-0" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                                                <i className="fa-solid fa-angle-right"></i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: '#00000096' }}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New User</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="row g-3">

                                            <div className="col-md-6">
                                                <label className="form-label">First Name</label>
                                                <input type="text" className="form-control" name='firstname' value={formData.firstname} onChange={handleChange} placeholder='First name' />
                                                {formErrors.firstname && <small className="text-danger">{formErrors.firstname}</small>}
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Middle Name</label>
                                                <input type="text" className="form-control" name='middlename' value={formData.middlename} onChange={handleChange} placeholder="Middle name (optional)" />

                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Last Name</label>
                                                <input type="text" className="form-control" name='lastname' value={formData.lastname} onChange={handleChange} placeholder="Last name" />
                                                {formErrors.lastname && <small className="text-danger">{formErrors.lastname}</small>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Phone Number</label>
                                                <input type="text" className="form-control" name='mobile' value={formData.mobile} onChange={handleChange} placeholder=" phone number" />
                                                {formErrors.mobile && <small className="text-danger">{formErrors.mobile}</small>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Email Address</label>
                                                <input type="email" className="form-control" name='email' value={formData.email} onChange={handleChange} placeholder=" email address" />
                                                {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Business</label>
                                                <input type="text" className="form-control" name='bussiness' value={formData.bussiness} onChange={handleChange} placeholder="Business name (optional)" />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <select className="form-select" value={formData.role} onChange={e => setformData({ ...formData, role: e.target.value })}>
                                                    <option value="">Select Role</option>
                                                    <option value="vendor">Vendor</option>
                                                    <option value="admin">Admin</option>

                                                </select>
                                            </div>



                                            <div className="col-md-6">
                                                <label className="form-label">Password</label>
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />

                                                <div className="small  mt-2">
                                                    Your password must include
                                                    <span className={passwordValidations.minLength ? "text-success ms-1" : "text-danger ms-1"}>at least 8 characters</span>,
                                                    <span className={passwordValidations.hasUpperCase ? "text-success ms-1" : "text-danger ms-1"}>an uppercase letter</span>,
                                                    <span className={passwordValidations.hasLowerCase ? "text-success ms-1" : "text-danger ms-1"}>a lowercase letter</span>,
                                                    <span className={passwordValidations.hasNumber ? "text-success ms-1" : "text-danger ms-1"}>a number</span>, and
                                                    <span className={passwordValidations.hasSpecialChar ? "text-success ms-1" : "text-danger ms-1"}>a special character</span>.
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Confirm Password</label>
                                                <input type="password" className="form-control" id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                                                {formErrors.confirmPassword && <small className="text-danger">{formErrors.confirmPassword}</small>}
                                            </div>



                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleAddUser}>Save User</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}




                </div>
            </div>
        </>
    )
}

export default UserList