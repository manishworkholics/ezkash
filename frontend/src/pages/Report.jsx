import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const token = localStorage.getItem('token');
const URL = process.env.REACT_APP_URL;

const Report = () => {

    const [report, setReport] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("Custom");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchReport = async () => {
        try {
            const vendorId = localStorage.getItem('userId');
            const response = await axios.get(`${URL}/check/get-checkByVenderId/${vendorId}`, {
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


    const exportReport = (type, isPreview = false) => {
        let filteredData = [...report];

        if (filterType === "Custom" && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            filteredData = filteredData.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate >= start && itemDate <= end;
            });
        }

        const exportData = filteredData.map((val, index) => ({
            SNo: index + 1,
            Customer_Name: val?.customerFirstName || "",
            Amount: val?.amount || "",
            ID_Number: val?.licenseNo || "",
            Company: val?.company || "",
            Type: val?.checkType || "",
            Comment: val?.comment || "",
            Date_and_Time: val?.date || "",
            Status: val?.status || ""
        }));

        if (isPreview) {
            setPreviewData(exportData);
            setShowPreview(true);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const fileExtension = type === "csv" ? ".csv" : ".xlsx";
        const fileType = type === "csv"
            ? "text/csv;charset=utf-8"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

        const excelBuffer = XLSX.write(workbook, {
            bookType: type,
            type: "array",
        });

        const blob = new Blob([excelBuffer], { type: fileType });
        saveAs(blob, `Report_${filterType}_${new Date().toISOString()}${fileExtension}`);
    };




    return (
        <div className="container-fluid">
            <Header />
            <div className="">
                <div className="row mh-100vh">
                    <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
                        <Sidebar />
                    </div>
                    <div className="col-lg-9 col-xl-10 bg-F6F6F6 mobile-background">
                        <div className="main-content">
                            <div className="container-fluid p-3 px-2">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card border-0 rounded-3 mb-2">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-5 col-lg-6 col-xl-2 col-xxl-3">
                                                        <div className="d-flex justify-content-between mb-2 mb-xl-0">
                                                            <div className="d-flex align-items-center">
                                                                <div className="table-circular-icon bg-F0F5F6 me-3">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                        <path d="M7.875 5.4H12.6875L7.875 1.55V5.4ZM1.75 0.5H8.75L14 4.7V13.1C14 13.4713 13.8156 13.8274 13.4874 14.0899C13.1592 14.3525 12.7141 14.5 12.25 14.5H1.75C1.28587 14.5 0.840752 14.3525 0.512563 14.0899C0.184374 13.8274 0 13.4713 0 13.1V1.9C0 1.123 0.77875 0.5 1.75 0.5ZM2.625 13.1H4.375V8.9H2.625V13.1ZM6.125 13.1H7.875V7.5H6.125V13.1ZM9.625 13.1H11.375V10.3H9.625V13.1Z" fill="#000000" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-445B64 fw-medium">Report</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-7 col-lg-6 col-xl-4 col-xxl-4">
                                                        <div className="d-flex position-relative" style={{ width: "100%" }}>
                                                            <input
                                                                className="form-control form-control-sm rounded-3 shadow-none bg-F0F5F6"
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
                                                    <div className="col-12 col-lg-12 col-xl-6 col-xxl-5">
                                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                                            {/* Filter Type Buttons */}
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn btn-sm btn-primary dropdown-toggle"
                                                                    type="button"
                                                                    id="dateFilterDropdown"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    {filterType} <i class="fa-solid fa-caret-down ms-1"></i>
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby="dateFilterDropdown">
                                                                    {["Daily", "Weekly", "Monthly", "Custom"].map((type) => (
                                                                        <li key={type}>
                                                                            <button
                                                                                className={`dropdown-item ${filterType === type ? "active" : ""}`}
                                                                                onClick={() => setFilterType(type)}
                                                                            >
                                                                                {type}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>


                                                            {/* Date Inputs for Custom Filter */}
                                                            <div className="d-flex gap-2 align-items-center">
                                                                {filterType === "Custom" && (
                                                                    <>
                                                                        <div className="position-relative" style={{ width: '120px' }}>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control form-control-sm"
                                                                                id="startDate"
                                                                                value={startDate}
                                                                                onChange={(e) => setStartDate(e.target.value)}
                                                                            />
                                                                            {/* Conditionally hide the label when a date is selected */}
                                                                            {!startDate && <label htmlFor="startDate" style={{ margin: '5px' }} className='position-absolute top-0 bg-white fs-14 w-75'>Start Date</label>}
                                                                        </div>
                                                                        <div className="position-relative" style={{ width: '120px' }}>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control form-control-sm"
                                                                                id="endDate"
                                                                                value={endDate}
                                                                                onChange={(e) => setEndDate(e.target.value)}
                                                                            />
                                                                            {!endDate && <label htmlFor="endDate" style={{ margin: '5px' }} className='position-absolute top-0 bg-white fs-14 w-75'>End Date</label>}
                                                                        </div>

                                                                    </>
                                                                )}
                                                            </div>
                                                            {/* Export Buttons */}
                                                            <div className="d-flex align-items-center ms-auto">
                                                                <button className='btn text-01A99A fw-semibold border-0 bg-transparent text-decoration-underline' onClick={() => exportReport(null, true)}>View</button>
                                                                <div className="dropdown">
                                                                    <button
                                                                        className="btn btn-sm btn-primary dropdown-toggle"
                                                                        type="button"
                                                                        id="exportDropdown"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                    >
                                                                        Export
                                                                    </button>
                                                                    <ul className="dropdown-menu" aria-labelledby="exportDropdown">
                                                                        <li>
                                                                            <button className="dropdown-item" onClick={() => exportReport("csv")}>
                                                                                Export as CSV
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button className="dropdown-item" onClick={() => exportReport("xlsx")}>
                                                                                Export as Excel
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-9 col-lg-9">
                                                        <div className="row justify-content-end">
                                                            {/* <div className="col-md-3 mt-3 mt-md-0 d-none d-md-flex justify-content-end align-items-center">
                                                                <button onClick={() => setShowModal(true)} style={{ background: '#008CFF' }} className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0'>
                                                                    Export Report
                                                                </button>
                                                                <ExportModal data={report} show={showModal} onClose={() => setShowModal(false)} />
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card border-0 rounded-3 overflow-hidden">
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
                                                                        {/* <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                                                            <div className="d-flex align-items-center">
                                                                                Status
                                                                                {renderSortIcons('status')}
                                                                            </div>
                                                                        </th> */}
                                                                        <th className="text-445B64 text-center">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {sortedReport.map((val, index) => (
                                                                        <tr key={val._id}>
                                                                            <td>{index + 1}</td>
                                                                            <td className='text-uppercase'>{val.customerFirstName} {val?.customerMiddleName} {val?.customerLastName}</td>
                                                                            <td>$ {val.amount}</td>
                                                                            <td>{val.licenseNo}</td>
                                                                            <td>{val.company?.length > 30 ? val?.company.substring(0, 30) + '...' : val?.company}</td>
                                                                            <td>{val.checkType}</td>
                                                                            <td>{val.comment?.length > 10 ? val.comment.substring(0, 10) + '...' : val.comment}</td>
                                                                            <td>{val.date}</td>
                                                                            {/* <td>{val.status}</td> */}
                                                                            <td>
                                                                                <div className="d-flex justify-content-center">
                                                                                    <Link to={`/check-details/${val._id}`} className="btn border-0">
                                                                                        <i className="fa-solid fa-eye text-445B64"></i>
                                                                                    </Link>
                                                                                </div>
                                                                            </td>
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


                {showPreview && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: '#00000096' }}>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">

                                <div className="modal-body">
                                    <div className="preview-modal">
                                        <h2>Preview Report</h2>
                                        <table>
                                            <thead>
                                                <tr>
                                                    {previewData.length > 0 &&
                                                        Object.keys(previewData[0]).map((key) => (
                                                            <th key={key}>{key}</th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.map((row, idx) => (
                                                    <tr key={idx}>
                                                        {Object.values(row).map((val, i) => (
                                                            <td key={i}>{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <button onClick={() => exportReport("xlsx")}>Export to Excel</button>
                                        <button onClick={() => exportReport("csv")}>Export to CSV</button>
                                        <button onClick={() => setShowPreview(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
