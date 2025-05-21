import React, { useEffect, useState } from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios'
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token')
const URL = process.env.REACT_APP_URL;

const MyTicket = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

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
                                                                <button className="btn btn-sm rounded-2 btn-secondary text-white" onClick={handleBack}>
                                                                    <i className="fa-solid fa-arrow-left-long me-2 text-white"></i>
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
                                                                <div className="d-flex flex-wrap">
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
                                                                            type="checkbox" value="resolved" id="flexCheckDefault" checked={filter.includes('resolved')} onChange={(e) => handleFilterChange(e)} />
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
                                                                    <th className='border-bottom'>#</th>
                                                                    <th className='border-bottom'>Subject</th>
                                                                    <th className='border-bottom'>Category</th>
                                                                    <th className='border-bottom'>Descrition</th>
                                                                    <th className='border-bottom'>Created</th>
                                                                    <th className='border-bottom'>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tickets?.filter(ticket => filter.length === 0 || filter.includes(ticket.status)).map((ticket, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <tr className="">
                                                                            <td>{index + 1}</td>
                                                                            <td>
                                                                                <Link to={`/chat/${ticket._id}`} className='text-capitalize'>
                                                                                    {ticket.subject.length > 40 ? ticket.subject.substring(0, 40) + '...' : ticket.subject}
                                                                                </Link>
                                                                            </td>
                                                                            <td>{ticket.category.length > 40 ? ticket.category.substring(0, 40) + '...' : ticket.category}</td>
                                                                            <td>{ticket.description.length > 40 ? ticket.description.substring(0, 40) + '...' : ticket.description}</td>
                                                                            <td>{moment(ticket?.createdAt).format("MMM DD, YYYY hh:mm A")}</td>
                                                                            <td><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
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


        </>
    )
}

export default MyTicket