import React from 'react'
import mobLogo from '../assets/images/EzKash.png'
import profileImg from '../assets/images/userImg.png'
import { Link } from 'react-router-dom'

const MobileHeader = () => {
    return (
        <>
            <nav class="navbar fixed-top bg-body-tertiary border-bottom shadow-sm">
                <div class="container-fluid">
                    <a class="navbar-brand p-0" href="#">
                        <img src={mobLogo} alt="Logo" class="d-inline-block align-text-top" />
                    </a>
                    <button class="btn border-0 bg-transparent" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                            <path d="M0 2H25.6668" stroke="#008CFF" stroke-width="2.5" />
                            <path d="M5 12L26 12" stroke="#008CFF" stroke-width="2.5" />
                            <path d="M0 22.5335H25.6668" stroke="#008CFF" stroke-width="2.5" />
                        </svg>
                    </button>
                </div>
            </nav>

            <div class="offcanvas offcanvas-start MobSidebarBg" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="staticBackdropLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div>
                        <ul className="nav nav-pills flex-column mb-auto gap-2">
                            <li>
                                <div className="mb-2">
                                    <img src={profileImg} alt="" className="" />
                                </div>
                                <h5 className="text-white mb-1">Cody Fisher</h5>
                                <h6 className="text-white fw-normal">alma.lawson@example.com</h6>
                            </li>
                            <li>
                                <Link to="/checks" className="link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#FFFFFF" />
                                        </svg>
                                    </div>
                                    <span className="">Checks</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M7.66289 3.4675C7.61927 3.42578 7.56124 3.40249 7.50088 3.40249C7.44052 3.40249 7.38248 3.42578 7.33887 3.4675L1.94531 8.61994C1.92241 8.64185 1.90418 8.66818 1.89175 8.69734C1.87931 8.72649 1.87291 8.75787 1.87295 8.78957L1.87207 13.6253C1.87207 13.8739 1.97084 14.1124 2.14666 14.2882C2.32247 14.464 2.56093 14.5628 2.80957 14.5628H5.625C5.74932 14.5628 5.86855 14.5134 5.95645 14.4255C6.04436 14.3376 6.09375 14.2184 6.09375 14.0941V10.1097C6.09375 10.0475 6.11844 9.98791 6.1624 9.94396C6.20635 9.9 6.26596 9.87531 6.32812 9.87531H8.67187C8.73403 9.87531 8.79365 9.9 8.8376 9.94396C8.88155 9.98791 8.90625 10.0475 8.90625 10.1097V14.0941C8.90625 14.2184 8.95563 14.3376 9.04354 14.4255C9.13145 14.5134 9.25068 14.5628 9.375 14.5628H12.1893C12.4379 14.5628 12.6764 14.464 12.8522 14.2882C13.028 14.1124 13.1268 13.8739 13.1268 13.6253V8.78957C13.1268 8.75787 13.1204 8.72649 13.108 8.69734C13.0955 8.66818 13.0773 8.64185 13.0544 8.61994L7.66289 3.4675Z" fill="#FFFFFF" />
                                            <path d="M14.3826 7.6537L12.1912 5.55722V2.37587C12.1912 2.25155 12.1418 2.13232 12.0539 2.04441C11.966 1.95651 11.8468 1.90712 11.7225 1.90712H10.3162C10.1919 1.90712 10.0727 1.95651 9.98476 2.04441C9.89685 2.13232 9.84747 2.25155 9.84747 2.37587V3.31337L8.15059 1.69091C7.9918 1.53036 7.75567 1.43837 7.5005 1.43837C7.2462 1.43837 7.01065 1.53036 6.85186 1.6912L0.620421 7.65312C0.438195 7.8289 0.415343 8.11806 0.581163 8.30849C0.622803 8.35655 0.673789 8.39564 0.731016 8.42338C0.788244 8.45112 0.850517 8.46692 0.914046 8.46983C0.977575 8.47273 1.04103 8.46268 1.10055 8.44028C1.16007 8.41788 1.21441 8.38361 1.26026 8.33954L7.33936 2.53056C7.38298 2.48883 7.44102 2.46555 7.50138 2.46555C7.56174 2.46555 7.61977 2.48883 7.66339 2.53056L13.7431 8.33954C13.8326 8.42542 13.9526 8.47229 14.0766 8.46988C14.2007 8.46746 14.3187 8.41596 14.4049 8.32665C14.5848 8.14032 14.5698 7.8327 14.3826 7.6537Z" fill="#FFFFFF" />
                                        </svg>
                                    </div>
                                    <span className="">Dashboard</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/report" className="link">
                                    <div className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                            <path d="M7.875 6.45H12.6875L7.875 1.775V6.45ZM1.75 0.5H8.75L14 5.6V15.8C14 16.2509 13.8156 16.6833 13.4874 17.0021C13.1592 17.3209 12.7141 17.5 12.25 17.5H1.75C1.28587 17.5 0.840752 17.3209 0.512563 17.0021C0.184374 16.6833 0 16.2509 0 15.8V2.2C0 1.2565 0.77875 0.5 1.75 0.5ZM2.625 15.8H4.375V10.7H2.625V15.8ZM6.125 15.8H7.875V9H6.125V15.8ZM9.625 15.8H11.375V12.4H9.625V15.8Z" fill="#FFFFFF" />
                                        </svg>
                                    </div>
                                    <span className="">Report</span>
                                </Link>
                            </li>
                            <li>
                                <button className="link text-white w-100">
                                    <div className="sidebar-icon">
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                    </div>
                                    <span className="">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MobileHeader