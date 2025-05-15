import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token');

const RecentCheck = () => {
    // const navigate = useNavigate();
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
            const response = await axios.delete(`${URL}/check/delete-check/${id}`,{
                headers:{
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

    // const handleAddCheck = () => {
    //     navigate("/dashboard");
    // };

    const filteredChecks = checks.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.customerFirstName?.toLowerCase().includes(search) ||
            item.customerLastName?.toLowerCase().includes(search) ||
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
        <>
         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="row">
                <div className="col-12">
                    <div className='d-flex justify-content-between mb-3'>
                        <div className="d-flex align-items-center">
                            <h6 className="fw-semibold mb-0">Recent Checks</h6>
                        </div>
                        <div className="">
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
                    </div>
                    <div className="card border-0 shadow rounded-4 mb-1 overflow-hidden">
                        <div className="card-body p-0">
                            {/* Table Starts Here */}
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
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
                                        {filteredChecks.length > 0 ? (
                                            filteredChecks.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.customerFirstName}</td>
                                                    <td>{item.amount}</td>
                                                    <td>{item.licenseNo}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.checkType}</td>
                                                    <td>{item.comment?.length > 10 ? item.comment.substring(0, 10) + '...' : item.comment}</td>
                                                    <td>
                                                        {item?.date
                                                            // &&
                                                            // new Date(item.date).toLocaleDateString("en-GB", {
                                                            //     day: "numeric",
                                                            //     month: "long",
                                                            //     year: "numeric",
                                                            // }).replace(/(\w+) (\d{4})$/, "$1, $2")
                                                        }
                                                    </td>

                                                    <td>{item.status}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <Link to={`/check-details/${item?._id}`} className="btn py-0">
                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                            </Link><button className="btn py-0" onClick={() => handleDeleteCheck(item._id)}>
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
        </>
    )
}

export default RecentCheck