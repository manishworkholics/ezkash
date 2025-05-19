import React, { useEffect, useState } from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate, useParams } from "react-router"
import axios from 'axios';
import moment from 'moment';
const URL = process.env.REACT_APP_URL;

const TicketDetails = () => {

    const [ticketDetails, setticketDetails] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams()
    const adminId = localStorage.getItem("adminId");
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const fetchticketDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/admin/tickets/get-ticketsById/${id}`);
            if (response.status >= 200 && response.status < 300) {
                setticketDetails(response?.data)
            }
        } catch (error) {
            console.log("Error in fetching ticket:" + error.message);
        } finally {
            setLoading(false);
        }
    }
    const handleBack = () => {
        navigate(-1)
    }



    const getChat = async () => {
        try {

            const response = await axios.get(`${URL}/complain/tickets/chat/${id}`);

            if (response.status >= 200 && response.status < 300) {
                setData(response?.data || []);
            }
        } catch (error) {
            console.log("Error fetching chat:", error);
        }
    }

    const sendChat = async () => {
        if (!message.trim()) return;

        const payload = {
            ticketId: id,
            senderId: adminId,
            message,
            image: image
        };

        try {
            const response = await axios.post(`${URL}/complain/tickets/chat/`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setMessage('');
                setImage('');
                getChat(response?.data?.chat?.ticketId); // refresh chat
            }
        } catch (error) {
            console.error('Send chat error:', error);
        }
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a image.");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post(`${URL}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const result = response.data;
            if (result) {
                setImage(result?.data?.imageUrl);
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchticketDetails();// eslint-disable-next-line react-hooks/exhaustive-deps
        getChat();// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 12 13" fill="none">
                                                                            <path d="M6 0.5C2.68941 0.5 0 2.786 0 5.6C0 8.414 2.68941 10.7 6 10.7H6.35294V12.5C9.78353 11.096 12 8.3 12 5.6C12 2.786 9.31059 0.5 6 0.5ZM6.70588 9.2H5.29412V8H6.70588V9.2ZM6.70588 7.1H5.29412C5.29412 5.15 7.41177 5.3 7.41177 4.1C7.41177 3.44 6.77647 2.9 6 2.9C5.22353 2.9 4.58824 3.44 4.58824 4.1H3.17647C3.17647 2.774 4.44 1.7 6 1.7C7.56 1.7 8.82353 2.774 8.82353 4.1C8.82353 5.6 6.70588 5.75 6.70588 7.1Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Ticket ID 0002</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 col-lg-6 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end">
                                                                <button className="btn btn-sm rounded-2 btn-light text-445B64" onClick={handleBack}>
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
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body p-0">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="border-bottom">
                                                                <div className="row gap-3 p-3">
                                                                    <div className="col-12 col-lg-3 col-xl-2 ">
                                                                        <select className="form-control bg-F0F5F6">
                                                                            <option value="">New</option>
                                                                            <option value="Personal">New 1</option>
                                                                            <option value="Business">New 2</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-12 col-lg-3 col-xl-2">
                                                                        <select className="form-control bg-F0F5F6">
                                                                            <option value="">Jane smith</option>
                                                                            <option value="Personal">New 1</option>
                                                                            <option value="Business">New 2</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="d-lg-flex ">
                                                                    <div className="w-100 w-lg-50">
                                                                        <h6 className="text-445B64 fw-semibold p-3 mb-0 border-end border-bottom">User Info</h6>
                                                                        <div className="border-end">
                                                                            <div className="table-responsive p-2">
                                                                                <table className="table mb-0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td className='text-445B64-img w-60px border-0'>Name</td>
                                                                                            <td><span className="text-445B64-img border-0">-</span> {ticketDetails?.vendorId?.firstname} {ticketDetails?.vendorId?.lastname}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td className='text-445B64-img w-60px border-0'>Email</td>
                                                                                            <td><span className="text-445B64-img border-0">-</span> {ticketDetails?.vendorId?.email}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td className='text-445B64-img w-60px border-0'>Phone</td>
                                                                                            <td><span className="text-445B64-img border-0">-</span> {ticketDetails?.vendorId?.mobile}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-100 w-lg-50">
                                                                        <h6 className="text-445B64 fw-semibold p-3 mb-0  border-bottom">Ticket Info</h6>
                                                                        <div className="table-responsive p-2">
                                                                            <table className="table mb-0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td className='text-445B64-img w-110px border-0'>Priority</td>
                                                                                        <td><span className="text-445B64-img border-0">-</span> High</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td className='text-445B64-img w-110px border-0'>Created</td>
                                                                                        <td><span className="text-445B64-img border-0">-</span>  {moment(ticketDetails?.createdAt).format("MMM DD, YYYY hh:mm A")}</td>

                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td className='text-445B64-img w-110px border-0'>Last Updated</td>
                                                                                        <td><span className="text-445B64-img border-0">-</span> {moment(ticketDetails?.updatedAt).format("MMM DD, YYYY hh:mm A")}</td>
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
                                        <div className="col-12">
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body p-0">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {data?.length > 0 ? (
                                                                data.map((chat, chatIndex) => (
                                                                    <div key={chat._id || chatIndex} className="border-bottom py-2 px-3">
                                                                        <div className="text-muted fs-13 mb-1">
                                                                            {moment(chat?.createdAt).format("MMM DD, YYYY hh:mm A")}
                                                                        </div>
                                                                        <h6 className="fs-14">
                                                                            <strong>{chat?.senderId?.role === 'vendor' ? 'Vendor' : 'Admin'}:</strong> {chat?.message}
                                                                        </h6>
                                                                        <div className="">
                                                                            {chat?.image ? <img
                                                                                src={chat?.image}
                                                                                style={{ maxHeight: '200px', cursor: 'pointer' }}
                                                                                alt="chat"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#imagePreviewModal"
                                                                                onClick={() => setPreviewImage(chat?.image)}
                                                                            /> : <></>}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted p-3">No chat messages found.</p>
                                                            )}



                                                            {/* Reply Box */}
                                                            <div className="mt-3 p-3">
                                                                <textarea
                                                                    className="form-control bg-FAFAFA mb-3 fs-14"
                                                                    placeholder="Write your reply"
                                                                    rows="3"
                                                                    value={message}
                                                                    onChange={(e) => setMessage(e.target.value)}
                                                                />

                                                                <div className="mb-3">
                                                                    <label htmlFor="formFile" className="btn bg-F6FFFE text-445B64 fs-14 d-inline-flex align-items-center" style={{ border: '1px solid #D7D7D7', cursor: 'pointer' }}>
                                                                        <i className="fa-solid fa-arrow-up-from-bracket text-4FD1C5 fs-6 me-2"></i>
                                                                        Upload Attachment
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id="formFile"
                                                                        className="d-none"
                                                                        onChange={handleUpload}
                                                                    />
                                                                </div>

                                                                {image && (
                                                                    <div className='row mb-3'>
                                                                        <div className="col-md-6 col-lg-4">
                                                                            <img src={image} alt="Attachment Preview" className='w-100 border rounded-4' />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="d-flex justify-content-between">
                                                                    <button
                                                                        className="btn sign-btn py-2 px-5 fs-14"
                                                                        onClick={sendChat}
                                                                    >
                                                                        Send reply
                                                                    </button>
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
            </div >

            {/* Image Preview Modal */}
            <div className="modal fade" id="imagePreviewModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" style={{ width: 'fit-content' }}>
                    <div className="modal-content bg-transparent border-0 shadow rounded-4">
                        <div className="modal-body text-center p-0">
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="img-fluid rounded-4" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TicketDetails