import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

const URL = process.env.REACT_APP_URL;

const AllCheques = () => {

    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCheques = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/get-all-checks`);
            if (response.status >= 200 && response.status < 300) {
                setCheques(response?.data?.data)
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCheque = async (id) => {
        if (!window.confirm("Are you sure you want to delete this check?")) return;
        try {
            const response = await axios.delete(`${URL}/admin/delete-checks/${id}`);
            if (response.status >= 200 && response.status < 300) {
                toast.success("Check deleted successfully!");
                fetchCheques();
            }
        } catch (error) {
            toast.error("Error in deleting check: " + error.message);
            console.error("Error in deleting check", error);
        }
    };

    const filteredCheques = cheques.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.customerFirstName?.toLowerCase().includes(search) ||
            item.customerMiddleName?.toLowerCase().includes(search) ||
            item.customerLastName?.toLowerCase().includes(search) ||
            item.company?.toLowerCase().includes(search) ||
            item.licenseNo?.toString().toLowerCase().includes(search) ||
            item.checkType?.toLowerCase().includes(search) ||
            item.amount?.toString().toLowerCase().includes(search) ||
            item.comment?.toLowerCase().includes(search) ||
            item.venderId?.firstname?.toLowerCase().includes(search) ||
            item.venderId?.lastname?.toLowerCase().includes(search) ||
            item.date?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search)
        )
    });

    useEffect(() => {
        fetchCheques();
    }, [])


    const indexOfLastRow = currentPage * itemsPerPage;
    const indexOfFirstRow = indexOfLastRow - itemsPerPage;
    const currentCheques = filteredCheques.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredCheques.length / itemsPerPage);

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
                                            <div className="card border-0 rounded-3 mb-3">
                                                <div className="card-body p-2">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 16" fill="none">
                                                                            <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-semibold">All Check</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="row">
                                                                <div className="d-flex">
                                                                    <div className="position-relative"
                                                                        style={{ width: "-webkit-fill-available" }}>
                                                                        <input className="form-control form-control-sm rounded-3 shadow-none bg-F0F5F6" style={{ paddingLeft: "40px" }}
                                                                            onChange={(e) => setSearchTerm(e.target.value)} type="search" placeholder="Search" aria-label="Search" />
                                                                        <i className="fa-solid fa-magnifying-glass text-445B64 position-absolute top-0 start-0"
                                                                            style={{ margin: "8px" }}></i>
                                                                    </div>
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
                                                                            <th scope="col" className="text-445B64">Customer Name</th>
                                                                            <th scope="col" className="text-445B64">Company Name</th>
                                                                            <th scope="col" className="text-445B64">ID Number</th>
                                                                            <th scope="col" className="text-445B64">Check Type</th>
                                                                            <th scope="col" className="text-445B64">Amount</th>
                                                                            <th scope="col" className="text-445B64">Customer Status</th>
                                                                            <th scope="col" className="text-445B64">Comment</th>
                                                                            <th scope="col" className="text-445B64">Vender</th>
                                                                            <th scope="col" className="text-445B64">Date & Time</th>

                                                                            <th scope="col" className="text-445B64 text-center">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {loading ? (
                                                                            <tr>
                                                                                <td colSpan="11" className="text-center py-5">
                                                                                    <span className="spinner-border text-primary" role="status" />
                                                                                </td>
                                                                            </tr>
                                                                        ) : filteredCheques.length > 0 ? (
                                                                            currentCheques.map((cheque, index) => (
                                                                                <tr key={cheque._id}>
                                                                                    <td>{indexOfFirstRow + index + 1}</td>
                                                                                    <td>{cheque?.customerFirstName} {cheque?.customerMiddleName} {cheque?.customerLastName}</td>
                                                                                    <td>{cheque?.company}</td>
                                                                                    <td>{cheque?.licenseNo}</td>
                                                                                    <td>{cheque?.checkType}</td>
                                                                                    <td>$ {cheque?.amount}</td>
                                                                                    <td>$ {cheque?.customerStatus==="verified customer"?"Verified":"New"}</td>
                                                                                    <td>{cheque?.comment?.length > 10 ? cheque?.comment.substring(0, 10) + '...' : cheque?.comment}</td>
                                                                                    <td>{cheque?.venderId?.firstname} {cheque?.venderId?.lastname} </td>
                                                                                    <td>{cheque?.date} </td>

                                                                                    <td>
                                                                                        <div className="d-flex justify-content-center">
                                                                                            <Link to={`/cd-admin/cheque-details/${cheque?._id}`} className="btn">
                                                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                                                            </Link>
                                                                                            <button className="btn" onClick={() => handleDeleteCheque(cheque?._id)}>
                                                                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="11" className="text-center">No cheques found.</td>
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
                                            <div className="d-bolck d-lg-flex justify-content-between align-items-center mt-4 mb-1 pt-2">
                                                <h6 className="mb-3 mb-lg-0 text-445B64"> Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, cheques.length)} of {cheques.length} entries</h6>
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
                </div>
            </div>
        </>
    )
}

export default AllCheques