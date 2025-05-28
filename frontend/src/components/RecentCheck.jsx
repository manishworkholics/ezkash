import React, { useEffect, useState } from 'react';
// import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import axios from 'axios';



const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token');

const RecentCheck = () => {
    const [showAll, setShowAll] = useState(false);
    const [checks, setChecks] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
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

    // const handleDeleteCheck = async (id) => {
    //     if (!window.confirm("Are you sure you want to delete this check?")) return;
    //     try {
    //         const response = await axios.delete(`${URL}/check/delete-check/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         if (response.status >= 200 && response.status < 300) {
    //             toast.success("Check deleted successfully!");
    //             fetchChecks();
    //         }
    //     } catch (error) {
    //         toast.error("Error in deleting check: " + error.message);
    //         console.error("Error in deleting check", error);
    //     }
    // };


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

    useEffect(() => {
        fetchChecks();
    }, []);

    return (
        <>

            <div className="row">
                <div className="col-12">
                    <div className='d-flex justify-content-between mb-3'>
                        <div className="d-flex align-items-center">
                            <h6 className="fw-semibold mb-0">All Checks</h6>
                        </div>
                        <div className="">
                            <div className="d-flex position-relative" style={{ width: "210px" }}>
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
                                            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                                                <div className="d-flex align-items-center">
                                                    Date & Time {getSortIcon('date')}
                                                </div>
                                            </th>
                                            {/* <th onClick={() => handleSort('licenseNo')} style={{ cursor: 'pointer' }}>
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
                                           
                                            <th >
                                                <div className="d-flex align-items-center">
                                                    Customer Status
                                                </div>
                                            </th>
                                            <th className='text-center'>Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedData.length > 0 ? (
                                            showAll ? sortedData : sortedData.slice(0, 5)).map((item, index) => (
                                                <tr key={item?._id}>
                                                    <td> <Link to={`/check-details/${item?._id}`} className='text-decoration-none text-black'>{index + 1}</Link></td>
                                                    <td className='text-uppercase'><Link to={`/check-details/${item?._id}`} className='text-decoration-none text-black'>{item?.customerFirstName} {item?.customerMiddleName} {item?.customerLastName}</Link></td>
                                                    <td><Link to={`/check-details/${item?._id}`} className='text-decoration-none text-black'>$ {item?.amount}</Link></td>
                                                    <td><Link to={`/check-details/${item?._id}`} className='text-decoration-none text-black'>{item?.date}</Link></td>
                                                    {/* <td>{item?.licenseNo}</td>
                                                    <td>{item?.company?.length > 30 ? item?.company.substring(0, 30) + '...' : item?.company}</td>
                                                    <td>{item?.checkType}</td>
                                                    <td>{item?.comment?.length > 10 ? item?.comment.substring(0, 10) + '...' : item?.comment}</td>

                                                    <td>{item?.customerStatus === "verified customer" ? "Verified" : "New"}</td>
                                                    {/* <td>{item?.status}</td> */}
                                                    {/* <td className='text-center'>
                                                        <div className="d-flex justify-content-center">
                                                            <Link to={`/check-details/${item?._id}`} className="btn py-0">
                                                                <i className="fa-solid fa-eye text-445B64"></i>
                                                            </Link>
                                                            <button className="btn py-0" onClick={() => handleDeleteCheck(item?._id)}>
                                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                                            </button>
                                                        </div>
                                                    </td> */}
                                                </tr>
                                            )
                                            ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">No checks found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {sortedData.length > 5 && (
                                <div className="text-center mt-3 mb-3">
                                    <button style={{ background: '#008CFF' }} className='btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium' onClick={() => setShowAll(!showAll)}>
                                        {showAll ? 'Show Less' : 'Show More'}
                                    </button>
                                </div>
                            )}
                            {/* Table Ends Here */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecentCheck