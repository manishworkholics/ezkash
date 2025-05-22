import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';


import { useNavigate } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword';
const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId")
                const res = await axios.get(`${URL}/auth/get-venderById/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(res.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setTimeout(() => {
            toast.success("Logged out successfully!")
        }, 1000);
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

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
                                                        <div className="col-8 col-lg-6">
                                                            <div className="d-flex justify-content-between mb-lg-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="table-circular-icon bg-F0F5F6 me-3"
                                                                        style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                                                            <path d="M6 7.25C6.625 7.25 7.15625 7.03125 7.59375 6.59375C8.03125 6.15625 8.25 5.625 8.25 5C8.25 4.375 8.03125 3.84375 7.59375 3.40625C7.15625 2.96875 6.625 2.75 6 2.75C5.375 2.75 4.84375 2.96875 4.40625 3.40625C3.96875 3.84375 3.75 4.375 3.75 5C3.75 5.625 3.96875 6.15625 4.40625 6.59375C4.84375 7.03125 5.375 7.25 6 7.25ZM1.5 12.5C1.0875 12.5 0.734375 12.3531 0.440625 12.0594C0.146875 11.7656 0 11.4125 0 11V2C0 1.5875 0.146875 1.23438 0.440625 0.940625C0.734375 0.646875 1.0875 0.5 1.5 0.5H10.5C10.9125 0.5 11.2656 0.646875 11.5594 0.940625C11.8531 1.23438 12 1.5875 12 2V11C12 11.4125 11.8531 11.7656 11.5594 12.0594C11.2656 12.3531 10.9125 12.5 10.5 12.5H1.5ZM1.5 11H10.5C9.975 10.2875 9.31562 9.73438 8.52187 9.34062C7.72812 8.94687 6.8875 8.75 6 8.75C5.1125 8.75 4.27187 8.94687 3.47812 9.34062C2.68437 9.73438 2.025 10.2875 1.5 11Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">User</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 col-lg-6">
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

                                        <div className="col-md-12 mb-3">
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="d-flex gap-5">
                                                            <div>
                                                                <h6 className="fs-14 mb-2">
                                                                    <span className="fw-normal" style={{ color: '#445B64' }}>Full Name : </span> <br />
                                                                    <span className="text-0D161A fw-semibold">{userData?.firstname && userData?.lastname
                                                                        ? `${userData?.firstname} ${userData?.lastname}`
                                                                        : 'Loading...'}</span>
                                                                </h6>
                                                                <h6 className="fs-14 mb-2">
                                                                    <span className="fw-normal" style={{ color: '#445B64' }}>Mobile : </span> <br />
                                                                    <span className="text-0D161A fw-semibold">+(1) {userData?.mobile} </span>
                                                                </h6>
                                                                <h6 className="fs-14 mb-0">
                                                                    <span className="fw-normal" style={{ color: '#445B64' }}>Email : </span> <br />
                                                                    <span className="text-0D161A fw-semibold">{userData?.email || 'Loading...'}</span>
                                                                </h6>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-5">
                                                            <div className="mb-3">
                                                                <div className="d-flex justify-content-end">
                                                                    <button className="btn btn-sm rounded-2 bg-E4FFFD text-01A99A" onClick={handleLogout}>
                                                                        Logout
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <h6 className="fw-semibold">Change Password</h6>
                                            <div className="card border-0 rounded-3 mb-2">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-xl-5 col-xxl-4">
                                                            <ChangePassword />
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
    );
};

export default Profile;
