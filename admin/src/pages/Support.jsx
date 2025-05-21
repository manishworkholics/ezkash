import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import moment from 'moment';
const URL = process.env.REACT_APP_URL;

const Support = () => {


    const [ticket, setTicket] = useState()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;




    const getAllTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/tickets/get-all-tickets`);
            if (response.status >= 200 && response.status < 300) {
                setTicket(response?.data)
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllTickets();
    }, [])


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
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body p-2">
                                                    <div className="row">
                                                        <div className="col-8 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 12 13" fill="none">
                                                                            <path d="M6 0.5C2.68941 0.5 0 2.786 0 5.6C0 8.414 2.68941 10.7 6 10.7H6.35294V12.5C9.78353 11.096 12 8.3 12 5.6C12 2.786 9.31059 0.5 6 0.5ZM6.70588 9.2H5.29412V8H6.70588V9.2ZM6.70588 7.1H5.29412C5.29412 5.15 7.41177 5.3 7.41177 4.1C7.41177 3.44 6.77647 2.9 6 2.9C5.22353 2.9 4.58824 3.44 4.58824 4.1H3.17647C3.17647 2.774 4.44 1.7 6 1.7C7.56 1.7 8.82353 2.774 8.82353 4.1C8.82353 5.6 6.70588 5.75 6.70588 7.1Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-semibold">Ticket List</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 col-lg-6 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end">
                                                                <button className="btn btn-sm rounded-2 btn-secondary text-white">
                                                                    <i className="fa-solid fa-arrow-left-long me-2 text-white"></i>
                                                                    Back
                                                                </button>
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
                                                                            <th scope="col" className="text-445B64">Ticket ID</th>
                                                                            <th scope="col" className="text-445B64">Subject</th>
                                                                            <th scope="col" className="text-445B64">Status</th>
                                                                            <th scope="col" className="text-445B64">Created</th>
                                                                            <th scope="col" className="text-445B64">Assigned To</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {ticket?.map((val, index) => {
                                                                        return (
                                                                            <>
                                                                                <tbody key={index}>
                                                                                    <tr>
                                                                                        <td scope="row">{index + 1}</td>
                                                                                        <td>
                                                                                            <Link to={`/cd-admin/ticket-details/${val?._id}`} className="">
                                                                                                #{val?._id?.slice(-5)}
                                                                                            </Link>
                                                                                        </td>
                                                                                        <td>{val?.subject?.slice(0, 20)}...</td>
                                                                                        <td><span className="text-info">{val?.status}</span></td>
                                                                                        <td>{moment(val?.createdAt).format("MMM DD, YYYY hh:mm A")}</td>
                                                                                        <td></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </>
                                                                        )
                                                                    })}

                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Pagination Controls */}
                                            {/* <div className="d-block d-lg-flex justify-content-between mt-4 mb-1 pt-2">
                                                <h6 className="mb-3 mb-lg-0 text-445B64">Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, ticket.length)} of {ticket.length} entries</h6>
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
                                            </div> */}
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

export default Support