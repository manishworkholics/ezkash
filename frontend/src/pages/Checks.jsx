import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import RecentCheck from '../components/RecentCheck';
const token = localStorage.getItem('token');
const URL = process.env.REACT_APP_URL;

const Checks = () => {
    const navigate = useNavigate();
    const [checks, setChecks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [showAll, setShowAll] = useState(false);


    useEffect(() => {
        fetchChecks();
    }, []);

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
            console.error("Error fetching checks:", error);
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
            toast.error("Error deleting check: " + error.message);
        }
    };

    const handleAddCheck = () => navigate("/upload-check");
    const handleAddCheckDesk = () => navigate("/add-check");

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        const isActive = sortConfig.key === key;
        const isAsc = sortConfig.direction === 'asc';

        return (
            <span className="d-inline-flex flex-column ms-1" style={{ fontSize: '0.75rem', lineHeight: '1' }}>
                <span style={{ color: isActive && isAsc ? '#000' : '#ccc' }}>▲</span>
                <span style={{ color: isActive && !isAsc ? '#000' : '#ccc' }}>▼</span>
            </span>
        );
    };

    const filteredCheck = checks.filter((item, index) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            (index + 1).toString().includes(search) ||
            (item.customerFirstName || "").toLowerCase().includes(search) ||
            (item.customerMiddleName || "").toLowerCase().includes(search) ||
            (item.customerLastName || "").toLowerCase().includes(search) ||
            (item.company || "").toLowerCase().includes(search) ||
            (item.licenseNo || "").toLowerCase().includes(search) ||
            (item.checkType || "").toLowerCase().includes(search) ||
            (item.amount?.toString() || "").includes(search) ||
            (item.comment || "").toLowerCase().includes(search) ||
            (item.date || "").toLowerCase().includes(search) ||
            (item.status || "").toLowerCase().includes(search)
        );
    });

    const sortedData = [...filteredCheck].sort((a, b) => {
        const { key, direction } = sortConfig;
        if (!key) return 0;

        let valA = key === 'serial' ? checks.indexOf(a) + 1 : a[key];
        let valB = key === 'serial' ? checks.indexOf(b) + 1 : b[key];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });



    return (
        <>

            <div className="container-fluid ">
                <Header />
                <div className="d-none d-lg-block">
                    <div className="row mh-100vh">
                        <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
                            <Sidebar />
                        </div>
                        <div className="col-lg-9 col-xl-10 bg-F6F6F6 mobile-background">
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
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 15 16" fill="none">
                                                                            <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">All Checks</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6 d-flex justify-content-end align-items-center d-md-none">
                                                            <button
                                                                style={{ background: '#008CFF' }}
                                                                className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0 mb-2'
                                                                onClick={handleAddCheck}
                                                            >
                                                                <i className="fa fa-plus me-2"></i>Add Check
                                                            </button>
                                                        </div>

                                                        <div className="col-12 col-md-9 col-lg-9">
                                                            <div className="row justify-content-end">
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
                                                                    <button
                                                                        style={{ background: '#008CFF' }}
                                                                        className='btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium'
                                                                        onClick={handleAddCheckDesk}
                                                                    >
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
                                                    <div className="table-responsive">
                                                        <table className="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th onClick={() => handleSort('serial')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            #
                                                                            {getSortIcon('serial')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('customerFirstName')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Customer Name {getSortIcon('customerFirstName')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Amount {getSortIcon('amount')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('licenseNo')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            ID Number {getSortIcon('licenseNo')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Company {getSortIcon('company')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('checkType')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Type {getSortIcon('checkType')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('comment')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Comment {getSortIcon('comment')}
                                                                        </div>
                                                                    </th>
                                                                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Date & Time {getSortIcon('date')}
                                                                        </div>
                                                                    </th>
                                                                    <th >
                                                                        <div className="d-flex align-items-center">
                                                                            Customer Status
                                                                        </div>
                                                                    </th>
                                                                    {/* <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                                                        <div className="d-flex align-items-center">
                                                                            Status {getSortIcon('status')}
                                                                        </div>
                                                                    </th> */}

                                                                    <th className='text-center'>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {sortedData.length > 0 ? (
                                                                    showAll ? sortedData : sortedData.slice(0, 5)).map((item, index) => (
                                                                        <tr key={item?._id}>
                                                                            <td>{index + 1}</td>
                                                                            <td className='text-uppercase'>{item?.customerFirstName} {item?.customerMiddleName} {item?.customerLastName}</td>
                                                                            <td>$ {item?.amount}</td>
                                                                            <td>{item?.licenseNo}</td>
                                                                            <td>{item?.company?.length > 30 ? item?.company.substring(0, 30) + '...' : item?.company}</td>
                                                                            <td>{item?.checkType}</td>
                                                                            <td>{item?.comment?.length > 10 ? item?.comment.substring(0, 10) + '...' : item?.comment}</td>
                                                                            <td>{item?.date}</td>
                                                                            <td>{item?.customerStatus==="verified customer"?"Verified":"New"}</td>
                                                                            {/* <td>{item?.status}</td> */}
                                                                            <td className='text-center'>
                                                                                <div className="d-flex justify-content-center">
                                                                                    <Link to={`/check-details/${item?._id}`} className="btn">
                                                                                        <i className="fa-solid fa-eye text-445B64"></i>
                                                                                    </Link>
                                                                                    <button className="btn" onClick={() => handleDeleteCheck(item?._id)}>
                                                                                        <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                    ) : (
                                                                    <tr>
                                                                        <td colSpan="10" className="text-center">No checks found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                        {sortedData.length > 5 && (
                                                            <div className="text-center mt-3 mb-3">
                                                                <button style={{ background: '#008CFF' }} className='btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium' onClick={() => setShowAll(!showAll)}>
                                                                    {showAll ? 'Show Less' : 'Show More'}
                                                                </button>
                                                            </div>
                                                        )}

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
            {/* Mobile-View Start */}
            <div className="container-fluid mobile-bg d-block d-lg-none" style={{ minHeight: '100vh' }}>
                {/* <Header /> */}
                <div className="row mb-2 pt-5 mt-4 mt-md-5">
                    <div className="col-12 mb-3">
                        <Link to='/upload-check' className="btn mob-addCheck-btn rounded-3 border w-100 text-start d-flex align-items-center">
                            <i class="fa fa-plus text-white"></i>
                            <span className="text-white fw-semibold ms-2 my-1">Add New Check</span>
                        </Link>
                    </div>

                </div>
                <div className="mb-5">
                    <RecentCheck />
                </div>
            </div>

            {/* Mobile-View End */}
        </>
    );
};

export default Checks;
