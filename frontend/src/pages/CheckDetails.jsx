import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router"
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const CheckDetails = () => {
    const [checkDetails, setCheckDetails] = useState('');
    const [showIdNumber, setShowIdNumber] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchCheckDetails = async () => {
        try {

            const response = await axios.get(`${URL}/check/get-checkById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                setCheckDetails(response?.data?.data)
            }
        } catch (error) {
            console.log("Error in fetching check:" + error.message);
        }
    }

    useEffect(() => {
        fetchCheckDetails();// eslint-disable-next-line react-hooks/exhaustive-deps
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
                                            <div className="card border-0 rounded-3 mb-2">
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
                                                                    <span className="text-445B64 fw-medium">Check Information</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 col-lg-6">
                                                            <div className="d-flex justify-content-end">
                                                                <button onClick={handleBack} className="btn btn-sm rounded-2 btn-light text-445B64">
                                                                    <i className="fa-solid fa-arrow-left-long me-2 text-445B64"></i>
                                                                    Back
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">

                                            <div className="col-12">
                                                <div className="card border-0 rounded-3 mb-1">
                                                    <div className="card-body">
                                                        <div className="d-block d-lg-flex justify-content-between">
                                                            <div className="d-block d-lg-flex gap-5 flex-wrap">
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Customer Name</h6>
                                                                    <h6 className="text-0D161A fw-semibold fs-14">{checkDetails?.customerFirstName}</h6>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>
                                                                        <span className="me-2">ID Number</span>
                                                                        <i
                                                                            className={`fa-solid ${showIdNumber ? 'fa-eye-slash' : 'fa-eye'} text-muted`}
                                                                            onClick={() => setShowIdNumber(!showIdNumber)}
                                                                            style={{ cursor: 'pointer' }}
                                                                            title={showIdNumber ? 'Hide' : 'Show'}
                                                                        ></i>
                                                                    </h6>
                                                                    <div className="d-flex align-items-center">
                                                                        <h6 className="text-0D161A fw-semibold fs-14 me-2">
                                                                            {showIdNumber ? (checkDetails?.licenseNo || '-') : '••••••••••'}
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Company</h6>
                                                                    <h6 className="text-0D161A fw-semibold fs-14">{checkDetails?.company || 'Not available'}</h6>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Check Type</h6>
                                                                    <h6 className="text-0D161A fw-semibold fs-14">{checkDetails?.checkType}</h6>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Amount</h6>
                                                                    <h6 className="text-0D161A fw-semibold fs-14">$ {checkDetails?.amount}</h6>
                                                                </div>

                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Date & Time</h6>
                                                                    <h6 className="text-0D161A fw-semibold mb-0 fs-14">
                                                                        {checkDetails?.date}
                                                                    </h6>

                                                                </div>
                                                            </div>
                                                            {/* <div className="d-block d-lg-flex gap-3 align-checkDetails?s-start">
                                                                <div className="mb-3">
                                                                    <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Status</h6>
                                                                    <div>
                                                                        <button className={`btn btn-sm rounded-2 lh-1 text-white ${checkDetails?.isActive ? "bg-4FD1C5" : "bg-E84D4D"}`}>
                                                                            {checkDetails?.isActive ? "Active" : "Deactive"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>

                                                        <div className="d-block d-lg-flex gap-5 mt-3">
                                                            <div className="mb-3 w-100">
                                                                <h6 className="text-445B64 fs-14 mb-1" style={{ color: '#445B64' }}>Comments</h6>
                                                                <h6 className="text-0D161A fw-semibold fs-14 mb-0">{checkDetails?.comment || "No comments available."}</h6>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <div className='col-lg-6 mb-1 mb-lg-0'>
                                                        <div className="card border-0 rounded-3">
                                                            <div className="card-body">
                                                                <label className="form-label text-445B64">Check Image</label>
                                                                <div className="row">
                                                                    <div className="col-lg-6 mb-3 mb-lg-0">
                                                                        <label className="form-label text-445B64">Front Image</label>
                                                                        {checkDetails?.imageUrl ?
                                                                            <img src={checkDetails?.imageUrl} alt='Profile' className='w-100 border rounded-4 overflow-hidden' /> :
                                                                            <h6 className="text-secondary fs-14">Image not Available</h6>
                                                                        }
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <label className="form-label text-445B64">Back Image</label>
                                                                        {checkDetails?.imageUrl2 ?
                                                                            <img src={checkDetails?.imageUrl2} alt='Profile' className='w-100 border rounded-4 overflow-hidden' /> :
                                                                            <h6 className="text-secondary fs-14">Image not Available</h6>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6'>
                                                        <div className="card border-0 rounded-3">
                                                            <div className="card-body">
                                                                <label className="form-label text-445B64">ID Image</label>
                                                                <div className="row">
                                                                    <div className="col-lg-6 mb-3 mb-lg-0">
                                                                        <label className="form-label text-445B64">Front Image</label>
                                                                        {checkDetails?.imageUrl3 ?
                                                                            <img src={checkDetails?.imageUrl3} alt='Profile' className='w-100 border rounded-4 overflow-hidden' /> :
                                                                            <h6 className="text-secondary fs-14">Image not Found</h6>
                                                                        }
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <label className="form-label text-445B64">Back Image</label>
                                                                        {checkDetails?.imageUrl4 ?
                                                                            <img src={checkDetails?.imageUrl4} alt='Profile' className='w-100 border rounded-4 overflow-hidden' /> :
                                                                            <h6 className="text-secondary fs-14">Image not Found</h6>
                                                                        }
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
                </div>
            </div>
        </>
    )
}

export default CheckDetails