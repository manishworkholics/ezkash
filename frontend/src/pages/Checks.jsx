import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const token = localStorage.getItem('token')
const URL = process.env.REACT_APP_URL;

const Checks = () => {
    const navigate = useNavigate();
    const [checks, setChecks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchChecks = async () => {
        try {
            const vendorId = localStorage.getItem('userId');
            const response = await axios.get(`${URL}/check/get-checkByVenderId/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.data) {
                setChecks(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching check:", error);
        }
    };

    const handleDeleteCheck = async (id) => {
        if (!window.confirm("Are you sure you want to delete this check?")) return;
        try {
            const response = await axios.delete(`${URL}/check/delete-check/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success("Check deleted successfully!");
                fetchChecks();
            }
        } catch (error) {
            toast.error("Error in deleting check: " + error.message);
            console.error("Error in deleting check", error);
        }
    };

    const handleAddCheck = () => {
        navigate("/upload-check");
    };
    
    const handleAddCheckDesk = () => {
        navigate("/dashboard");
    };

    const filteredCheck = checks.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.customerName?.toLowerCase().includes(search) ||
            item.company?.toLowerCase().includes(search) ||
            item.licenseNo?.toString().toLowerCase().includes(search) ||
            item.checkType?.toLowerCase().includes(search) ||
            item.amount?.toString().toLowerCase().includes(search) ||
            item.comment?.toLowerCase().includes(search) ||
            item.date?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        fetchChecks();
    }, []);

    return (
        <div className="container-fluid">
            <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Header />
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
                                                            <div className="table-circular-icon bg-F0F5F6 me-3" style={{ cursor: "pointer" }}>
                                                                <i className="fa fa-list"></i>
                                                            </div>
                                                            <span className="text-445B64 fw-medium">All Checks</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6 d-flex justify-content-end align-items-center d-md-none">
                                                    <button className='btn border-0 rounded-2 bg-E4FFFD text-01A99A py-1 px-2 fs-14 text-445B64 p-0 mb-2' onClick={handleAddCheck}>
                                                        <i className="fa fa-plus me-2"></i>Add Check
                                                    </button>
                                                </div>
                                                <div className="col-12 col-md-9 col-lg-9">
                                                    <div className="row">
                                                        <div className="col-md-9">
                                                            <div className="d-flex position-relative" style={{ width: "100%" }}>
                                                                <input
                                                                    className="form-control form-control-sm rounded-3 me-lg-2 shadow-none bg-F0F5F6"
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    type="search"
                                                                    placeholder="Search"
                                                                    aria-label="Search"
                                                                    style={{ paddingLeft: "35px" }}
                                                                />
                                                                <i className="fa fa-search text-445B64 position-absolute top-0 start-0" style={{ margin: "8px" }}></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 mt-3 mt-md-0 d-none d-md-flex justify-content-end align-items-center">
                                                            <button className='btn btn-light py-1 px-2 fs-14 text-445B64 p-0' onClick={handleAddCheckDesk}>
                                                                <i className="fa fa-plus me-2"></i>Add Check
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="card border-0 rounded-3 mb-1 overflow-hidden">
                                        <div className="card-body p-0">
                                            {/* Table Starts Here */}
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Customer Name</th>
                                                            <th>Amount</th>
                                                            <th>ID Number</th>
                                                            <th>Company</th>
                                                            <th>Type</th>
                                                            <th>Comment</th>
                                                            <th>Date & Time</th>
                                                            <th>Status</th>
                                                            <th className='text-center'>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredCheck.length > 0 ? (
                                                            filteredCheck.map((item, index) => (
                                                                <tr key={item._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.customerFirstName}</td>
                                                                    <td>{item.amount}</td>
                                                                    <td>{item.licenseNo}</td>
                                                                    <td>{item.company}</td>
                                                                    <td>{item.checkType}</td>
                                                                    <td>{item.comment?.length > 10 ? item.comment.substring(0, 10) + '...' : item.comment}</td>
                                                                    <td>
                                                                        {item?.date }
                                                                    </td>

                                                                    <td>{item.status}</td>
                                                                    <td>
                                                                        <div className=" justify-content-center">
                                                                            <Link to={`/check-details/${item?._id}`} className="btn">
                                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                                            </Link><button className="btn" onClick={() => handleDeleteCheck(item._id)}>
                                                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="10" className="text-center">No checks found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Table Ends Here */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checks;

