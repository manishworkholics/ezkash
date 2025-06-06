import React, { useEffect, useState } from 'react'
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom'
import BorderBtm from '../assets/images/boderBtm.png'
const URL = process.env.REACT_APP_URL;

const Dashboard = () => {
    const [data, setData] = useState();
    const [checkStatus, setcheckStatus] = useState([]);
    const [renderKey, setRenderKey] = useState(0);

    const fetchDatas = async () => {
        try {
            const response = await axios.get(`${URL}/admin/dashboard-detail`);
            if (response.status >= 200 && response.status < 300) {
                const fetchedData = response?.data;
                setData(fetchedData);
                setcheckStatus(fetchedData?.chart?.checkStatus);
            }
        } catch (error) {
            console.error("Error in fetching data", error);
        }
    };


    const options = {
        chart: {
            type: "pie"
        },
        labels: checkStatus.map(item => item.label),
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ]
    };

    const series = checkStatus.map(item => item.value);


    useEffect(() => {
        setTimeout(() => {
            fetchDatas();
        }, 0);// eslint-disable-next-line

    }, [])

    useEffect(() => {
        if (checkStatus.length > 0) {
            setRenderKey(prev => prev + 1); // trigger rerender when data is fetched
        }
    }, [checkStatus]);


    return (
        <>
            <div className="container-fluid">
                <Header />
                <div className="">
                    <div className="row mh-100vh">
                        <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
                            <Sidebar />
                        </div>
                        <div className="col-lg-10 col-xl-10 bg-F6F6F6 dashboard-page">
                            <div className="main-content">
                                <div className="container-fluid p-3 px-2">
                                    {/* Status Cards */}
                                    <div className="row mb-2">
                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <Link to="/cd-admin/user-list" className='text-decoration-none'>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-F2F2F7 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                    <path d="M14.6667 18.6667H5.33333V16H14.6667M18.6667 13.3333H5.33333V10.6667H18.6667M18.6667 8H5.33333V5.33333H18.6667M21.3333 0H2.66667C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V2.66667C24 1.95942 23.719 1.28115 23.219 0.781048C22.7189 0.280951 22.0406 0 21.3333 0Z" fill="#000000" />
                                                                </svg>
                                                            </div>

                                                            <div>
                                                                <h6 className="mb-1 fw-medium text-445B64">Total Users</h6>
                                                                <h4 className="mb-0 text-00C7BE fw-bold">{data?.totalVendor}</h4>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <Link to="/cd-admin/all-cheques" className='text-decoration-none'>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-F2F2F7 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                    <path d="M14.6667 18.6667H5.33333V16H14.6667M18.6667 13.3333H5.33333V10.6667H18.6667M18.6667 8H5.33333V5.33333H18.6667M21.3333 0H2.66667C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V2.66667C24 1.95942 23.719 1.28115 23.219 0.781048C22.7189 0.280951 22.0406 0 21.3333 0Z" fill="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-1 fw-medium text-445B64">New Checks</h6>
                                                                <h4 className="mb-0 text-00C7BE fw-bold">{data?.newCheck}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-F2F2F7 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M14.6667 18.6667H5.33333V16H14.6667M18.6667 13.3333H5.33333V10.6667H18.6667M18.6667 8H5.33333V5.33333H18.6667M21.3333 0H2.66667C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V2.66667C24 1.95942 23.719 1.28115 23.219 0.781048C22.7189 0.280951 22.0406 0 21.3333 0Z" fill="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1 fw-medium text-445B64">Today’s Status</h6>
                                                            <h4 className="mb-0 text-00C7BE fw-bold">${parseFloat(data?.todayStatus || 0).toFixed(2)}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-F2F2F7 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M14.6667 18.6667H5.33333V16H14.6667M18.6667 13.3333H5.33333V10.6667H18.6667M18.6667 8H5.33333V5.33333H18.6667M21.3333 0H2.66667C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V2.66667C24 1.95942 23.719 1.28115 23.219 0.781048C22.7189 0.280951 22.0406 0 21.3333 0Z" fill="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1 fw-medium text-445B64">Weekly Status</h6>
                                                            <h4 className="mb-0 text-00C7BE fw-bold">${parseFloat(data?.weeklyStatus || 0).toFixed(2)}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-F2F2F7 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M14.6667 18.6667H5.33333V16H14.6667M18.6667 13.3333H5.33333V10.6667H18.6667M18.6667 8H5.33333V5.33333H18.6667M21.3333 0H2.66667C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V2.66667C24 1.95942 23.719 1.28115 23.219 0.781048C22.7189 0.280951 22.0406 0 21.3333 0Z" fill="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1 fw-medium text-445B64">Monthly Status</h6>
                                                            <h4 className="mb-0 text-00C7BE fw-bold"> ${parseFloat(data?.monthlyStatus || 0).toFixed(2)}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-12 col-lg-6 col-xl-7 col-xxl-8 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="row pb-2">
                                                        <div className="col-4 mt-auto">
                                                            <h6 className="mb-0 text-445B64">Statically view</h6>
                                                        </div>
                                                        <div className="col-8 d-flex justify-content-end">
                                                            <div className="bg-F6F6F6 p-1 rounded-3 d-flex align-items-center">
                                                                <ul className="nav nav-pills" id="chartTabs" role="tablist">
                                                                    <li className="nav-item" role="presentation">
                                                                        <button
                                                                            className="nav-link badge fs-14 fw-normal"
                                                                            id="daily-tab"
                                                                            data-bs-toggle="tab"
                                                                            data-bs-target="#daily"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="daily"
                                                                            aria-selected="true"
                                                                        >
                                                                            Daily
                                                                        </button>
                                                                    </li>
                                                                    <li className="nav-item" role="presentation">
                                                                        <button
                                                                            className="nav-link badge active fs-14 fw-normal"
                                                                            id="weekly-tab"
                                                                            data-bs-toggle="tab"
                                                                            data-bs-target="#weekly"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="weekly"
                                                                            aria-selected="false"
                                                                        >
                                                                            Weekly
                                                                        </button>
                                                                    </li>
                                                                    <li className="nav-item" role="presentation">
                                                                        <button
                                                                            className="nav-link badge fs-14 fw-normal"
                                                                            id="monthly-tab"
                                                                            data-bs-toggle="tab"
                                                                            data-bs-target="#monthly"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="monthly"
                                                                            aria-selected="false"
                                                                        >
                                                                            Monthly
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <img src={BorderBtm} alt="" className="w-100" />
                                                        </div>
                                                    </div>
                                                    {/* Tab Panes */}
                                                    <div className="tab-content" id="chartTabsContent">
                                                        {/* Daily */}
                                                        <div
                                                            className="tab-pane fade"
                                                            id="daily"
                                                            role="tabpanel"
                                                            aria-labelledby="daily-tab"
                                                        >
                                                            <Chart
                                                                options={{
                                                                    chart: { id: 'weekly-bar' },
                                                                    xaxis: { categories: ['Today'] },

                                                                    colors: ['#008CFF'],
                                                                    plotOptions: {
                                                                        bar: {
                                                                            borderRadius: 10, // Set bar corner radius here
                                                                            horizontal: false, // Keep bars vertical
                                                                        },
                                                                    },
                                                                }}
                                                                series={[{ name: 'Checks', data: data?.chart?.daily || [] }]}
                                                                type="bar"
                                                                height={250}
                                                            />
                                                        </div>

                                                        {/* Weekly */}
                                                        <div
                                                            className="tab-pane fade show active"
                                                            id="weekly"
                                                            role="tabpanel"
                                                            aria-labelledby="weekly-tab"
                                                        >
                                                            <Chart
                                                                options={{
                                                                    chart: { id: 'weekly-bar' },
                                                                    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                                                                    colors: ['#008CFF'],
                                                                    plotOptions: {
                                                                        bar: {
                                                                            borderRadius: 10, // Set bar corner radius here
                                                                            horizontal: false, // Keep bars vertical
                                                                        },
                                                                    },
                                                                }}
                                                                series={[{ name: 'Checks', data: data?.chart?.weekly || [] }]}
                                                                type="bar"
                                                                height={250}
                                                            />
                                                        </div>

                                                        {/* Monthly */}
                                                        <div
                                                            className="tab-pane fade"
                                                            id="monthly"
                                                            role="tabpanel"
                                                            aria-labelledby="monthly-tab"
                                                        >
                                                            <Chart
                                                                options={{
                                                                    chart: { id: 'monthly-bar' },
                                                                    xaxis: {
                                                                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                                                    },
                                                                    colors: ['#E84D4D'],
                                                                    plotOptions: {
                                                                        bar: {
                                                                            borderRadius: 10, // Set bar corner radius here
                                                                            horizontal: false, // Keep bars vertical
                                                                        },
                                                                    },
                                                                }}
                                                                series={[{ name: 'Checks', data: data?.chart?.monthly || [] }]}
                                                                type="bar"
                                                                height={250}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mb-3">
                                            <div className="card shadow-sm border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="row pb-2">
                                                        <div className="col-4 mt-auto">
                                                            <h6 className="mb-0 text-445B64">Visual Data Split</h6>
                                                        </div>
                                                        <div className="col-12">
                                                            <img src={BorderBtm} alt="" className="w-100" />
                                                        </div>
                                                    </div>
                                                    {checkStatus.length > 0 && (
                                                        <Chart
                                                            key={renderKey}
                                                            options={options}
                                                            series={series}
                                                            type="pie"
                                                            width="100%"
                                                        />)}

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

export default Dashboard