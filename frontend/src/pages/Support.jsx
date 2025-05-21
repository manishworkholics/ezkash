import React, { useState } from 'react'
import axios from 'axios';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            toast.error('Error during image upload:', error);
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
                    newErrors.subject = 'Please enter subject.';
                } else if (field === 'category') {
                    newErrors.category = 'Please select category.';
                } else if (field === 'description') {
                    newErrors.description = 'Please enter description.';
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
                toast.success('Ticket raised successfully!');
                setData({ subject: '', category: '', description: '', checkImg: '', vendorId: '' });
                setFormData({ imageUrl: '' });
                setErrors({});
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to raise ticket. Please try again.');
        }
    };



    return (
        <>
            <div className="container-fluid">
                <ToastContainer position='top-right' autoClose={3000} />
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
                                                                            <path d="M6 0.5C2.68941 0.5 0 2.786 0 5.6C0 8.414 2.68941 10.7 6 10.7H6.35294V12.5C9.78353 11.096 12 8.3 12 5.6C12 2.786 9.31059 0.5 6 0.5ZM6.70588 9.2H5.29412V8H6.70588V9.2ZM6.70588 7.1H5.29412C5.29412 5.15 7.41177 5.3 7.41177 4.1C7.41177 3.44 6.77647 2.9 6 2.9C5.22353 2.9 4.58824 3.44 4.58824 4.1H3.17647C3.17647 2.774 4.44 1.7 6 1.7C7.56 1.7 8.82353 2.774 8.82353 4.1C8.82353 5.6 6.70588 5.75 6.70588 7.1Z" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-445B64 fw-medium">Support</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-lg-6">
                                                            <div className="d-flex justify-content-end">
                                                                <button style={{ background: '#008CFF' }} className='btn border-0 rounded-2 text-white fw-medium py-1 px-2 fs-14 text-445B64 p-0' onClick={() => navigate('/my-ticket')}>
                                                                    My Tickets
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
                                                                    <label className="form-label text-445B64">Subject <span className='text-danger'>*</span></label>
                                                                    <input type="text" name='subject' value={data.subject} onChange={handleChange} className="form-control" />
                                                                    {errors.subject && <small className="text-danger">{errors.subject}</small>}


                                                                </div>
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label text-445B64">
                                                                        Category <span className="text-danger">*</span>
                                                                    </label>
                                                                    <select
                                                                        name="category"
                                                                        value={data.category}
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                    >
                                                                        <option value="">Select Category</option>
                                                                        <option value="Not Able to Upload Check">Not Able to Upload Check</option>
                                                                        <option value="Problem with Login or Changing Password">Problem with Login or Changing Password</option>
                                                                        <option value="Slow Internet Speed">Slow Internet Speed</option>
                                                                        <option value="Invalid Check Format">Invalid Check Format</option>
                                                                        <option value="Other">Other</option>

                                                                    </select>
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
                                                                    <label className="form-label text-445B64">Description <span className='text-danger'>*</span></label>
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