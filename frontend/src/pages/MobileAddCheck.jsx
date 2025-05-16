import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import uploadPng from '../assets/images/upload-png.png'
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const MobileAddCheck = () => {
    const navigate = useNavigate();

    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');

    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const skipStep = () => setStep(3);


    const licenseFrontRef = useRef(null);
    const licenseBackRef = useRef(null);
    const checkFrontRef = useRef(null);
    const checkBackRef = useRef(null);
    const venderId = localStorage.getItem("userId");
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);


    const [formData, setFormData] = useState({ customerFirstName: '', customerMiddleName: '', customerLastName: '', licenseNo: '', date: '', company: '', checkType: 'Personal', amount: '', imageUrl: '', extractedText: '', });

    const [formDataback, setFormDataback] = useState({ imageUrl: '' });

    const [licenseData, setLicenseData] = useState({ imageUrl: '', name: '', licenseNo: '', class: '', dob: '', sex: '', eyes: '', height: '', address: '', issuedDate: '', expiryDate: '', });

    const [licenseDataback, setLicenseDataback] = useState({ imageUrl: '' });

    const handleCancelLicenseFront = () => { setLicenseData({ ...licenseData, imageUrl: '', licenseNo: '' }); if (licenseFrontRef.current) { licenseFrontRef.current.value = ''; } };

    const handleCancelLicenseBack = () => { setLicenseDataback({ ...licenseDataback, imageUrl: '' }); if (licenseBackRef.current) { licenseBackRef.current.value = ''; } };

    const handleCancelCheckFront = () => { setFormData({ ...formData, imageUrl: '', customerFirstName: '', customerMiddleName: '', customerLastName: '', amount: '' }); if (checkFrontRef.current) { checkFrontRef.current.value = ''; } };

    const handleCancelCheckBack = () => { setFormDataback({ ...formDataback, imageUrl: '' }); if (checkBackRef.current) { checkBackRef.current.value = ''; } };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const [errors, setErrors] = useState({});

    const requiredFields = ['customerFirstName', 'amount'];

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach(field => {
            const value = formData[field];
            if (!value || value.trim() === '') {
                if (field === 'customerFirstName') {
                    newErrors.customerFirstName = 'Please fill this field';
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
        if (file) {
            setFileName(file.name);
            setFileSize(formatBytes(file.size));

        } else {
            alert("Please upload a Check image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            setLoading(true)
            const response = await axios.post(`${URL}/scan-check`, formData)
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
        } finally {
            setLoading(false)
        }
    };

    const handleSubmitback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileSize(formatBytes(file.size));

        } else {
            alert("Please upload a Check image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            setLoading1(true)
            const response = await axios.post(`${URL}/upload-image`, formData)
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
        } finally {
            setLoading1(false)
        }
    };

    const handleSubmitLicense = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileSize(formatBytes(file.size));

        } else {
            alert("Please upload a ID image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            setLoading2(true)
            const response = await axios.post(`${URL}/scan-license`, formData)
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
        } finally {
            setLoading2(false)
        }
    };

    const handleSubmitLicenseback = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileSize(formatBytes(file.size));

        } else {
            alert("Please upload a ID image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            setLoading3(true)
            const response = await axios.post(`${URL}/upload-image`, formData)
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
        } finally {
            setLoading3(false)
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();


        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        if (formData.imageUrl == '') {
            toast.error('Please upload Check image');
            return;
        }

        try {
            const response = await axios.post(`${URL}/check/add-check`, {
                imageUrl: formData.imageUrl || '',
                imageUrl2: formDataback.imageUrl || '',
                imageUrl3: licenseData.imageUrl || '',
                imageUrl4: licenseDataback.imageUrl || '',
                customerFirstName: formData.customerFirstName,
                customerLastName: formData.customerLastName,
                customerMiddleName: formData.customerMiddleName,
                licenseNo: licenseData.licenseNo,
                date: new Date(Date.now()).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
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
                venderId: venderId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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

            setFormDataback({ imageUrl: '' });
            setLicenseDataback({ imageUrl: '' });
            navigate(-1)
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form');
        }
    };

    return (
        <>
            <div className="form-container">
                {step === 1 && (
                    <div>
                        <div className="container-fluid mobile-bg d-block d-lg-none position-relative" style={{ minHeight: '100vh' }}>
                            <div className="card border-0 bg-transparent">
                                <div className="card-header bg-transparent p-3" style={{ margin: '0 -12px' }}>
                                    <Link to='/dashboard'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM1 8V9H17V8V7H1V8Z" fill="black" />
                                        </svg>
                                    </Link>
                                    <span className="fs-6 ms-2 text-000000 fw-semibold">Upload Check Image</span>
                                </div>
                                <div className="card-body bg-transparent px-0">
                                    <div className="mb-4">
                                        <div className="form-control inputFile p-4 mb-3 text-center position-relative d-flex justify-content-center align-items-center">
                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkFrontRef} onChange={handleSubmit} style={{ opacity: 0, cursor: 'pointer' }} />
                                            {/* image box */}

                                            {loading ? (
                                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center py-5 px-5 bg-white">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>

                                            ) : (
                                                <>
                                                    {formData?.imageUrl && (
                                                        <>
                                                            <div
                                                                className="position-absolute w-100 h-100 top-0 start-0"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#formData"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <div className="position-relative w-100 h-100">
                                                                    <i class="fa-solid fa-expand expand-img-icon"></i>
                                                                    <img
                                                                        src={formData.imageUrl}
                                                                        alt="Profile"
                                                                        className="w-100 h-100 border rounded-4 overflow-hidden"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Bootstrap Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id="formData"
                                                                tabIndex="-1"
                                                                aria-labelledby="imagePreviewLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-footer position-absolute top-0 end-0 border-0 p-0 bg-transparent">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary rounded-circle"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            <i class="fa-solid fa-xmark"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-content overflow-hidden bg-transparent border-0">

                                                                        <div className="modal-body p-0">
                                                                            <img
                                                                                src={formData.imageUrl}
                                                                                alt="Preview"
                                                                                className="img-fluid w-100 rounded"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            {/* image box */}
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="35" viewBox="0 0 46 35" fill="none">
                                                    <path d="M24.625 34.875V25.125H31.125L23 15.375L14.875 25.125H21.375V34.875H13.25V34.7938C12.977 34.81 12.717 34.875 12.4375 34.875C9.20517 34.875 6.10524 33.591 3.81964 31.3054C1.53404 29.0198 0.25 25.9198 0.25 22.6875C0.25 16.4345 4.97875 11.3385 11.0465 10.6398C11.5785 7.85871 13.063 5.34997 15.2446 3.54502C17.4262 1.74007 20.1685 0.751736 23 0.75C25.8319 0.751565 28.5747 1.73977 30.7569 3.54468C32.939 5.3496 34.4241 7.85843 34.9567 10.6398C41.0245 11.3385 45.7467 16.4345 45.7467 22.6875C45.7467 25.9198 44.4627 29.0198 42.1771 31.3054C39.8915 33.591 36.7916 34.875 33.5592 34.875C33.2862 34.875 33.023 34.81 32.7467 34.7938V34.875H24.625Z" fill="#008CFF" />
                                                </svg>
                                                <div className="text-445B64 fw-semibold mt-3">Upload or Capture Front Image </div>
                                            </div>
                                        </div>
                                        {formData?.imageUrl && (
                                            <div className="card bg-transparent">
                                                <div className="card-body bg-transparent p-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 13 17" fill="none">
                                                                <path d="M7.29175 6.125V1.77083L11.6459 6.125M1.75008 0.583334C0.871331 0.583334 0.166748 1.28792 0.166748 2.16667V14.8333C0.166748 15.2533 0.333563 15.656 0.630496 15.9529C0.927428 16.2499 1.33016 16.4167 1.75008 16.4167H11.2501C11.67 16.4167 12.0727 16.2499 12.3697 15.9529C12.6666 15.656 12.8334 15.2533 12.8334 14.8333V5.33333L8.08342 0.583334H1.75008Z" fill="#008CFF" />
                                                            </svg>
                                                            <div className="ms-2">
                                                                <h6 className="fs-13 text-000000 mb-0">{fileName}</h6>
                                                                <h6 className="fs-10 text-000000 mb-0">{fileSize}</h6>
                                                            </div>
                                                        </div>
                                                        <button className="border-0 bg-transparent" type="button" onClick={handleCancelCheckFront}>
                                                            <i class="fa-solid fa-trash text-FF0808"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="">
                                        <div className="form-control inputFile p-4 mb-3 text-center position-relative d-flex justify-content-center align-items-center">
                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkBackRef} onChange={handleSubmitback} style={{ opacity: 0, cursor: 'pointer' }} />
                                            {loading1 ? (
                                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center py-5 px-5 bg-white">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>

                                            ) : (
                                                <>
                                                    {formDataback?.imageUrl && (
                                                        <>
                                                            <div
                                                                className="position-absolute w-100 h-100 top-0 start-0"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#formDataback"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <div className="position-relative w-100 h-100">
                                                                    <i class="fa-solid fa-expand expand-img-icon"></i>
                                                                    <img
                                                                        src={formDataback.imageUrl}
                                                                        alt="Profile"
                                                                        className="w-100 h-100 border rounded-4 overflow-hidden"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Bootstrap Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id="formDataback"
                                                                tabIndex="-1"
                                                                aria-labelledby="imagePreviewLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-footer position-absolute top-0 end-0 border-0 p-0 bg-transparent">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary rounded-circle"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            <i class="fa-solid fa-xmark"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-content overflow-hidden bg-transparent border-0">
                                                                        <div className="modal-body p-0">
                                                                            <img
                                                                                src={formDataback.imageUrl}
                                                                                alt="Preview"
                                                                                className="img-fluid w-100 rounded"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="35" viewBox="0 0 46 35" fill="none">
                                                    <path d="M24.625 34.875V25.125H31.125L23 15.375L14.875 25.125H21.375V34.875H13.25V34.7938C12.977 34.81 12.717 34.875 12.4375 34.875C9.20517 34.875 6.10524 33.591 3.81964 31.3054C1.53404 29.0198 0.25 25.9198 0.25 22.6875C0.25 16.4345 4.97875 11.3385 11.0465 10.6398C11.5785 7.85871 13.063 5.34997 15.2446 3.54502C17.4262 1.74007 20.1685 0.751736 23 0.75C25.8319 0.751565 28.5747 1.73977 30.7569 3.54468C32.939 5.3496 34.4241 7.85843 34.9567 10.6398C41.0245 11.3385 45.7467 16.4345 45.7467 22.6875C45.7467 25.9198 44.4627 29.0198 42.1771 31.3054C39.8915 33.591 36.7916 34.875 33.5592 34.875C33.2862 34.875 33.023 34.81 32.7467 34.7938V34.875H24.625Z" fill="#008CFF" />
                                                </svg>
                                                <div className="text-445B64 fw-semibold mt-3">Upload or Capture Back Image </div>
                                            </div>
                                        </div>
                                        {formDataback?.imageUrl && (
                                            <div className="card bg-transparent">
                                                <div className="card-body bg-transparent p-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 13 17" fill="none">
                                                                <path d="M7.29175 6.125V1.77083L11.6459 6.125M1.75008 0.583334C0.871331 0.583334 0.166748 1.28792 0.166748 2.16667V14.8333C0.166748 15.2533 0.333563 15.656 0.630496 15.9529C0.927428 16.2499 1.33016 16.4167 1.75008 16.4167H11.2501C11.67 16.4167 12.0727 16.2499 12.3697 15.9529C12.6666 15.656 12.8334 15.2533 12.8334 14.8333V5.33333L8.08342 0.583334H1.75008Z" fill="#008CFF" />
                                                            </svg>
                                                            <div className="ms-2">
                                                                <h6 className="fs-13 text-000000 mb-0">{fileName}</h6>
                                                                <h6 className="fs-10 text-000000 mb-0">{fileSize}</h6>
                                                            </div>
                                                        </div>
                                                        <button className="border-0 bg-transparent" onClick={handleCancelCheckBack}>
                                                            <i class="fa-solid fa-trash text-FF0808"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="">
                                            <img src={uploadPng} alt="" className="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card position-absolute mt-4 bg-transparent start-0 bottom-0 w-100 border-0 mb-5">
                                <div className="card-body" style={{ padding: '12px' }}>
                                    <button className='theme-btn w-100' onClick={nextStep}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="container-fluid mobile-bg d-block d-lg-none position-relative" style={{ minHeight: '100vh' }}>
                            <div className="card border-0 bg-transparent">
                                <div className="card-header bg-transparent p-3" style={{ margin: '0 -12px' }}>
                                    <button className="border-0 bg-transparent" onClick={prevStep}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM1 8V9H17V8V7H1V8Z" fill="black" />
                                        </svg>
                                    </button>
                                    <span className="fs-6 ms-2 text-000000 fw-semibold">Upload ID Image</span>
                                </div>
                                <div className="card-body bg-transparent px-0">
                                    <div className="mb-4">
                                        <div className="form-control inputFile p-4 mb-3 text-center position-relative d-flex justify-content-center align-items-center">
                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseFrontRef} onChange={handleSubmitLicense} style={{ opacity: 0, cursor: 'pointer' }} />

                                            {loading2 ? (
                                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center py-5 px-5 bg-white">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>

                                            ) : (
                                                <>
                                                    {licenseData?.imageUrl && (
                                                        <>
                                                            <div
                                                                className="position-absolute w-100 h-100 top-0 start-0"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#licenseData"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <div className="position-relative w-100 h-100">
                                                                    <i class="fa-solid fa-expand expand-img-icon"></i>
                                                                    <img
                                                                        src={licenseData.imageUrl}
                                                                        alt="Profile"
                                                                        className="w-100 h-100 border rounded-4 overflow-hidden"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Bootstrap Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id="licenseData"
                                                                tabIndex="-1"
                                                                aria-labelledby="imagePreviewLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-footer position-absolute top-0 end-0 border-0 p-0 bg-transparent">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary rounded-circle"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            <i class="fa-solid fa-xmark"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-content overflow-hidden bg-transparent border-0">
                                                                        <div className="modal-body p-0">
                                                                            <img
                                                                                src={licenseData.imageUrl}
                                                                                alt="Preview"
                                                                                className="img-fluid w-100 rounded"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="35" viewBox="0 0 46 35" fill="none">
                                                    <path d="M24.625 34.875V25.125H31.125L23 15.375L14.875 25.125H21.375V34.875H13.25V34.7938C12.977 34.81 12.717 34.875 12.4375 34.875C9.20517 34.875 6.10524 33.591 3.81964 31.3054C1.53404 29.0198 0.25 25.9198 0.25 22.6875C0.25 16.4345 4.97875 11.3385 11.0465 10.6398C11.5785 7.85871 13.063 5.34997 15.2446 3.54502C17.4262 1.74007 20.1685 0.751736 23 0.75C25.8319 0.751565 28.5747 1.73977 30.7569 3.54468C32.939 5.3496 34.4241 7.85843 34.9567 10.6398C41.0245 11.3385 45.7467 16.4345 45.7467 22.6875C45.7467 25.9198 44.4627 29.0198 42.1771 31.3054C39.8915 33.591 36.7916 34.875 33.5592 34.875C33.2862 34.875 33.023 34.81 32.7467 34.7938V34.875H24.625Z" fill="#008CFF" />
                                                </svg>
                                                <div className="text-445B64 fw-semibold mt-3">Upload or Capture Front Image </div>
                                            </div>
                                        </div>
                                        {licenseData?.imageUrl && (
                                            <div className="card bg-transparent">
                                                <div className="card-body bg-transparent p-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 13 17" fill="none">
                                                                <path d="M7.29175 6.125V1.77083L11.6459 6.125M1.75008 0.583334C0.871331 0.583334 0.166748 1.28792 0.166748 2.16667V14.8333C0.166748 15.2533 0.333563 15.656 0.630496 15.9529C0.927428 16.2499 1.33016 16.4167 1.75008 16.4167H11.2501C11.67 16.4167 12.0727 16.2499 12.3697 15.9529C12.6666 15.656 12.8334 15.2533 12.8334 14.8333V5.33333L8.08342 0.583334H1.75008Z" fill="#008CFF" />
                                                            </svg>
                                                            <div className="ms-2">
                                                                <h6 className="fs-13 text-000000 mb-0">{fileName}</h6>
                                                                <h6 className="fs-10 text-000000 mb-0">{fileSize}</h6>
                                                            </div>
                                                        </div>
                                                        <button className="border-0 bg-transparent" onClick={handleCancelLicenseFront}>
                                                            <i class="fa-solid fa-trash text-FF0808"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        <div className="form-control inputFile p-4 mb-3 text-center position-relative d-flex justify-content-center align-items-center">
                                            <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseBackRef} onChange={handleSubmitLicenseback} style={{ opacity: 0, cursor: 'pointer' }} />

                                            {loading3 ? (
                                                <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center py-5 px-5 bg-white">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>

                                            ) : (
                                                <>
                                                    {licenseDataback?.imageUrl && (
                                                        <>
                                                            <div
                                                                className="position-absolute w-100 h-100 top-0 start-0"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#licenseDataback"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <div className="position-relative w-100 h-100">
                                                                    <i class="fa-solid fa-expand expand-img-icon"></i>
                                                                    <img
                                                                        src={licenseDataback.imageUrl}
                                                                        alt="Profile"
                                                                        className="w-100 h-100 border rounded-4 overflow-hidden"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Bootstrap Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id="licenseDataback"
                                                                tabIndex="-1"
                                                                aria-labelledby="imagePreviewLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-footer position-absolute top-0 end-0 border-0 p-0 bg-transparent">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary rounded-circle"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            <i class="fa-solid fa-xmark"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-content overflow-hidden bg-transparent border-0">
                                                                        <div className="modal-body p-0">
                                                                            <img
                                                                                src={licenseDataback.imageUrl}
                                                                                alt="Preview"
                                                                                className="img-fluid w-100 rounded"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="35" viewBox="0 0 46 35" fill="none">
                                                    <path d="M24.625 34.875V25.125H31.125L23 15.375L14.875 25.125H21.375V34.875H13.25V34.7938C12.977 34.81 12.717 34.875 12.4375 34.875C9.20517 34.875 6.10524 33.591 3.81964 31.3054C1.53404 29.0198 0.25 25.9198 0.25 22.6875C0.25 16.4345 4.97875 11.3385 11.0465 10.6398C11.5785 7.85871 13.063 5.34997 15.2446 3.54502C17.4262 1.74007 20.1685 0.751736 23 0.75C25.8319 0.751565 28.5747 1.73977 30.7569 3.54468C32.939 5.3496 34.4241 7.85843 34.9567 10.6398C41.0245 11.3385 45.7467 16.4345 45.7467 22.6875C45.7467 25.9198 44.4627 29.0198 42.1771 31.3054C39.8915 33.591 36.7916 34.875 33.5592 34.875C33.2862 34.875 33.023 34.81 32.7467 34.7938V34.875H24.625Z" fill="#008CFF" />
                                                </svg>
                                                <div className="text-445B64 fw-semibold mt-3">Upload or Capture Back Image </div>
                                            </div>
                                        </div>
                                        {licenseDataback?.imageUrl && (
                                            <div className="card bg-transparent">
                                                <div className="card-body bg-transparent p-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 13 17" fill="none">
                                                                <path d="M7.29175 6.125V1.77083L11.6459 6.125M1.75008 0.583334C0.871331 0.583334 0.166748 1.28792 0.166748 2.16667V14.8333C0.166748 15.2533 0.333563 15.656 0.630496 15.9529C0.927428 16.2499 1.33016 16.4167 1.75008 16.4167H11.2501C11.67 16.4167 12.0727 16.2499 12.3697 15.9529C12.6666 15.656 12.8334 15.2533 12.8334 14.8333V5.33333L8.08342 0.583334H1.75008Z" fill="#008CFF" />
                                                            </svg>
                                                            <div className="ms-2">
                                                                <h6 className="fs-13 text-000000 mb-0">{fileName}</h6>
                                                                <h6 className="fs-10 text-000000 mb-0">{fileSize}</h6>
                                                            </div>
                                                        </div>
                                                        <button className="border-0 bg-transparent" onClick={handleCancelLicenseBack}>
                                                            <i class="fa-solid fa-trash text-FF0808"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card position-absolute bg-transparent start-0 bottom-0 w-100 border-0 mb-5">
                                <div className="card-body bg-transparent" style={{ padding: '12px' }}>
                                    <button className='w-100 border-0 bg-transparent text-secondary mb-3 fw-semibold' onClick={skipStep}>Skip</button>
                                    <button className='theme-btn w-100' onClick={nextStep}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="container-fluid mobile-bg d-block d-lg-none position-relative" style={{ minHeight: '100vh' }}>
                            <div className="card border-0 bg-transparent">
                                <div className="card-header bg-transparent p-3" style={{ margin: '0 -12px' }}>
                                    <button className="border-0 bg-transparent" onClick={prevStep}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM1 8V9H17V8V7H1V8Z" fill="black" />
                                        </svg>
                                    </button>
                                    <span className="fs-6 ms-2 text-000000 fw-semibold">Verify & Submit </span>
                                </div>
                                <div className="card-body bg-transparent px-0">
                                    <div className="row">
                                        <div className="col-12 mb-3 input-wrapper">
                                            {/* <label className="form-label text-445B64">Customer Name <span className='text-danger'>*</span></label> */}
                                            <input
                                                type="text"
                                                placeholder=''
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
                                            <label className="floating-label">
                                                First Name <span className="required">*</span>
                                            </label>
                                            {errors.customerFirstName && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                                    "Please fill the customer first name"
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12 mb-3 input-wrapper">
                                            <input type="text" className="form-control" placeholder='' value={formData.customerMiddleName} onChange={(e) => setFormData({ ...formData, customerMiddleName: e.target.value })} />
                                            <label className="floating-label">
                                                Middle Name
                                            </label>
                                        </div>
                                        <div className="col-12 mb-3 input-wrapper">
                                            <input type="text" className="form-control" placeholder='' value={formData.customerLastName} onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })} />
                                            <label className="floating-label">
                                                Last Name <span className="required">*</span>
                                            </label>
                                        </div>
                                        <div className="col-12 mb-3 input-wrapper">
                                            {/* <label className="form-label text-445B64">ID Number </label> */}
                                            <input type="text" className="form-control" placeholder='' value={licenseData.licenseNo || formData.licenseNo} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                                            <label className="floating-label">
                                                ID Number
                                            </label>
                                        </div>
                                        <div className="col-12 mb-3 position-relative">
                                            {/* <label className="form-label text-445B64"> Check Type </label> */}
                                            <svg style={{ position: 'absolute', top: '13px', right: '24px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                                <path d="M4.869 10.1308C4.811 10.0743 4.563 9.86094 4.359 9.6622C3.076 8.49708 0.976 5.45762 0.335 3.86678C0.232 3.62518 0.014 3.01437 0 2.68802C0 2.3753 0.072 2.0772 0.218 1.79274C0.422 1.43814 0.743 1.15368 1.122 0.997808C1.385 0.897467 2.172 0.741598 2.186 0.741598C3.047 0.585728 4.446 0.5 5.992 0.5C7.465 0.5 8.807 0.585728 9.681 0.713346C9.695 0.727959 10.673 0.883829 11.008 1.05431C11.62 1.36702 12 1.97784 12 2.63151V2.68802C11.985 3.11374 11.605 4.00901 11.591 4.00901C10.949 5.51413 8.952 8.48344 7.625 9.67681C7.625 9.67681 7.284 10.0129 7.071 10.159C6.765 10.387 6.386 10.5 6.007 10.5C5.584 10.5 5.19 10.3724 4.869 10.1308Z" fill="#4E4E4E" />
                                            </svg>
                                            <select className="form-control" value={formData.checkType} onChange={(e) => { const value = e.target.value; setFormData({ ...formData, checkType: value }) }} >
                                                {/* <option value="">Select Check Type</option> */}
                                                <option value="Personal">Personal</option>
                                                <option value="Business">Business</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mb-3 input-wrapper">
                                            {/* <label className="form-label text-445B64">Amount <span className='text-danger'>*</span></label> */}
                                            <input
                                                type="text"
                                                placeholder=''
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
                                            <label className="floating-label">
                                                Amount <span className="required">*</span>
                                            </label>
                                            {errors.amount && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                                    "Please fill the amount"
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 mb-3 input-wrapper">
                                            {/* <label className="form-label text-445B64">Company</label> */}
                                            <input
                                                type="text"
                                                placeholder=''
                                                className={`form-control ${errors.company ? 'border border-danger' : formData.company ? 'border border-success' : ''}`}
                                                value={formData.company || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({ ...formData, company: value });
                                                }}
                                            />
                                            <label className="floating-label">
                                                Company
                                            </label>
                                        </div>
                                        <div className="col-12 mb-3">
                                            {/* <label className="form-label text-445B64">Comment</label> */}
                                            <textarea className="form-control" placeholder='Comment' value={formData.comment || ''} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
                                        </div>
                                    </div>
                                </div >
                            </div >
                            <div className="card position-absolute bg-transparent start-0 bottom-0 w-100 border-0 mb-5">
                                <div className="card-body bg-transparent" style={{ padding: '12px' }}>
                                    <button type="submit" className='theme-btn w-100' onClick={handleSave}>Submit</button>
                                </div>
                            </div>
                        </div >
                    </div >
                )}
            </div >



            {/* Modal for image preview */}
            < div
                className="modal fade"
                id="imagePreviewModal"
                tabIndex="-1"
                aria-labelledby="imagePreviewLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="img-fluid w-100 rounded"
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileAddCheck