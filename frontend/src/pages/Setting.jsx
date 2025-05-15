import React from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';


const Setting = () => {
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
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 18" fill="none">
                                                                            <path d="M6.08333 17.3333L5.75 14.6667C5.56944 14.5972 5.39931 14.5139 5.23958 14.4167C5.07986 14.3194 4.92361 14.2153 4.77083 14.1042L2.29167 15.1458L0 11.1875L2.14583 9.5625C2.13194 9.46527 2.125 9.37153 2.125 9.28125V8.71875C2.125 8.62847 2.13194 8.53472 2.14583 8.4375L0 6.8125L2.29167 2.85416L4.77083 3.89583C4.92361 3.78472 5.08333 3.68055 5.25 3.58333C5.41667 3.48611 5.58333 3.40278 5.75 3.33333L6.08333 0.666664H10.6667L11 3.33333C11.1806 3.40278 11.3507 3.48611 11.5104 3.58333C11.6701 3.68055 11.8264 3.78472 11.9792 3.89583L14.4583 2.85416L16.75 6.8125L14.6042 8.4375C14.6181 8.53472 14.625 8.62847 14.625 8.71875V9.28125C14.625 9.37153 14.6111 9.46527 14.5833 9.5625L16.7292 11.1875L14.4375 15.1458L11.9792 14.1042C11.8264 14.2153 11.6667 14.3194 11.5 14.4167C11.3333 14.5139 11.1667 14.5972 11 14.6667L10.6667 17.3333H6.08333ZM8.41667 11.9167C9.22222 11.9167 9.90972 11.6319 10.4792 11.0625C11.0486 10.4931 11.3333 9.80555 11.3333 9C11.3333 8.19444 11.0486 7.50694 10.4792 6.9375C9.90972 6.36805 9.22222 6.08333 8.41667 6.08333C7.59722 6.08333 6.90625 6.36805 6.34375 6.9375C5.78125 7.50694 5.5 8.19444 5.5 9C5.5 9.80555 5.78125 10.4931 6.34375 11.0625C6.90625 11.6319 7.59722 11.9167 8.41667 11.9167Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Setting</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-end">
                                                                <button className="btn btn-sm rounded-2 btn-light text-445B64">
                                                                    <i className="fa-solid fa-arrow-left-long me-2 text-445B64"></i>
                                                                    Back
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-12">
                                            <div className="card border-0 rounded-3 mb-1">
                                                <div className="card-body">
                                                </div>
                                            </div>
                                        </div> */}
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

export default Setting