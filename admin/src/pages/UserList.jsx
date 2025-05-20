import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const URL = process.env.REACT_APP_URL;

const UserList = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        bussiness: '',
        status: 'active',
        role: '',
        otp: ''
    });

    const rowsPerPage = 10;

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(users.length / rowsPerPage);

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

    const handleAddUser = async () => {
        try {
            const response = await axios.post(`${URL}/admin/add-user`, newUser);
            if (response.status >= 200 && response.status < 300) {
                toast.success("User added successfully!");
                setShowModal(false);
                setNewUser({
                    firstname: '',
                    lastname: '',
                    mobile: '',
                    email: '',
                    password: '',
                    bussiness: '',
                    isActive: '',
                    role: '',
                });
                fetchUsers();
            }
        } catch (error) {
            toast.error("Failed to add user: " + error.message);
            console.error("Add user error", error);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [])

    const filteredUsers = users.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.firstname?.toLowerCase().includes(search) ||
            item.lastname?.toLowerCase().includes(search) ||
            item.mobile?.toString().toLowerCase().includes(search) ||
            item.email?.toLowerCase().includes(search) ||
            item.bussiness?.toLowerCase().includes(search) ||
            item.role?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search) ||
            item.otp?.toString().toLowerCase().includes(search)
        )
    })

    return (
        <>
            <div className="container-fluid">
                <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                                                        <div className="col-12 col-md-3">
                                                            <div className="d-flex justify-content-between mb-lg-0">
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
                                                        <div className="col-12 col-md-9">
                                                            <div className="row">
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
                                                                            {/* <th scope="col" className="text-center">
                                                                                <input className="form-check-input table-checkbox"
                                                                                    type="checkbox" value="" id="flexCheckDefault" />
                                                                            </th> */}
                                                                            <th scope="col" className="text-445B64">#</th>
                                                                            <th scope="col" className="text-445B64">Name</th>
                                                                            <th scope="col" className="text-445B64">Phone Number</th>
                                                                            <th scope="col" className="text-445B64">Email Address</th>
                                                                            <th scope="col" className="text-445B64">Company Name</th>
                                                                            <th scope="col" className="text-445B64">Status</th>
                                                                            <th scope="col" className="text-445B64">Role</th>
                                                                            {/* <th scope="col" className="text-445B64">OTP</th> */}
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
                                                                            filteredUsers.map((user, index) => (
                                                                                <tr key={user._id}>
                                                                                    {/* <td className="text-center">
                                                                                        <input className="form-check-input table-checkbox" type="checkbox" />
                                                                                    </td> */}
                                                                                    <td>{indexOfFirstRow + index + 1}</td>
                                                                                    <td>{user?.firstname} {user?.lastname}</td>
                                                                                    <td>{user?.mobile}</td>
                                                                                    <td>{user?.email}</td>
                                                                                    <td>{user?.bussiness}</td>
                                                                                    <td>{user?.isActive ? "active" : "not active"}</td>
                                                                                    <td>{user?.role}</td>
                                                                                    {/* <td>{user?.otp}</td> */}
                                                                                    <td>
                                                                                        <div className="d-flex justify-content-center">
                                                                                            <Link to={`/cm-admin/user-information/${user._id}`} className="btn border-0">
                                                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                                                            </Link>
                                                                                            <button className="btn" onClick={() => handleDeleteUser(user._id)}>
                                                                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                            </button>
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
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New User</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">First Name</label>
                                                    <input type="text" className="form-control" value={newUser.firstname} onChange={e => setNewUser({ ...newUser, firstname: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Last Name</label>
                                                    <input type="text" className="form-control" value={newUser.lastname} onChange={e => setNewUser({ ...newUser, lastname: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone Number</label>
                                                    <input type="text" className="form-control" value={newUser.mobile} onChange={e => setNewUser({ ...newUser, mobile: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Email Address</label>
                                                    <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Password</label>
                                                    <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Business</label>
                                                    <input type="text" className="form-control" value={newUser.bussiness} onChange={e => setNewUser({ ...newUser, bussiness: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Role</label>
                                                    <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                                        <option value="">Select Role</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="vendor">Vendor</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Status</label>
                                                    <select className="form-select" value={newUser.isActive} onChange={e => setNewUser({ ...newUser, isActive: e.target.value })}>
                                                        <option value="true">Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </form>
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