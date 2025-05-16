import React from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
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
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 17 20" fill="none">
                                                                            <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 13.19 3.81 17 8.5 17H9V20C13.86 17.66 17 13 17 8.5C17 3.81 13.19 0 8.5 0ZM9.5 14.5H7.5V12.5H9.5V14.5ZM9.5 11H7.5C7.5 7.75 10.5 8 10.5 6C10.5 4.9 9.6 4 8.5 4C7.4 4 6.5 4.9 6.5 6H4.5C4.5 3.79 6.29 2 8.5 2C10.71 2 12.5 3.79 12.5 6C12.5 8.5 9.5 8.75 9.5 11Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Ticket ID 0002</span>
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
                                                <div className="card-body p-2">
                                                    <div className="chat-container">
                                                        <div className="px-0 px-lg-5 pb-3">
                                                            <div className="chat-bubble-group align-self-start">
                                                                <div className="chat-message chat-message-left">
                                                                    Hello John, we are looking into it.
                                                                </div>
                                                                <div className="chat-timestamp ms-2">Apr 28, 2023 11:15 AM</div>
                                                            </div>

                                                            <div className="chat-bubble-group align-self-end">
                                                                <div className="chat-message chat-message-right">
                                                                    Hi, I'm unable to login to my account since yesterday. Please help.
                                                                </div>
                                                                <div className="chat-timestamp text-end me-2">Apr 27, 2023 11:32 AM</div>
                                                            </div>

                                                            <div className="d-flex chat-images my-2">
                                                                <img src="https://via.placeholder.com/70" alt="img1" />
                                                                <img src="https://via.placeholder.com/70" alt="img2" />
                                                                <img src="https://via.placeholder.com/70" alt="img3" />
                                                            </div>

                                                            <div className="chat-bubble-group align-self-start">
                                                                <div className="chat-message chat-message-left">
                                                                    Hello John, we are looking into it.
                                                                </div>
                                                                <div className="chat-timestamp ms-2">Apr 28, 2023 11:15 AM</div>
                                                            </div>

                                                            <div className="chat-bubble-group align-self-end">
                                                                <div className="chat-message chat-message-right">
                                                                    Hi, I'm unable to login to my account since yesterday. Please help.
                                                                </div>
                                                                <div className="chat-timestamp text-end me-2">Apr 27, 2023 11:32 AM</div>
                                                            </div>
                                                        </div>
                                                        <div className="chat-footer mt-auto pt-3 px-3 border-top" style={{ marginLeft: "-24px", marginRight: "-24px" }}>
                                                            <form className="d-flex flex-column gap-2">
                                                                <div className="input-group mb-3">
                                                                    <input type="text" className="form-control" placeholder="Write your reply" />
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="">
                                                                        <label htmlFor="formFile" className="btn bg-F6FFFE text-445B64 fs-14 d-inline-flex align-items-center" style={{ border: '1px solid #D7D7D7', cursor: 'pointer' }}>
                                                                            <i className="fa-solid fa-arrow-up-from-bracket text-01A99A fs-6 me-2"></i>
                                                                            Upload Attachment
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            id="formFile"
                                                                            className="d-none"
                                                                        />
                                                                    </div>
                                                                    <div className="">
                                                                        <button className="btn sign-btn py-2 px-5 fs-14">
                                                                            Send reply
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
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

export default Chat