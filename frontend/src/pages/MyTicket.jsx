import React, { useEffect, useState } from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token')
const URL = process.env.REACT_APP_URL;

const MyTicket = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [ticketid, setTicketsId] = useState('');
    const [data, setData] = useState([]);
    const vendorId = localStorage.getItem("userId");
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const [filter, setFilter] = useState([]);

    const handleFilterChange = (e) => {
        const { value, checked } = e.target;
        setFilter(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleBack = () => {
        navigate(-1);
    }
    const fetchTickets = async () => {
        try {

            const vendorId = localStorage.getItem("userId");
            const response = await axios.get(`${URL}/complain/tickets/vendor/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status >= 200 && response.status < 300) {
                setTickets(response?.data || [])
            }
        } catch (error) {
            console.log("Error in fetching complaints" + error.message);
        }
    }
    useEffect(() => {
        fetchTickets();
    }, [])

    const getChat = async (id) => {
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

    const sendChat = async () => {
        if (!message.trim()) return;

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

const getStatusClass = (status) => {
  switch (status) {
    case 'open':
      return 'text-info'; // blue-ish
    case 'in_progress':
      return 'text-warning'; // orange/yellow
    case 'resolved':
      return 'text-success'; // green
    case 'closed':
      return 'text-danger'; // red
    default:
      return 'text-primary';
  }
};



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
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                                            <path d="M6 0.5C5.23002 0.5 4.49157 0.811674 3.94711 1.36646C3.40265 1.92124 3.09677 2.67368 3.09677 3.45827C3.09677 4.24285 3.40265 4.99529 3.94711 5.55008C4.49157 6.10486 5.23002 6.41653 6 6.41653C6.76998 6.41653 7.50843 6.10486 8.05289 5.55008C8.59735 4.99529 8.90323 4.24285 8.90323 3.45827C8.90323 2.67368 8.59735 1.92124 8.05289 1.36646C7.50843 0.811674 6.76998 0.5 6 0.5ZM2.90323 7.99427C2.13324 7.99427 1.3948 8.30595 0.850335 8.86073C0.305875 9.41551 0 10.168 0 10.9525V11.8897C0 12.4845 0.42271 12.991 0.99871 13.0864C4.31071 13.6379 7.68929 13.6379 11.0013 13.0864C11.2799 13.0397 11.5331 12.8938 11.716 12.6747C11.8989 12.4555 11.9995 12.1774 12 11.8897V10.9525C12 10.168 11.6941 9.41551 11.1497 8.86073C10.6052 8.30595 9.86676 7.99427 9.09677 7.99427H8.83355C8.68903 7.9948 8.54865 8.01741 8.41239 8.06212L7.74194 8.28537C6.61004 8.6619 5.38996 8.6619 4.25806 8.28537L3.58761 8.06212C3.45172 8.0177 3.30994 7.99482 3.16723 7.99427H2.90323Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">My Ticket</span>
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

                                        <div className="col-12">
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body p-2">
                                                    <div className="row">
                                                        <div className="col-12 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex">
                                                                    <div className="form-check me-3 me-lg-4">
                                                                        <input className="form-check-input table-checkbox"
                                                                            type="checkbox" value="open" id="flexCheckDefault" checked={filter.includes('open')} onChange={(e) => handleFilterChange(e)} />
                                                                        <label className="form-check-label ms-1 ms-lg-2" style={{ paddingTop: '2px' }} htmlFor="open">Open</label>
                                                                    </div>
                                                                    <div className="form-check me-3 me-lg-4">
                                                                        <input className="form-check-input table-checkbox"
                                                                            type="checkbox" value="in_progress" id="flexCheckDefault" checked={filter.includes('in_progress')} onChange={(e) => handleFilterChange(e)} />
                                                                        <label className="form-check-label ms-1 ms-lg-2" style={{ paddingTop: '2px' }} htmlFor="inprogress">In Progress</label>
                                                                    </div>
                                                                    <div className="form-check me-3 me-lg-4">
                                                                        <input className="form-check-input table-checkbox"
                                                                            type="checkbox" value="resolved" id="flexCheckDefault" checked={filter.includes('resolved')} onChange={(e) => handleFilterChange(e)}  />
                                                                        <label className="form-check-label ms-1 ms-lg-2" style={{ paddingTop: '2px' }} htmlFor="resolved">Resolved</label>
                                                                    </div>
                                                                    <div className="form-check me-3 me-lg-4">
                                                                        <input className="form-check-input table-checkbox"
                                                                            type="checkbox" value="closed" id="flexCheckDefault" checked={filter.includes('closed')} onChange={(e) => handleFilterChange(e)} />
                                                                        <label className="form-check-label ms-1 ms-lg-2" style={{ paddingTop: '2px' }} htmlFor="closed">Close</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="card border-0 rounded-3 mb-2 overflow-hidden">
                                                <div className="card-body p-0">
                                                    <div className="table-responsive">
                                                        <table className="table table-borderless">
                                                            <thead>
                                                                <tr>
                                                                    <th className='border-bottom'>S.No</th>
                                                                    <th className='border-bottom'>Subject</th>
                                                                    <th className='border-bottom'>Status</th>
                                                                    <th className='border-bottom'>Category</th>
                                                                    <th className='border-bottom'>Descrition</th>
                                                                    <th className='border-bottom'></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tickets?.filter(ticket => filter.length === 0 || filter.includes(ticket.status)).map((ticket, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <tr
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#ticket${index}`}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <td>{index + 1}</td>
                                                                            <td>{ticket.subject}</td>
                                                                            <td><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
                                                                            <td>{ticket.category}</td>
                                                                            <td>{ticket.description}</td>
                                                                            <td>
                                                                                <i
                                                                                    className="fa-solid fa-chevron-down text-01A99A"
                                                                                    onClick={() => getChat(ticket._id)}
                                                                                ></i>
                                                                            </td>
                                                                        </tr>

                                                                        <tr className="collapse" id={`ticket${index}`}>
                                                                            <td className="border-bottom bg-FAFAFA" colSpan="6">
                                                                                {data?.length > 0 ? (
                                                                                    data.map((chat, chatIndex) => (
                                                                                        <div key={chat._id || chatIndex} className="border-bottom mb-2">
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
                                                                                    <p className="text-muted">No chat messages found.</p>
                                                                                )}

                                                                                {/* Reply Box */}
                                                                                <div className="mt-3">
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

                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
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

export default MyTicket