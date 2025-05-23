import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom';
const token = localStorage.getItem('token')
const URL = process.env.REACT_APP_URL;


const Chat = () => {
    const navigate = useNavigate();
    const { id } = useParams()

    const handleBack = () => {
        navigate(-1);
    }

    const [ticketid, setTicketsId] = useState('');
    const [data, setData] = useState([]);
    const vendorId = localStorage.getItem("userId");
    const [message, setMessage] = useState();
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const getChat = async () => {
        try {
            setTicketsId(id)
            const response = await axios.get(`${URL}/complain/tickets/chat/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setData(response?.data || []);
            }
        } catch (error) {
            console.log("Error fetching chat:", error);
        }
    }

    useEffect(() => {
        getChat();// eslint-disable-next-line
    }, [id])


    const sendChat = async () => {
        // if (!message.trim()) return;
        const payload = {
            ticketId: ticketid,
            senderId: vendorId,
            message,
            image: image
        };

        try {
            const response = await axios.post(`${URL}/complain/tickets/chat/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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


    return (
        <>
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
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 17 20" fill="none">
                                                                            <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 13.19 3.81 17 8.5 17H9V20C13.86 17.66 17 13 17 8.5C17 3.81 13.19 0 8.5 0ZM9.5 14.5H7.5V12.5H9.5V14.5ZM9.5 11H7.5C7.5 7.75 10.5 8 10.5 6C10.5 4.9 9.6 4 8.5 4C7.4 4 6.5 4.9 6.5 6H4.5C4.5 3.79 6.29 2 8.5 2C10.71 2 12.5 3.79 12.5 6C12.5 8.5 9.5 8.75 9.5 11Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-lg-6">
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
                                        <div className="col-12 chat-section">
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body">
                                                    <div className="chat-container">
                                                        <div className="px-3 msg-section px-lg-5 pb-3">

                                                            {data?.length > 0 ? (
                                                                data.map((chat, chatIndex) => (
                                                                    <div key={chat._id || chatIndex} className="chat-bubble-group d-flex flex-column mb-3 align-self-start">
                                                                        {chat?.message ?
                                                                            <div className={`chat-message ${chat?.senderId?.role === 'vendor' ? 'chat-message-right' : 'chat-message-left'}`}>
                                                                                {chat?.message}
                                                                            </div> : ''
                                                                        }
                                                                        <div className={`${chat?.senderId?.role === 'vendor' ? 'text-end' : 'text-start'}`}>
                                                                            {chat?.image && (
                                                                                <>
                                                                                    <div className="">
                                                                                        <img
                                                                                            src={chat?.image}
                                                                                            alt="chat"
                                                                                            className='rounded-4'
                                                                                            style={{ maxWidth: '200px', cursor: 'pointer' }}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#imagePreviewModal"
                                                                                            onClick={() => setPreviewImage(chat?.image)}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className={`chat-timestamp ${chat?.senderId?.role === 'vendor' ? 'me-2 text-end' : 'ms-2 text-start'}`}>
                                                                            {moment(chat?.createdAt).format("MMM DD, YYYY hh:mm A")}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted">No chat messages found.</p>
                                                            )}

                                                        </div>

                                                        <div className="chat-footer mt-auto pt-3 px-3 border-top">
                                                            <div className="d-flex flex-column gap-2">
                                                                <div className="mb-3">
                                                                    <textarea
                                                                        className="form-control bg-FAFAFA fs-14"
                                                                        placeholder="Write your reply"
                                                                        rows="3"
                                                                        value={message}
                                                                        onChange={(e) => setMessage(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                                e.preventDefault(); // prevent new line
                                                                                sendChat();         // trigger send function
                                                                            }
                                                                        }}
                                                                    />

                                                                </div>

                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <div>
                                                                        <label
                                                                            htmlFor="formFile"
                                                                            className="btn bg-F6FFFE text-445B64 fs-14 d-inline-flex align-items-center"
                                                                            style={{ border: '1px solid #D7D7D7', cursor: 'pointer' }}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-up-from-bracket text-01A99A fs-6 me-2"></i>
                                                                            Upload Attachment
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            id="formFile"
                                                                            className="d-none"
                                                                            onChange={handleUpload}
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <button className="btn sign-btn py-2 px-4 fs-14" onClick={sendChat}>
                                                                            <div className="d-none d-md-block">Send reply</div> 
                                                                            <div className="d-block d-md-none">
                                                                                <i class="fa-solid fa-paper-plane text-white"></i>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {image && (
                                                                    <div className='row mb-3'>
                                                                        <div className="col-md-6 col-lg-4">
                                                                            <img src={image} alt="Attachment Preview" loading="lazy" className='w-100 border rounded-4' />
                                                                        </div>
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
                </div>
            </div>

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

export default Chat