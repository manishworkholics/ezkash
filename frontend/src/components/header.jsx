import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/images/EzKash.png'
// import supportIconImg from '../assets/images/supportIconImg.png';
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profileImg from '../assets/images/userImg.png'
const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const Header = () => {

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

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
            toast.success("Logged out successfully!")
        }, 1000);
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <>
            <div className="header w-100">
                <nav className="navbar navbar-expand-lg bg-body-white shadow-sm px-3 w-100">
                    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <div className="d-flex align-items-center">
                        <Link className="navbar-brand d-flex align-items-center" to='/dashboard'>
                            <img src={logo} alt="" className="" />
                        </Link>
                    </div>
                    {/* Navbar right-side */}

                    <ul className="navbar-nav ms-auto mb-lg-0 d-flex flex-row">
                        {/* <li className="nav-item me-lg-0 d-none d-lg-block">
                            <Link className="nav-link header-icon me-2" to=''>
                                <i className="fa-solid fa-bell fs-5"></i>
                            </Link>
                        </li> */}
                        <li className="nav-item dropdown me-2 me-lg-4 d-none d-lg-block">
                            <Link className="nav-link header-icon dropdown-toggle " to='' data-bs-toggle="dropdown">
                                <i className="fa-solid fa-circle-user fs-5"></i>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end mt-3">
                                <li><Link className="dropdown-item" to='/profile'>Profile</Link></li>
                                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </li>
                        <li className="nav-item me-lg-0 d-block d-lg-none">
                            <Link className="nav-link" to=''>
                                <button className="btn border-0 bg-transparent p-0 mb-lg-1 mb-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                                        <path d="M0 2H25.6668" stroke="#008CFF" stroke-width="2.5" />
                                        <path d="M5 12L26 12" stroke="#008CFF" stroke-width="2.5" />
                                        <path d="M0 22.5335H25.6668" stroke="#008CFF" stroke-width="2.5" />
                                    </svg>
                                </button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="offcanvas offcanvas-start w-100 w-md-50 MobSidebarBg " data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header border-0">
                    <div className="navbar-brand">
                        {/* <img src={logo} alt="" className="me-2" /> */}
                    </div>
                    <button type="button" className="border-0 ms-auto bg-transparent" data-bs-dismiss="offcanvas" aria-label="Close">
                        <i class="fa-solid fa-x text-white fs-2 mb-0 fw-normal"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="d-flex flex-column px-1 w-100">
                        <ul className="nav nav-pills flex-column mb-auto gap-2">
                            <li>
                                <div className="mb-2">
                                    <img src={profileImg} alt="" className="" />
                                </div>
                                <h5 className="text-white mb-1">{userData?.firstname} {userData?.lastname}</h5>
                                <h6 className="text-white fw-normal">{userData?.email}</h6>
                            </li>
                            <li>
                                <NavLink to="/checks" className="nav-link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#ffffff" />
                                        </svg>
                                    </div>
                                    <span className="">Checks</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className="nav-link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M7.66289 3.4675C7.61927 3.42578 7.56124 3.40249 7.50088 3.40249C7.44052 3.40249 7.38248 3.42578 7.33887 3.4675L1.94531 8.61994C1.92241 8.64185 1.90418 8.66818 1.89175 8.69734C1.87931 8.72649 1.87291 8.75787 1.87295 8.78957L1.87207 13.6253C1.87207 13.8739 1.97084 14.1124 2.14666 14.2882C2.32247 14.464 2.56093 14.5628 2.80957 14.5628H5.625C5.74932 14.5628 5.86855 14.5134 5.95645 14.4255C6.04436 14.3376 6.09375 14.2184 6.09375 14.0941V10.1097C6.09375 10.0475 6.11844 9.98791 6.1624 9.94396C6.20635 9.9 6.26596 9.87531 6.32812 9.87531H8.67187C8.73403 9.87531 8.79365 9.9 8.8376 9.94396C8.88155 9.98791 8.90625 10.0475 8.90625 10.1097V14.0941C8.90625 14.2184 8.95563 14.3376 9.04354 14.4255C9.13145 14.5134 9.25068 14.5628 9.375 14.5628H12.1893C12.4379 14.5628 12.6764 14.464 12.8522 14.2882C13.028 14.1124 13.1268 13.8739 13.1268 13.6253V8.78957C13.1268 8.75787 13.1204 8.72649 13.108 8.69734C13.0955 8.66818 13.0773 8.64185 13.0544 8.61994L7.66289 3.4675Z" fill="#ffffff" />
                                            <path d="M14.3826 7.6537L12.1912 5.55722V2.37587C12.1912 2.25155 12.1418 2.13232 12.0539 2.04441C11.966 1.95651 11.8468 1.90712 11.7225 1.90712H10.3162C10.1919 1.90712 10.0727 1.95651 9.98476 2.04441C9.89685 2.13232 9.84747 2.25155 9.84747 2.37587V3.31337L8.15059 1.69091C7.9918 1.53036 7.75567 1.43837 7.5005 1.43837C7.2462 1.43837 7.01065 1.53036 6.85186 1.6912L0.620421 7.65312C0.438195 7.8289 0.415343 8.11806 0.581163 8.30849C0.622803 8.35655 0.673789 8.39564 0.731016 8.42338C0.788244 8.45112 0.850517 8.46692 0.914046 8.46983C0.977575 8.47273 1.04103 8.46268 1.10055 8.44028C1.16007 8.41788 1.21441 8.38361 1.26026 8.33954L7.33936 2.53056C7.38298 2.48883 7.44102 2.46555 7.50138 2.46555C7.56174 2.46555 7.61977 2.48883 7.66339 2.53056L13.7431 8.33954C13.8326 8.42542 13.9526 8.47229 14.0766 8.46988C14.2007 8.46746 14.3187 8.41596 14.4049 8.32665C14.5848 8.14032 14.5698 7.8327 14.3826 7.6537Z" fill="#ffffff" />
                                        </svg>
                                    </div>
                                    <span className="">Dashboard</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/report" className="nav-link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                            <path d="M7.875 6.45H12.6875L7.875 1.775V6.45ZM1.75 0.5H8.75L14 5.6V15.8C14 16.2509 13.8156 16.6833 13.4874 17.0021C13.1592 17.3209 12.7141 17.5 12.25 17.5H1.75C1.28587 17.5 0.840752 17.3209 0.512563 17.0021C0.184374 16.6833 0 16.2509 0 15.8V2.2C0 1.2565 0.77875 0.5 1.75 0.5ZM2.625 15.8H4.375V10.7H2.625V15.8ZM6.125 15.8H7.875V9H6.125V15.8ZM9.625 15.8H11.375V12.4H9.625V15.8Z" fill="#ffffff" />
                                        </svg>
                                    </div>
                                    <span className="">Report</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" className="nav-link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M10.6667 8.16663C11.3612 8.16663 11.9515 7.92357 12.4376 7.43746C12.9237 6.95135 13.1667 6.36107 13.1667 5.66663C13.1667 4.97218 12.9237 4.3819 12.4376 3.89579C11.9515 3.40968 11.3612 3.16663 10.6667 3.16663C9.9723 3.16663 9.38203 3.40968 8.89591 3.89579C8.4098 4.3819 8.16675 4.97218 8.16675 5.66663C8.16675 6.36107 8.4098 6.95135 8.89591 7.43746C9.38203 7.92357 9.9723 8.16663 10.6667 8.16663ZM5.66675 14C5.20841 14 4.81605 13.8368 4.48966 13.5104C4.16328 13.184 4.00008 12.7916 4.00008 12.3333V2.33329C4.00008 1.87496 4.16328 1.4826 4.48966 1.15621C4.81605 0.82982 5.20841 0.666626 5.66675 0.666626H15.6667C16.1251 0.666626 16.5174 0.82982 16.8438 1.15621C17.1702 1.4826 17.3334 1.87496 17.3334 2.33329V12.3333C17.3334 12.7916 17.1702 13.184 16.8438 13.5104C16.5174 13.8368 16.1251 14 15.6667 14H5.66675ZM2.33341 17.3333C1.87508 17.3333 1.48272 17.1701 1.15633 16.8437C0.829943 16.5173 0.666748 16.125 0.666748 15.6666V3.99996H2.33341V15.6666H14.0001V17.3333H2.33341ZM5.66675 12.3333H15.6667C15.0834 11.5416 14.3508 10.927 13.4688 10.4895C12.5869 10.052 11.6529 9.83329 10.6667 9.83329C9.68064 9.83329 8.74661 10.052 7.86466 10.4895C6.98272 10.927 6.25008 11.5416 5.66675 12.3333Z" fill="#ffffff" />
                                        </svg>
                                    </div>
                                    <span className="">Profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/support' className="nav-link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                                            <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 13.19 3.81 17 8.5 17H9V20C13.86 17.66 17 13 17 8.5C17 3.81 13.19 0 8.5 0ZM9.5 14.5H7.5V12.5H9.5V14.5ZM9.5 11H7.5C7.5 7.75 10.5 8 10.5 6C10.5 4.9 9.6 4 8.5 4C7.4 4 6.5 4.9 6.5 6H4.5C4.5 3.79 6.29 2 8.5 2C10.71 2 12.5 3.79 12.5 6C12.5 8.5 9.5 8.75 9.5 11Z" fill="white" />
                                        </svg>
                                    </div>
                                    <span className="">Help</span>
                                </NavLink>
                            </li>
                            <li>
                                <button className="nav-link w-100" onClick={handleLogout}>
                                    <div className="sidebar-icon">
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                    </div>
                                    <span className="">Logout</span>
                                </button>
                            </li>
                        </ul>
                        {/* <div className="position-relative">
                            <div className="position-absolute bottom-0 left-0 w-100 mb-3" style={{ paddingRight: '7px' }}>
                                <div className="card sidebarSupport border-0" style={{ borderRadius: '24px' }}>
                                    <div className="card-body bg-transparent p-xxl-3">
                                        <img src={supportIconImg} alt="" className='mb-4' />
                                        <h6 className="text-white fw-semibold ">Need help?</h6>
                                        <h6 className="text-white fw-normal mb-3 fs-13">Please check our docs</h6>
                                        <NavLink to='/support' className="btn fs-13 fw-semibold border-0 py-2 text-00C7BE bg-white w-100" style={{ borderRadius: '12px' }}>
                                            <span className="">Go To Help Center</span>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header