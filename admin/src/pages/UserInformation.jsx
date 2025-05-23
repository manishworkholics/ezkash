import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { toast } from "react-toastify";

const url = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const UserInformation = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const [users, setUsers] = useState([]);
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);



    const rowsPerPage = 10;

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    
    const totalPages = Math.ceil(cheques.length / rowsPerPage);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/admin/get-all-users-byId/${id}`);
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
            const response = await axios.get(`${url}/check/get-checkByVenderId/${id}`);
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




    const licenseFrontRef = useRef(null);
    const licenseBackRef = useRef(null);
    const checkFrontRef = useRef(null);
    const checkBackRef = useRef(null);



    const [previewCheckfront, setPreviewCheckfront] = useState(null);
    const [previewCheckback, setPreviewCheckback] = useState(null);
    const [previewLicencefront, setPreviewLicencefront] = useState(null);
    const [previewLicenceback, setPreviewLicenceback] = useState(null);

    const [formData, setFormData] = useState({ customerFirstName: '', customerMiddleName: '', customerLastName: '', licenseNo: '', date: '', company: '', checkType: 'Personal', amount: '', imageUrl: '', extractedText: '', });

    const [formDataback, setFormDataback] = useState({ imageUrl: '' });

    const [licenseData, setLicenseData] = useState({ imageUrl: '', name: '', licenseNo: '', class: '', dob: '', sex: '', eyes: '', height: '', address: '', issuedDate: '', expiryDate: '', });

    const [licenseDataback, setLicenseDataback] = useState({ imageUrl: '' });


    const handleCancelCheckFront = () => { setPreviewCheckfront(null); setFormData({ ...formData, imageUrl: '', customerFirstName: '', customerMiddleName: '', customerLastName: '', amount: '', company: '' }); if (checkFrontRef.current) { checkFrontRef.current.value = ''; } };

    const handleCancelCheckBack = () => { setPreviewCheckback(null); setFormDataback({ ...formDataback, imageUrl: '' }); if (checkBackRef.current) { checkBackRef.current.value = ''; } };

    const handleCancelLicenseFront = () => { setPreviewLicencefront(null); setLicenseData({ ...licenseData, imageUrl: '', licenseNo: '' }); if (licenseFrontRef.current) { licenseFrontRef.current.value = ''; } };

    const handleCancelLicenseBack = () => { setPreviewLicenceback(null); setLicenseDataback({ ...licenseDataback, imageUrl: '' }); if (licenseBackRef.current) { licenseBackRef.current.value = ''; } };

    const [errors, setErrors] = useState({});


    const requiredFields = ['customerFirstName', 'customerLastName', 'amount'];

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach(field => {
            const value = formData[field];
            if (!value || value.trim() === '') {
                if (field === 'customerFirstName') {
                    newErrors.customerFirstName = 'Please fill this field';
                } else if (field === 'customerLastName') {
                    newErrors.customerLastName = 'Please enter customerLastName';
                } else if (field === 'amount') {
                    newErrors.amount = 'Please enter amount';
                } else {
                    newErrors[field] = 'This field is required';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a check image.");
            return;
        }
        // Instant preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewCheckfront(previewUrl);
        const formData = new FormData();
        formData.append('image', file);
        try {

            const response = await axios.post(`${url}/scan-check`, formData)
            toast.success('Check front image upload successfully!');
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
            setTimeout(() => {
                toast.error("Error in image uploading", error);
            }, 1000);
            console.error('Error during image upload:', error);
        }
    };

    const handleSubmitback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a check image.");
            return;
        }
        // Instant preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewCheckback(previewUrl);
        const formData = new FormData();
        formData.append('image', file);
        try {

            const response = await axios.post(`${url}/upload-image`, formData)
            toast.success('Check Back image upload successfully!');

            const result = response.data;
            if (result) {
                const parsedData = {
                    imageUrl: result.data.imageUrl || '',
                };
                setFormDataback(parsedData);
            }
        } catch (error) {
            setTimeout(() => {
                toast.error("Error in image uploading", error);
            }, 1000);
            console.error('Error during image upload:', error);
        }
    };

    const handleSubmitLicense = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a ID image.");
            return;
        }
        // Instant preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewLicencefront(previewUrl);
        const formData = new FormData();
        formData.append('image', file);
        try {

            const response = await axios.post(`${url}/scan-license`, formData)
            toast.success('ID Front image upload successfully!');

            const result = response.data;
            if (result) {
                const parsedData = {
                    imageUrl: result?.imageUrl || '',
                    name: result?.name || '',
                    licenseNo: result?.licenseNo || '',
                    dob: result?.dob || '',
                    sex: result?.sex || '',
                    eyes: result?.eyes || '',
                    height: result?.height || '',
                    address: result?.address || '',
                    issuedDate: result?.issuedDate || '',
                    expiryDate: result?.expiryDate || '',
                };
                setLicenseData(parsedData);
            }
        } catch (error) {
            toast.error("Error in image uploading", error);
            console.error('Error during image upload:', error);
        }
    };

    const handleSubmitLicenseback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a ID image.");
            return;
        }
        // Instant preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewLicenceback(previewUrl);
        const formData = new FormData();
        formData.append('image', file);
        try {

            const response = await axios.post(`${url}/upload-image`, formData)
            toast.success('ID Back image upload successfully!');

            const result = response.data;
            if (result) {
                const parsedData = {
                    imageUrl: result?.data?.imageUrl || '',
                };
                setLicenseDataback(parsedData);
            }
        } catch (error) {
            toast.error("Error in image uploading", error);
            console.error('Error during image upload:', error);
        }
    };




    const handleSave = async (e) => {
        e.preventDefault();


        if (!validateForm()) {
            alert('Please fill all required fields');
            return;
        }

        if (formData.imageUrl === '') {
            alert('Please upload id image');
            return;
        }

        try {
            const response = await axios.post(`${url}/check/add-check`, {
                imageUrl: formData.imageUrl || '',
                imageUrl2: formDataback.imageUrl || '',
                imageUrl3: licenseData.imageUrl || '',
                imageUrl4: licenseDataback.imageUrl || '',
                customerFirstName: formData.customerFirstName,
                customerLastName: formData.customerLastName,
                customerMiddleName: formData.customerMiddleName,
                licenseNo: licenseData.licenseNo,
                date: new Date(Date.now()).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
                company: formData.company,
                checkType: formData.checkType || 'Personal',
                amount: formData.amount,
                status: formData.status,
                extractedText: formData.extractedText,
                comment: formData.comment,
                venderId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                toast.success('Check added successfully!');

                // Reset all form states after success
                setFormData({
                    imageUrl: '',
                    customerFirstName: '',
                    customerLastName: '',
                    customerMiddleName: '',
                    company: '',
                    checkType: 'Personal',
                    amount: '',
                    status: '',
                    extractedText: '',
                    comment: ''
                });

                setLicenseData({
                    imageUrl: '',
                    licenseNo: ''
                });

                setPreviewCheckfront(null)
                setPreviewCheckback(null)

                setPreviewLicencefront(null)
                setPreviewLicenceback(null)

                setFormDataback({ imageUrl: '' });
                setLicenseDataback({ imageUrl: '' });
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
                                                                    <h6 className="text-445B64R fs-14 mb-1">Name</h6>
                                                                    <h6 className="text-0D161A fs-14 fw-semibold mb-0">{users?.firstname} {users?.lastname}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64R fs-14 mb-1">Phone Number</h6>
                                                                    <h6 className="text-0D161A fs-14 fw-semibold mb-0">{users?.mobile}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64R fs-14 mb-1">Email Address</h6>
                                                                    <h6 className="text-0D161A fs-14 fw-semibold mb-0">{users?.email}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64R fs-14 mb-1">Total Checks</h6>
                                                                    <h6 className="text-0D161A fs-14 fw-semibold mb-0">{cheques?.length}</h6>
                                                                </div>
                                                                <div className='mb-3 mb-lg-0'>
                                                                    <h6 className="text-445B64R fs-14 mb-1">Total Amount</h6>
                                                                    <h6 className="text-0D161A fs-14 fw-semibold mb-0">$ {totalAmount}</h6>
                                                                </div>

                                                            </div>
                                                            <div>

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
                                                        <button class="btn py-1 px-2 fs-14 text-white border-0 p-0 fw-medium" onClick={() => setShowModal(true)} style={{ background: '#008cff' }}><i class="fa fa-plus me-2"></i>Add Check</button>
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
                                                                                <td>{cheque?.date}</td>

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
                                                        <div className="card-body">
                                                            <div className="row g-3 new-check-form">
                                                                <div className="col-md-6">
                                                                    <label className="form-label text-445B64">Check Image</label>

                                                                    <div className="d-flex gap-2 gap-lg-3">
                                                                        <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkFrontRef} onChange={handleSubmit} style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div className="">
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                                                                <div className="text-445B64">Upload/Capture Front </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkBackRef} onChange={handleSubmitback} style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div className="">
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                                                                <div className="text-445B64">Upload/Capture Back </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        {previewCheckfront && (
                                                                            <div className='col-lg-6'>
                                                                                <label className="form-label text-445B64 mb-1 mt-3">Front Image</label>
                                                                                <div className='position-relative mt-3'>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                                                        onClick={handleCancelCheckFront}
                                                                                        style={{ zIndex: 1 }}
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                    <img src={previewCheckfront || formData.imageUrl} alt="Profile" loading="lazy" className='w-100 border rounded-4 overflow-hidden' />
                                                                                </div>
                                                                            </div>
                                                                        )}


                                                                        {previewCheckback && (
                                                                            <div className='col-lg-6'>
                                                                                <label className="form-label text-445B64 mb-1 mt-3">Back Image</label>
                                                                                <div className='position-relative mt-3'>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                                                        onClick={handleCancelCheckBack}
                                                                                        style={{ zIndex: 1 }}
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                    <img src={previewCheckback || formDataback.imageUrl} alt="Profile" loading="lazy" className='w-100 border rounded-4 overflow-hidden' />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>


                                                                <div className="col-md-6">
                                                                    <label className="form-label text-445B64">ID Image</label>
                                                                    <div className="d-flex gap-2 gap-lg-3">
                                                                        <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseFrontRef} onChange={handleSubmitLicense} style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div className="">
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                                                                <div className="text-445B64">Upload/Capture Front </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseBackRef} onChange={handleSubmitLicenseback} style={{ opacity: 0, cursor: 'pointer' }} />
                                                                            <div className="">
                                                                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                                                                <div className="text-445B64">Upload/Capture Back  </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">


                                                                        {previewLicencefront && (
                                                                            <div className='col-lg-6 '>
                                                                                <label className="form-label text-445B64 mb-1 mt-3">Front Image</label>
                                                                                <div className='position-relative mt-3'>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                                                        onClick={handleCancelLicenseFront}
                                                                                        style={{ zIndex: 1 }}
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                    <img
                                                                                        src={previewLicencefront || licenseData.imageUrl}
                                                                                        alt="Front License"
                                                                                        loading="lazy"
                                                                                        className='w-100 border rounded-4 overflow-hidden'
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {previewLicenceback && (
                                                                            <div className='col-lg-6'>
                                                                                <label className="form-label text-445B64 mb-1 mt-3">Back Image</label>
                                                                                <div className='position-relative mt-3'>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                                                        onClick={handleCancelLicenseBack}
                                                                                        style={{ zIndex: 1 }}
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                    <img
                                                                                        src={previewLicenceback || licenseDataback.imageUrl}
                                                                                        alt="Back License"
                                                                                        loading="lazy"
                                                                                        className='w-100 border rounded-4 overflow-hidden'
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className="col-lg-6"></div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12">
                                                                    <div className="row">
                                                                        <div className="col-md-9">
                                                                            <div className="row">
                                                                                <div className="col-md-4 mb-3">
                                                                                    <label className="form-label text-445B64">First Name <span className='text-danger'>*</span></label>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder='First name'
                                                                                        className={`form-control ${errors.customerFirstName ? 'border border-danger' : formData.customerFirstName ? 'border border-success' : ''}`}
                                                                                        value={formData.customerFirstName || ''}
                                                                                        onChange={(e) => {
                                                                                            const value = e.target.value;
                                                                                            setFormData({ ...formData, customerFirstName: value });
                                                                                            if (value.trim() !== '') {
                                                                                                setErrors((prev) => ({ ...prev, customerFirstName: null }));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    {errors.customerFirstName && (
                                                                                        <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                                                                            "Please fill the customer first name"
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-md-4 mb-3">
                                                                                    <label className="form-label text-445B64">Middle Name</label>
                                                                                    <input type="text" className="form-control" placeholder='Middle Name' value={formData.customerMiddleName} onChange={(e) => setFormData({ ...formData, customerMiddleName: e.target.value })} />
                                                                                </div>

                                                                                <div className="col-md-4 mb-3">
                                                                                    <label className="form-label text-445B64">Last Name <span className='text-danger'>*</span></label>
                                                                                    <input type="text"
                                                                                        className={`form-control ${errors.customerLastName ? 'border border-danger' : formData.customerLastName ? 'border border-success' : ''}`} placeholder='Last Name'
                                                                                        value={formData.customerLastName}
                                                                                        onChange={(e) => {
                                                                                            const value = e.target.value;
                                                                                            setFormData({ ...formData, customerLastName: value });
                                                                                            if (value.trim() !== '') {
                                                                                                setErrors((prev) => ({ ...prev, customerLastName: null }));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    {errors.customerLastName && (
                                                                                        <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                                                                            "Please fill the customer last name"
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-3 mb-3">
                                                                            <label className="form-label text-445B64">ID Number </label>
                                                                            <input type="text" className="form-control" value={licenseData.licenseNo} onChange={(e) => setLicenseData({ ...licenseData, licenseNo: e.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-3 mb-3 ">
                                                                            <label className="form-label text-445B64">Company</label>
                                                                            <input className="form-control" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-3 mb-3">
                                                                            <label className="form-label text-445B64"> Check Type </label>
                                                                            <select className="form-control" value={formData.checkType} onChange={(e) => { const value = e.target.value; setFormData({ ...formData, checkType: value }) }} >
                                                                                {/* <option value="">Select Check Type</option> */}
                                                                                <option value="Personal">Personal</option>
                                                                                <option value="Business">Business</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-md-3 mb-3">
                                                                            <label className="form-label text-445B64">Amount <span className='text-danger'>*</span></label>
                                                                            <input
                                                                                type="text"
                                                                                className={`form-control ${errors.amount ? 'border border-danger' : formData.amount ? 'border border-success' : ''}`}
                                                                                value={formData.amount || ''}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    setFormData({ ...formData, amount: value });
                                                                                    if (value.trim() !== '') {
                                                                                        setErrors((prev) => ({ ...prev, amount: null }));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            {errors.amount && (
                                                                                <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                                                                    "Please fill the amount"
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-3 mb-3 ">
                                                                            <label className="form-label text-445B64">Comment</label>
                                                                            <input className="form-control" value={formData.comment || ''} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
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

