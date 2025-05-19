import React, { useState } from 'react'
import axios from 'axios';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const Support = () => {
    const navigate = useNavigate();
    const venderId = localStorage.getItem("userId");
    const [formData, setFormData] = useState({ imageUrl: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            alert("Please upload a check image.");
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
                const parsedData = {
                    imageUrl: result.data.imageUrl || '',
                };
                setFormData(parsedData);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }

    };

    const [errors, setErrors] = useState({});

    const requiredFields = ['subject', 'category', 'description'];

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach(field => {
            const value = data[field];
            if (!value || value.trim() === '') {
                if (field === 'subject') {
                    newErrors.subject = 'Please enter subject';
                } else if (field === 'category') {
                    newErrors.category = 'Please enter category';
                } else if (field === 'description') {
                    newErrors.description = 'Please enter description';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const [data, setData] = useState({ subject: '', category: '', description: '', checkImg: '', vendorId: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prevData) => ({ ...prevData, [name]: value }))
    }

    const addTicket = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post(
                `${URL}/complain/tickets`,
                {
                    subject: data.subject,
                    category: data.category,
                    description: data.description,
                    checkImg: formData?.imageUrl || '',
                    vendorId: venderId || ''
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                alert('Ticket raised successfully!');
                setData({ subject: '', category: '', description: '', checkImg: '', vendorId: '' });
                setFormData({ imageUrl: '' });
                setErrors({});
            }
        } catch (error) {
            console.error(error);
            alert('Failed to raise ticket. Please try again.');
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
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                                                            <path d="M6 7.25C6.625 7.25 7.15625 7.03125 7.59375 6.59375C8.03125 6.15625 8.25 5.625 8.25 5C8.25 4.375 8.03125 3.84375 7.59375 3.40625C7.15625 2.96875 6.625 2.75 6 2.75C5.375 2.75 4.84375 2.96875 4.40625 3.40625C3.96875 3.84375 3.75 4.375 3.75 5C3.75 5.625 3.96875 6.15625 4.40625 6.59375C4.84375 7.03125 5.375 7.25 6 7.25ZM1.5 12.5C1.0875 12.5 0.734375 12.3531 0.440625 12.0594C0.146875 11.7656 0 11.4125 0 11V2C0 1.5875 0.146875 1.23438 0.440625 0.940625C0.734375 0.646875 1.0875 0.5 1.5 0.5H10.5C10.9125 0.5 11.2656 0.646875 11.5594 0.940625C11.8531 1.23438 12 1.5875 12 2V11C12 11.4125 11.8531 11.7656 11.5594 12.0594C11.2656 12.3531 10.9125 12.5 10.5 12.5H1.5ZM1.5 11H10.5C9.975 10.2875 9.31562 9.73438 8.52187 9.34062C7.72812 8.94687 6.8875 8.75 6 8.75C5.1125 8.75 4.27187 8.94687 3.47812 9.34062C2.68437 9.73438 2.025 10.2875 1.5 11Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Support</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-end">
                                                                <button style={{ background: '#008CFF' }} className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0 mb-2' onClick={() => navigate('/my-ticket')}>
                                                                    My Ticket
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card rounded-4 overflow-hidden border-0 shadow-sm">
                                                <div className="card-header bg-white d-flex align-items-center">
                                                    <h6 className='ms-2 mb-0 text-445B64 fs-14'>New Ticket</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row g-3 new-check-form">
                                                        <div className="col-lg-6">
                                                            <div className="row">
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label text-445B64">Subject</label>
                                                                    <input type="text" name='subject' value={data.subject} onChange={handleChange} className="form-control" />
                                                                    {errors.subject && <small className="text-danger">{errors.subject}</small>}


                                                                </div>
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label text-445B64">Category</label>
                                                                    <input type="text" name='category' value={data.category} onChange={handleChange} className="form-control" />
                                                                    {errors.category && <small className="text-danger">{errors.category}</small>}

                                                                </div>
                                                                <div className="col-12 d-flex gap-3">

                                                                    <div className="form-control inputFile p-4 text-center position-relative d-flex justify-content-center align-items-center">
                                                                        <input
                                                                            className="position-absolute top-0 start-0 w-100 h-100"
                                                                            type="file"
                                                                            id="formFile"
                                                                            onChange={handleSubmit}
                                                                            accept="image/*"
                                                                            style={{ opacity: 0, cursor: 'pointer' }}
                                                                        />
                                                                        <div>
                                                                            <i className="fa-solid fa-camera fs-4 text-01A99A"></i>
                                                                            <div className="text-445B64">Upload / Capture Image</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {formData?.imageUrl &&
                                                                    <div className='col-lg-6'>
                                                                        <label className="form-label text-445B64 mb-1 mt-3">Image</label>
                                                                        <img src={formData.imageUrl} alt="Profile" loading="lazy" className='w-100 border rounded-4 overflow-hidden' />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="row h-100">
                                                                <div className="col-12 mb-3 pb-3">
                                                                    <label className="form-label text-445B64">Description</label>
                                                                    <textarea className="form-control h-100" name='description' value={data.description} onChange={handleChange} defaultValue="Description" />
                                                                    {errors.description && <small className="text-danger">{errors.description}</small>}

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 me-auto mt-0 text-center">
                                                            <button className="btn theme-btn px-5 py-2 rounded-3 mt-3 w-100" onClick={addTicket}>Save</button>
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

export default Support