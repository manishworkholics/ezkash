import React from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const Report = () => {

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
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                            <path d="M7.875 5.4H12.6875L7.875 1.55V5.4ZM1.75 0.5H8.75L14 4.7V13.1C14 13.4713 13.8156 13.8274 13.4874 14.0899C13.1592 14.3525 12.7141 14.5 12.25 14.5H1.75C1.28587 14.5 0.840752 14.3525 0.512563 14.0899C0.184374 13.8274 0 13.4713 0 13.1V1.9C0 1.123 0.77875 0.5 1.75 0.5ZM2.625 13.1H4.375V8.9H2.625V13.1ZM6.125 13.1H7.875V7.5H6.125V13.1ZM9.625 13.1H11.375V10.3H9.625V13.1Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-semibold">Report</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-lg-6 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end align-items-center">
                                                                <Link to="/cd-admin/export-report" className="btn btn-sm rounded-2 bg-008CFF text-white">
                                                                    Export Report
                                                                </Link>
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
                                                                            <th scope="col" className="text-445B64">SNo.</th>
                                                                            <th scope="col" className="text-445B64">User Name</th>
                                                                            <th scope="col" className="text-445B64">Phone Number</th>
                                                                            <th scope="col" className="text-445B64">Email Address</th>
                                                                            <th scope="col" className="text-445B64">Date & Time
                                                                            </th>
                                                                            <th scope="col" className="text-445B64">Status</th>
                                                                            <th scope="col" className="text-445B64 text-center">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td className="text-01A99A"></td>
                                                                            <td className="">
                                                                                <div className="d-flex justify-content-center">
                                                                                    <Link to="/cd-admin/report" className="btn">
                                                                                        <i className="fa-solid fa-eye text-445B64"></i>
                                                                                    </Link>
                                                                                    <button className="btn">
                                                                                        <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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

export default Report