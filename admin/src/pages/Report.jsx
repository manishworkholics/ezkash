import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import ExportModal from '../components/ExportModal';

const token = localStorage.getItem('token');
const URL = process.env.REACT_APP_URL;

const Report = () => {
    const navigate = useNavigate();
    const { id } = useParams()

    const [report, setReport] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReport = async () => {
        try {
            const vendorId = localStorage.getItem('userId');
            const response = await axios.get(`${URL}/check/get-checkByVenderId/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response) {
                setReport(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching checks:", error);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);


    const filteredCheck = report.filter((item, index) => {
        const search = searchTerm.toLowerCase();
        return (
            (index + 1).toString().includes(search) ||
            item.customerFirstName?.toLowerCase().includes(search) ||
            item.customerMiddleName?.toLowerCase().includes(search) ||
            item.customerLastName?.toLowerCase().includes(search) ||
            item.company?.toLowerCase().includes(search) ||
            item.licenseNo?.toLowerCase().includes(search) ||
            item.checkType?.toLowerCase().includes(search) ||
            item.amount?.toString().includes(search) ||
            item.comment?.toLowerCase().includes(search) ||
            item.date?.toLowerCase().includes(search) ||
            item.status?.toLowerCase().includes(search)
        );
    });

    const handleSort = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const sortedReport = [...filteredCheck];
    if (sortField) {
        sortedReport.sort((a, b) => {
            let aValue, bValue;

            if (sortField === '#') {
                aValue = report.indexOf(a);
                bValue = report.indexOf(b);
            } else {
                aValue = a[sortField];
                bValue = b[sortField];
            }

            if (typeof aValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }

    const renderSortIcons = (field) => {
        const isActive = sortField === field;
        const isAsc = sortOrder === 'asc';

        return (
            <span
                className="d-inline-flex flex-column ms-1"
                style={{ fontSize: '0.75rem', lineHeight: '1' }}
            >
                <span style={{ color: isActive && isAsc ? '#000' : '#ccc' }}>▲</span>
                <span style={{ color: isActive && !isAsc ? '#000' : '#ccc' }}>▼</span>
            </span>
        );
    };

    const handleBack = () => {
        navigate(-1)
    }

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
                                                        <div className="col-6 col-md-3 col-lg-3">
                                                            <div className="d-flex justify-content-between mb-3 mb-md-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3" style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                            <path d="M7.875 5.4H12.6875L7.875 1.55V5.4ZM1.75 0.5H8.75L14 4.7V13.1C14 13.4713 13.8156 13.8274 13.4874 14.0899C13.1592 14.3525 12.7141 14.5 12.25 14.5H1.75C1.28587 14.5 0.840752 14.3525 0.512563 14.0899C0.184374 13.8274 0 13.4713 0 13.1V1.9C0 1.123 0.77875 0.5 1.75 0.5ZM2.625 13.1H4.375V8.9H2.625V13.1ZM6.125 13.1H7.875V7.5H6.125V13.1ZM9.625 13.1H11.375V10.3H9.625V13.1Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Report</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 d-flex justify-content-end align-items-center mb-3 d-md-none">
                                                            <button onClick={handleBack} style={{ background: '#6c757d' }} className='btn border-0  rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0'>
                                                                <i className="fa-solid fa-arrow-left-long text-white me-2"></i>
                                                                Back
                                                            </button>
                                                        </div>
                                                        <div className="col-12 col-md-9 col-lg-9">
                                                            <div className="row justify-content-end">
                                                                <div className="col-7">
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

                                                                <div className="col-5 d-flex justify-content-end align-items-center">
                                                                    <button onClick={() => setShowModal(true)} style={{ background: '#008CFF' }} className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 me-md-3 fs-14 text-445B64 p-0'>
                                                                        Export Report
                                                                    </button>
                                                                    <ExportModal data={report} show={showModal} onClose={() => setShowModal(false)} />
                                                                    <button onClick={handleBack} style={{ background: '#6c757d' }} className='btn border-0  rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0 d-none d-md-block'>
                                                                        <i className="fa-solid fa-arrow-left-long me-2 text-white"></i>
                                                                        Back
                                                                    </button>
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
                                                                            <th onClick={() => handleSort('#')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    #
                                                                                    {renderSortIcons('#')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('customerFirstName')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Customer Name
                                                                                    {renderSortIcons('customerFirstName')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Amount
                                                                                    {renderSortIcons('amount')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('licenseNo')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    ID Number
                                                                                    {renderSortIcons('licenseNo')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Company
                                                                                    {renderSortIcons('company')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('checkType')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Type
                                                                                    {renderSortIcons('checkType')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('comment')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Comment
                                                                                    {renderSortIcons('comment')}
                                                                                </div>
                                                                            </th>
                                                                            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                                                                                <div className="d-flex align-items-center">
                                                                                    Date & Time
                                                                                    {renderSortIcons('date')}
                                                                                </div>
                                                                            </th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {sortedReport.map((val, index) => (
                                                                            <tr key={val._id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{val.customerFirstName} {val?.customerMiddleName} {val?.customerLastName}</td>
                                                                                <td>$ {val.amount}</td>
                                                                                <td>{val.licenseNo}</td>
                                                                                <td>{val.company}</td>
                                                                                <td>{val.checkType}</td>
                                                                                <td>{val.comment?.length > 10 ? val.comment.substring(0, 10) + '...' : val.comment}</td>
                                                                                <td>{val.date}</td>

                                                                            </tr>
                                                                        ))}
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