import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const URL = process.env.REACT_APP_URL;

const UserInformation = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const [users, setUsers] = useState([]);
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [report, setReport] = useState([]);
    const rowsPerPage = 10;

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = cheques.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(cheques.length / rowsPerPage);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/get-all-users-byId/${id}`);
            if (response.status >= 200 && response.status < 300) {
                setUsers(response?.data?.data)
            }
        } catch (error) {
            console.log("Error in fetching users", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCheques = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/check/get-checkByVenderId/${id}`);
            if (response.status >= 200 && response.status < 300) {
                setCheques(response?.data?.data)
            }
        } catch (error) {
            console.log("Error in fetching users", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCheque = async (id) => {
        if (!window.confirm("Are you sure you want to delete this cheque?")) return;
        try {
            const response = await axios.delete(`${URL}/check/delete-check/${id}`);
            if (response.status >= 200 && response.status < 300) {
                toast.success("Cheque deleted successfully!");
                fetchCheques();
            }
        } catch (error) {
            toast.error("Error in deleting cheque: " + error.message);
            console.error("Error in deleting cheque", error);
        }
    };

    const [formData, setFormData] = useState({
        customerFirstName: '',
        customerMiddleName: '',
        customerLastName: '',
        licenseNo: '',
        date: '',
        company: '',
        checkType: '',
        amount: '',
        imageUrl: '',
        extractedText: '',
    });

    const [formDataback, setFormDataback] = useState({
        customerFirstName: '',
        customerMiddleName: '',
        customerLastName: '',
        licenseNo: '',
        date: '',
        company: '',
        checkType: '',
        amount: '',
        imageUrl: '',
        extractedText: '',
    });

    const [licenseData, setLicenseData] = useState({
        imageUrl: '',
        name: '',
        licenseNo: '',
        class: '',
        dob: '',
        sex: '',
        eyes: '',
        height: '',
        address: '',
        issuedDate: '',
        expiryDate: '',
    });

    const [licenseDataback, setLicenseDataback] = useState({
        imageUrl: '',
        name: '',
        licenseNo: '',
        class: '',
        dob: '',
        sex: '',
        eyes: '',
        height: '',
        address: '',
        issuedDate: '',
        expiryDate: '',
    });

    const [status, setStatus] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a cheque image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${URL}/scan-check`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            if (result && result.customerName) {
                const parsedData = {
                    customerFirstName: result.customerFirstName || '',
                    customerMiddleName: result.customerMiddleName || '',
                    customerLastName: result.customerLastName || '',
                    date: result.date || '',
                    company: result.company || '',
                    checkType: result.checkType || '',
                    amount: result.amountNumeric || '',
                    amountWords: result.amountWords || '',
                    payee: result.payee || '',
                    memo: result.memo || '',
                    imageUrl: result.imageUrl || '',
                    extractedText: result.extractedText || ''
                };
                setFormData(parsedData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }

    };

    const handleSubmitback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a cheque image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${URL}/scan-check`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            if (result && result.customerName) {
                const parsedData = {
                    customerName: result.customerName || '',
                    date: result.date || '',
                    company: result.company || '',
                    checkType: result.checkType || '',
                    amount: result.amountNumeric || '',
                    amountWords: result.amountWords || '',
                    payee: result.payee || '',
                    memo: result.memo || '',
                    imageUrl: result.imageUrl || '',
                    extractedText: result.extractedText || ''
                };
                setFormDataback(parsedData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }

    };

    const handleSubmitLicense = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a License image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${URL}/scan-license`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const result = response.data;
            if (result) {
                const parsedData = {
                    imageUrl: result.imageUrl || '',
                    name: result.name || '',
                    licenseNo: result.licenseNo || '',
                    dob: result.dob || '',
                    sex: result.sex || '',
                    eyes: result.eyes || '',
                    height: result.height || '',
                    address: result.address || '',
                    issuedDate: result.issuedDate || '',
                    expiryDate: result.expiryDate || '',
                };
                setLicenseData(parsedData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }

    };

    const handleSubmitLicenseback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a License image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${URL}/scan-license`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const result = response.data;
            if (result) {
                const parsedData = {
                    imageUrl: result.imageUrl || '',
                    name: result.name || '',
                    licenseNo: result.licenseNo || '',
                    dob: result.dob || '',
                    sex: result.sex || '',
                    eyes: result.eyes || '',
                    height: result.height || '',
                    address: result.address || '',
                    issuedDate: result.issuedDate || '',
                    expiryDate: result.expiryDate || '',
                };
                setLicenseDataback(parsedData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }
    };

    const handleStatus = async () => {
        try {
            const response = await axios.get(`${URL}/check/status`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.status >= 200 && response.status < 300) {
                setStatus(response?.data || []);
            }
        } catch (error) {
            console.log("Error in fetching data");
        }
    }

    useEffect(() => {
        handleStatus();
    }, [])

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl || !licenseData.imageUrl) {
            toast.error('Please upload both Cheque and License front images');
            return;
        }

        try {
            const response = await axios.post(`${URL}/check/add-check`, {
                imageUrl: formData.imageUrl || '',
                imageUrl2: formDataback.imageUrl || '',
                imageUrl3: licenseData.imageUrl || '',
                imageUrl4: licenseDataback.imageUrl || '',
                customerFirstName: formData.customerFirstName,
                customerMiddleName: formData.customerMiddleName,
                customerLastName: formData.customerLastName,
                licenseNo: licenseData.licenseNo,
                date: new Date(Date.now()).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }),
                company: formData.company,
                checkType: formData.checkType,
                amount: formData.amount,
                status: formData.status,
                extractedText: formData.extractedText,
                comment: formData.comment || 'xyz',
                venderId: id,
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success('Check added successfully');
                setShowModal(false);
                // Update the check list state
                if (response.data?.data) {
                    setReport((prev) => [response.data.data, ...prev]);
                }
                // Optional: clear the form
                setFormData({});
                setLicenseData({});
                setFormDataback({});
                setLicenseDataback({});
            } else {
                toast.error('Failed to add check');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form');
        }
    };
    const totalAmount = cheques.reduce((sum, cheque) => {
        const num = parseFloat(cheque.amount?.replace(/[^\d.-]/g, '') || 0);
        return sum + (isNaN(num) ? 0 : num);
    }, 0);


    useEffect(() => {
        fetchUsers();// eslint-disable-next-line react-hooks/exhaustive-deps
        fetchCheques();// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <>
            <div className="container-fluid">
                <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                                                        <div className="col-8 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                                            <path d="M6 0.5C5.23002 0.5 4.49157 0.811674 3.94711 1.36646C3.40265 1.92124 3.09677 2.67368 3.09677 3.45827C3.09677 4.24285 3.40265 4.99529 3.94711 5.55008C4.49157 6.10486 5.23002 6.41653 6 6.41653C6.76998 6.41653 7.50843 6.10486 8.05289 5.55008C8.59735 4.99529 8.90323 4.24285 8.90323 3.45827C8.90323 2.67368 8.59735 1.92124 8.05289 1.36646C7.50843 0.811674 6.76998 0.5 6 0.5ZM2.90323 7.99427C2.13324 7.99427 1.3948 8.30595 0.850335 8.86073C0.305875 9.41551 0 10.168 0 10.9525V11.8897C0 12.4845 0.42271 12.991 0.99871 13.0864C4.31071 13.6379 7.68929 13.6379 11.0013 13.0864C11.2799 13.0397 11.5331 12.8938 11.716 12.6747C11.8989 12.4555 11.9995 12.1774 12 11.8897V10.9525C12 10.168 11.6941 9.41551 11.1497 8.86073C10.6052 8.30595 9.86676 7.99427 9.09677 7.99427H8.83355C8.68903 7.9948 8.54865 8.01741 8.41239 8.06212L7.74194 8.28537C6.61004 8.6619 5.38996 8.6619 4.25806 8.28537L3.58761 8.06212C3.45172 8.0177 3.30994 7.99482 3.16723 7.99427H2.90323Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-semibold">User Information</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 col-lg-6 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end align-items-center">
                                                                <button className="btn btn-sm rounded-2 btn-secondary text-white" onClick={handleBack}>
                                                                    <i className="fa-solid fa-arrow-left-long me-2 text-white"></i>
                                                                    Back
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border-0 rounded-3 mb-1">
                                                <div className="card-body">
                                                    {loading ? (
                                                        <div className="text-center py-5">
                                                            <div className="spinner-border text-primary" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                    ) : users && (
                                                        <div className="d-block d-lg-flex justify-content-between flex-wrap">
                                                            <div className="d-block d-lg-flex gap-5 flex-wrap">
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Name</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">{users?.firstname} {users?.lastname}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Phone Number</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">{users?.mobile}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Email Address</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">{users?.email}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Total Checks</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">{cheques?.length}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Total Amount</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">$ {totalAmount}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64 fs-14 mb-1">Date & Time</h6>
                                                                    <h6 className="text-0D161A fw-medium mb-0">
                                                                        {new Date("July 14, 2015").toLocaleDateString("en-GB", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "numeric",
                                                                        }).replace(/(\w+) (\d{4})$/, "$1, $2")}
                                                                    </h6>

                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h6 className="text-445B64 fs-14 mb-1">Status</h6>
                                                                <button className={`btn btn-sm rounded-2 lh-1 text-white ${users?.isActive ? 'bg-008f06' : 'bg-f44336'}`}>
                                                                    {users?.isActive ? 'Active' : 'Inactive'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="card border-0 rounded-3">
                                                <div className=''>
                                                    <div className="card-body py-2 d-flex justify-content-between border-bottom">
                                                        <h6 className="text-0D161A fw-medium mb-0 d-flex align-items-center">Check List</h6>
                                                        <button class="btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium" onClick={() => setShowModal(true)} style={{background: '#008cff'}}><i class="fa fa-plus me-2"></i>Add Check</button>
                                                    </div>
                                                </div>
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
                                                                            <th scope="col" className="text-445B64">Comment</th>
                                                                            <th scope="col" className="text-445B64">Date & Time</th>
                                                                            <th scope="col" className="text-445B64">Status</th>
                                                                            <th scope="col" className="text-445B64 text-center">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {cheques?.map((cheque, index1) => (
                                                                            <tr key={index1}>
                                                                                <td>{indexOfFirstRow + index1 + 1}</td>
                                                                                <td>{cheque?.customerFirstName}</td>
                                                                                <td>{cheque?.company}</td>
                                                                                <td>{cheque?.licenseNo}</td>
                                                                                <td>{cheque?.checkType}</td>
                                                                                <td>$ {cheque?.amount}</td>
                                                                                <td>{cheque?.comment?.length > 10 ? cheque?.comment.substring(0, 10) + '...' : cheque?.comment}</td>
                                                                                <td>{new Date(cheque?.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                                                                <td className="text-01A99A">{cheque?.status}</td>
                                                                                <td>
                                                                                    <div className="d-flex justify-content-center">
                                                                                        <Link to={`/cd-admin/cheque-details/${cheque?._id}`} className="btn border-0">
                                                                                            <i className="fa-solid fa-eye text-445B64"></i>
                                                                                        </Link>
                                                                                        <button className="btn" onClick={() => handleDeleteCheque(cheque?._id)}>
                                                                                            <i className="fa-solid fa-trash-can text-danger"></i>
                                                                                        </button>
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
                                            {/* Pagination Controls */}
                                            <div className="d-block d-lg-flex justify-content-between mt-4 mb-1 pt-2">
                                                <h6 className="mb-3 mb-lg-0 text-445B64">Showing 1 to 10 of 50 entries</h6>
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
                                    {showModal && (
                                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                            <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                                                <div className="modal-content border-0 rounded-4">
                                                    <div className="modal-header">
                                                        <h6 className="modal-title">
                                                            <i className="fa-solid fa-file-circle-plus me-1"></i> New Check
                                                        </h6>
                                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                                                    </div>

                                                    <div className="modal-body">
                                                        <form>
                                                            <div className="row g-3">
                                                                {/* License Image Upload */}
                                                                <div className="col-md-6">
                                                                    <label className="form-label">License Front & Back</label>
                                                                    <div className="d-flex gap-3">
                                                                        <div className="form-control inputFile p-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input type="file" onChange={handleSubmitLicense} className="position-absolute w-100 h-100 top-0 start-0" style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div>
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-info" />
                                                                                <p className="mb-0">Upload Front</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-control inputFile p-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input type="file" onChange={handleSubmitLicenseback} className="position-absolute w-100 h-100 top-0 start-0" style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div>
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-info" />
                                                                                <p className="mb-0">Upload Back</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-3">
                                                                        {licenseData?.imageUrl && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label">Front Image</label>
                                                                                <img src={licenseData.imageUrl} className="img-fluid rounded border" />
                                                                            </div>
                                                                        )}
                                                                        {licenseDataback?.imageUrl && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label">Back Image</label>
                                                                                <img src={licenseDataback.imageUrl} className="img-fluid rounded border" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Check Image Upload */}
                                                                <div className="col-md-6">
                                                                    <label className="form-label">Check Front & Back</label>
                                                                    <div className="d-flex gap-3">
                                                                        <div className="form-control inputFile p-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input type="file" onChange={handleSubmit} className="position-absolute w-100 h-100 top-0 start-0" style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div>
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-info" />
                                                                                <p className="mb-0">Upload Front</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-control inputFile p-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input type="file" onChange={handleSubmitback} className="position-absolute w-100 h-100 top-0 start-0" style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div>
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-info" />
                                                                                <p className="mb-0">Upload Back</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-3">
                                                                        {formData?.imageUrl && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label">Front Image</label>
                                                                                <img src={formData.imageUrl} className="img-fluid rounded border" />
                                                                            </div>
                                                                        )}
                                                                        {formDataback?.imageUrl && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label">Back Image</label>
                                                                                <img src={formDataback.imageUrl} className="img-fluid rounded border" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Text Inputs */}
                                                                <div className="col-md-3">
                                                                    <label className="form-label">First Name</label>
                                                                    <input type="text" className="form-control" value={licenseData.customerFirstName || formData.customerFirstName} onChange={(e) => setFormData({ ...formData, customerFirstName: e.target.value })} />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Middle Name</label>
                                                                    <input type="text" className="form-control" value={licenseData.customerMiddleName || formData.customerMiddleName} onChange={(e) => setFormData({ ...formData, customerMiddleName: e.target.value })} />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Last Name</label>
                                                                    <input type="text" className="form-control" value={licenseData.customerLastName || formData.customerLastName} onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })} />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">ID Number</label>
                                                                    <input type="text" className="form-control" value={licenseData.licenseNo || ''} onChange={(e) => setLicenseData({ ...licenseData, licenseNo: e.target.value })} />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Company</label>
                                                                    <input type="text" className="form-control" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Check Type</label>
                                                                    <select className="form-select" value={formData.checkType || ''} onChange={(e) => setFormData({ ...formData, checkType: e.target.value })}>
                                                                        {/* <option value="">Select</option> */}
                                                                        <option value="Personal">Personal</option>
                                                                        <option value="Business">Business</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Status</label>
                                                                    <select className="form-select" value={formData.status || ''} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                                                        <option value="">Select</option>
                                                                        <option value="good">Good</option>
                                                                        <option value="bad">Bad</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label">Amount</label>
                                                                    <input type="text" className="form-control" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="form-label">Comments</label>
                                                                    <textarea className="form-control" rows="3" value={formData.comment || ''} onChange={(e) => setFormData({ ...formData, comment: e.target.value })}></textarea>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-light bg-F0F5F6 border rounded-3" onClick={() => setShowModal(false)}>Cancel</button>
                                                        <button type="button" className="btn bg-00C7BE btn-primary rounded-3" onClick={handleSave}>Save Check</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInformation

