import React, { useEffect } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const Home = () => {

  const venderId = localStorage.getItem("userId");
  const [status, setStatus] = useState({});

  const handleStatus = async () => {
    try {
      const response = await axios.get(`${url}/check/status-by-venderid/?venderId=${venderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status >= 200 && response.status < 300) {
        setStatus(response?.data || []);
      }
    } catch (error) {
      console.log("Error in fetching data");
    }
  }

  useEffect(() => {
    handleStatus();// eslint-disable-next-line
  }, [])

  return (
    <>
     
      <div className="container-fluid ">
        <Header />
        <div className="">
          <div className="row mh-100vh">
            <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
              <Sidebar />
            </div>
            <div className="col-lg-9 col-xl-10 bg-F6F6F6 mobile-background">
              <div className="main-content">
                <div className="container-fluid p-3 px-2">
                  {/* Status Cards */}
                  <div className="row mb-2">
                    <div className="col-md-6 col-xl-4 mb-3">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 16" fill="none">
                                <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-medium text-445B64">Today's Status</h6>
                              <h4 className="mb-0 text-00C7BE fw-bold">
                                $ {parseFloat(status?.day?.totalAmount || 0).toFixed(2)}
                              </h4>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between small">
                            <span className="badge bg-F5EEFF text-8A48E9 fs-12">{status?.day?.totalChecks || 0} New Checks</span>
                            <span className="badge bg-light-green-EFFFFE text-green-01A99A fs-12">{status?.day?.goodChecks || 0} Good Checks</span>
                            <span className="badge bg-FFF6F6 text-E84D4D fs-12">{status?.day?.badChecks || 0} Bad Checks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-4 mb-3">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 16" fill="none">
                                <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-medium text-445B64">Weekly Status</h6>
                              <h4 className="mb-0 text-00C7BE fw-bold">$ {parseFloat(status?.week?.totalAmount || 0).toFixed(2)}</h4>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between small">
                            <span className="badge bg-F5EEFF text-8A48E9 fs-12">{status?.week?.totalChecks || 0} New Checks</span>
                            <span className="badge bg-light-green-EFFFFE text-green-01A99A fs-12">{status?.week?.goodChecks || 0} Good Checks</span>
                            <span className="badge bg-FFF6F6 text-E84D4D fs-12">{status?.week?.badChecks || 0} Bad Checks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-4 mb-3">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 16" fill="none">
                                <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-medium text-445B64">Monthly Status</h6>
                              <h4 className="mb-0 text-00C7BE fw-bold">$ {parseFloat(status?.month?.totalAmount || 0).toFixed(2)}</h4>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between small">
                            <span className="badge bg-F5EEFF text-8A48E9 fs-12">{status?.month?.totalChecks || 0} New Checks</span>
                            <span className="badge bg-light-green-EFFFFE text-green-01A99A fs-12">{status?.month?.goodChecks || 0} Good Checks</span>
                            <span className="badge bg-FFF6F6 text-E84D4D fs-12">{status?.month?.badChecks || 0} Bad Checks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* New Check Form */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      {/* image-preview-Modal */}
    </>
  )
}

export default Home


