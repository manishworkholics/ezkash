import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import { useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link } from 'react-router-dom';
import RecentCheck from '../components/RecentCheck';
const URL = process.env.REACT_APP_URL;
const token = localStorage.getItem('token')

const Home = () => {
  const licenseFrontRef = useRef(null);
  const licenseBackRef = useRef(null);
  const checkFrontRef = useRef(null);
  const checkBackRef = useRef(null);
  const venderId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [formData, setFormData] = useState({ customerFirstName: '', customerMiddleName: '', customerLastName: '', licenseNo: '', date: '', company: '', checkType: 'Personal', amount: '', imageUrl: '', extractedText: '', });

  const [formDataback, setFormDataback] = useState({ imageUrl: '' });

  const [licenseData, setLicenseData] = useState({ imageUrl: '', name: '', licenseNo: '', class: '', dob: '', sex: '', eyes: '', height: '', address: '', issuedDate: '', expiryDate: '', });

  const [licenseDataback, setLicenseDataback] = useState({ imageUrl: '' });

  const handleCancelLicenseFront = () => { setLicenseData({ ...licenseData, imageUrl: '', licenseNo: '' }); if (licenseFrontRef.current) { licenseFrontRef.current.value = ''; } };

  const handleCancelLicenseBack = () => { setLicenseDataback({ ...licenseDataback, imageUrl: '' }); if (licenseBackRef.current) { licenseBackRef.current.value = ''; } };

  const handleCancelCheckFront = () => { setFormData({ ...formData, imageUrl: '', customerFirstName: '', customerMiddleName: '', customerLastName: '', amount: '', company: '' }); if (checkFrontRef.current) { checkFrontRef.current.value = ''; } };

  const handleCancelCheckBack = () => { setFormDataback({ ...formDataback, imageUrl: '' }); if (checkBackRef.current) { checkBackRef.current.value = ''; } };

  const [errors, setErrors] = useState({});


  const requiredFields = ['customerFirstName', 'amount'];

  const validateForm = () => {
    const newErrors = {};

    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || value.trim() === '') {
        if (field === 'customerFirstName') {
          newErrors.customerFirstName = 'Please fill this field';
        } else if (field === 'amount') {
          newErrors.amount = 'Please enter amount';
        } else {
          newErrors[field] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


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
      setLoading(true)
      const response = await axios.post(`${URL}/scan-check`, formData)
      toast.success('Check front image upload successfully!');
      const result = response.data;
      if (result && result.customerName) {
        const parsedData = {
          customerFirstName: result.customerFirstName || '',
          customerMiddleName: result.customerMiddleName || '',
          customerLastName: result.customerLastName || '',
          date: result.date || '',
          company: result.company || '',
          checkType: result.checkType || '',
          amount: result.amountNumeric || '',
          amountWords: result.amountWords || '',
          payee: result.payee || '',
          memo: result.memo || '',
          imageUrl: result.imageUrl || '',
          extractedText: result.extractedText || ''
        };
        setFormData(parsedData);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("Error in image uploading", error);
      }, 1000);
      console.error('Error during image upload:', error);
    } finally {
      setLoading(false)
    }
  };

  const handleSubmitback = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      alert("Please upload a check image.");
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setLoading1(true)
      const response = await axios.post(`${URL}/upload-image`, formData)
      toast.success('Check Back image upload successfully!');

      const result = response.data;
      if (result) {
        const parsedData = {
          imageUrl: result.data.imageUrl || '',
        };
        setFormDataback(parsedData);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("Error in image uploading", error);
      }, 1000);
      console.error('Error during image upload:', error);
    } finally {
      setLoading1(false)
    }
  };

  const handleSubmitLicense = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      alert("Please upload a ID image.");
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setLoading2(true)
      const response = await axios.post(`${URL}/scan-license`, formData)
      toast.success('ID Front image upload successfully!');

      const result = response.data;
      if (result) {
        const parsedData = {
          imageUrl: result?.imageUrl || '',
          name: result?.name || '',
          licenseNo: result?.licenseNo || '',
          dob: result?.dob || '',
          sex: result?.sex || '',
          eyes: result?.eyes || '',
          height: result?.height || '',
          address: result?.address || '',
          issuedDate: result?.issuedDate || '',
          expiryDate: result?.expiryDate || '',
        };
        setLicenseData(parsedData);
      }
    } catch (error) {
      toast.error("Error in image uploading", error);
      console.error('Error during image upload:', error);
    } finally {
      setLoading2(false)
    }
  };

  const handleSubmitLicenseback = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      alert("Please upload a ID image.");
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setLoading3(true)
      const response = await axios.post(`${URL}/upload-image`, formData)
      toast.success('ID Back image upload successfully!');

      const result = response.data;
      if (result) {
        const parsedData = {
          imageUrl: result?.data?.imageUrl || '',
        };
        setLicenseDataback(parsedData);
      }
    } catch (error) {
      toast.error("Error in image uploading", error);
      console.error('Error during image upload:', error);
    } finally {
      setLoading3(false)
    }
  };




  const handleSave = async (e) => {
    e.preventDefault();


    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.imageUrl == '') {
      toast.error('Please upload Check image');
      return;
    }

    try {
      const response = await axios.post(`${URL}/check/add-check`, {
        imageUrl: formData.imageUrl || '',
        imageUrl2: formDataback.imageUrl || '',
        imageUrl3: licenseData.imageUrl || '',
        imageUrl4: licenseDataback.imageUrl || '',
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        customerMiddleName: formData.customerMiddleName,
        licenseNo: licenseData.licenseNo,
        date: new Date(Date.now()).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
        company: formData.company,
        checkType: formData.checkType || 'Personal',
        amount: formData.amount,
        status: formData.status,
        extractedText: formData.extractedText,
        comment: formData.comment,
        venderId: venderId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Check added successfully!');

      // Reset all form states after success
      setFormData({
        imageUrl: '',
        customerFirstName: '',
        customerLastName: '',
        customerMiddleName: '',
        company: '',
        checkType: 'Personal',
        amount: '',
        status: '',
        extractedText: '',
        comment: ''
      });

      setLicenseData({
        imageUrl: '',
        licenseNo: ''
      });

      setFormDataback({ imageUrl: '' });
      setLicenseDataback({ imageUrl: '' });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form');
    }
  };




  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="container-fluid ">
        <Header />
        <div className="d-none d-lg-block">
          <div className="row mh-100vh">
            <div className="col-lg-3 col-xl-2 d-none d-lg-block position-relative">
              <Sidebar />
            </div>
            <div className="col-lg-9 col-xl-10 bg-F6F6F6">
              <div className="main-content">
                <div className="container-fluid p-3 px-2">


                  {/* New Check Form */}
                  <div className="card rounded-4 overflow-hidden border-0 shadow-sm">
                    <div className="card-header bg-white d-flex align-items-center py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                        <path d="M9.16667 12.1667H3.33333V10.5H9.16667M11.6667 8.83333H3.33333V7.16667H11.6667M11.6667 5.5H3.33333V3.83333H11.6667M13.3333 0.5H1.66667C0.741667 0.5 0 1.24167 0 2.16667V13.8333C0 14.2754 0.175595 14.6993 0.488155 15.0118C0.800716 15.3244 1.22464 15.5 1.66667 15.5H13.3333C13.7754 15.5 14.1993 15.3244 14.5118 15.0118C14.8244 14.6993 15 14.2754 15 13.8333V2.16667C15 1.72464 14.8244 1.30072 14.5118 0.988155C14.1993 0.675595 13.7754 0.5 13.3333 0.5Z" fill="#000000" />
                      </svg>
                      <h6 className='ms-2 mb-0 text-445B64'>New Checks</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 new-check-form">
                        <div className="col-md-6">
                          <label className="form-label text-445B64">Check Image</label>
                          <div className="d-flex gap-2 gap-lg-3">
                            <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                              <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkFrontRef} onChange={handleSubmit} style={{ opacity: 0, cursor: 'pointer' }} />
                              <div className="">
                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                <div className="text-445B64">Upload/Capture Front </div>
                              </div>
                            </div>

                            <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                              <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={checkBackRef} onChange={handleSubmitback} style={{ opacity: 0, cursor: 'pointer' }} />
                              <div className="">
                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                <div className="text-445B64">Upload/Capture Back </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            {loading ? (
                              <div className="col-6 text-center py-5 px-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>

                            ) : (
                              <>
                                {formData?.imageUrl && (
                                  <div className='col-lg-6'>
                                    <label className="form-label text-445B64 mb-1 mt-3">Front Image</label>
                                    <div className='position-relative mt-3'>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                        onClick={handleCancelCheckFront}
                                        style={{ zIndex: 1 }}
                                      >
                                        &times;
                                      </button>
                                      <img src={formData.imageUrl} alt="Profile" className='w-100 border rounded-4 overflow-hidden' />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            {loading1 ? (
                              <div className="col-6 text-center py-5 px-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>

                            ) : (
                              <>
                                {formDataback?.imageUrl && (
                                  <div className='col-lg-6'>
                                    <label className="form-label text-445B64 mb-1 mt-3">Back Image</label>
                                    <div className='position-relative mt-3'>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                        onClick={handleCancelCheckBack}
                                        style={{ zIndex: 1 }}
                                      >
                                        &times;
                                      </button>
                                      <img src={formDataback.imageUrl} alt="Profile" className='w-100 border rounded-4 overflow-hidden' />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>


                        <div className="col-md-6">
                          <label className="form-label text-445B64">ID Image</label>
                          <div className="d-flex gap-2 gap-lg-3">
                            <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                              <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseFrontRef} onChange={handleSubmitLicense} style={{ opacity: 0, cursor: 'pointer' }} />
                              <div className="">
                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                <div className="text-445B64">Upload/Capture Front </div>
                              </div>
                            </div>
                            <div className="form-control inputFile p-3 p-lg-4 text-center position-relative d-flex justify-content-center align-items-center">
                              <input className="position-absolute top-0 start-0 w-100 h-100" type="file" id="formFile" ref={licenseBackRef} onChange={handleSubmitLicenseback} style={{ opacity: 0, cursor: 'pointer' }} />
                              <div className="">
                                <i className="fa-solid fa-arrow-up-from-bracket fs-4 text-01A99A"></i>
                                <div className="text-445B64">Upload/Capture Back  </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {loading2 ? (
                              <div className="col-6 text-center py-5 px-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>

                            ) : (
                              <>
                                {licenseData?.imageUrl && (
                                  <div className='col-lg-6 '>
                                    <label className="form-label text-445B64 mb-1 mt-3">Front Image</label>
                                    <div className='position-relative mt-3'>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                        onClick={handleCancelLicenseFront}
                                        style={{ zIndex: 1 }}
                                      >
                                        &times;
                                      </button>
                                      <img
                                        src={licenseData.imageUrl}
                                        alt="Front License"
                                        className='w-100 border rounded-4 overflow-hidden'
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            {loading3 ? (
                              <div className="col-6 text-center py-5 px-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>

                            ) : (
                              <>
                                {licenseDataback?.imageUrl && (
                                  <div className='col-lg-6'>
                                    <label className="form-label text-445B64 mb-1 mt-3">Back Image</label>
                                    <div className='position-relative mt-3'>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                        onClick={handleCancelLicenseBack}
                                        style={{ zIndex: 1 }}
                                      >
                                        &times;
                                      </button>
                                      <img
                                        src={licenseDataback.imageUrl}
                                        alt="Back License"
                                        className='w-100 border rounded-4 overflow-hidden'
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            <div className="col-lg-6"></div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-md-9">
                              <div className="row">
                                <label className="form-label text-445B64">Customer Name <span className='text-danger'>*</span></label>
                                <div className="col-md-4 mb-3">
                                  <input
                                    type="text"
                                    placeholder='First name'
                                    className={`form-control ${errors.customerFirstName ? 'border border-danger' : formData.customerFirstName ? 'border border-success' : ''}`}
                                    value={formData.customerFirstName || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setFormData({ ...formData, customerFirstName: value });
                                      if (value.trim() !== '') {
                                        setErrors((prev) => ({ ...prev, customerFirstName: null }));
                                      }
                                    }}
                                  />
                                  {errors.customerFirstName && (
                                    <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                      "Please fill the customer first name"
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4 mb-3">
                                  <input type="text" className="form-control" placeholder='Middle Name' value={formData.customerMiddleName} onChange={(e) => setFormData({ ...formData, customerMiddleName: e.target.value })} />
                                </div>
                                <div className="col-md-4 mb-3">
                                  <input type="text" className="form-control" placeholder='Last Name' value={formData.customerLastName} onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })} />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label text-445B64">ID Number </label>
                              <input type="text" className="form-control" value={licenseData.licenseNo || formData.licenseNo} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label text-445B64"> Check Type </label>
                              <select className="form-control" value={formData.checkType} onChange={(e) => { const value = e.target.value; setFormData({ ...formData, checkType: value }) }} >
                                {/* <option value="">Select Check Type</option> */}
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                              </select>
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label text-445B64">Amount <span className='text-danger'>*</span></label>
                              <input
                                type="text"
                                className={`form-control ${errors.amount ? 'border border-danger' : formData.amount ? 'border border-success' : ''}`}
                                value={formData.amount || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setFormData({ ...formData, amount: value });
                                  if (value.trim() !== '') {
                                    setErrors((prev) => ({ ...prev, amount: null }));
                                  }
                                }}
                              />
                              {errors.amount && (
                                <div className="text-danger mt-1" style={{ fontSize: '0.6rem' }}>
                                  "Please fill the amount"
                                </div>
                              )}
                            </div>
                            <div className="col-md-3 mb-3 ">
                              <label className="form-label text-445B64">Company</label>
                              <input className="form-control" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div className="col-md-3 mb-3 ">
                              <label className="form-label text-445B64">Comments</label>
                              <input className="form-control" value={formData.comment || ''} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
                            </div>
                          </div>
                          <div className="col-lg-4 me-auto mt-0 text-center">
                            <button className="btn theme-btn px-5 py-2 rounded-3 mt-3 w-100" onClick={handleSave}>Save</button>
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

      {/* image-preview-Modal */}
      < div className="modal modal-xl fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title text-445B64" id="exampleModalLabel">Preview Details</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className='col-lg-6'>

                  {formData?.imageUrl && <img src={formData.imageUrl} alt="Profile" className='w-100' />}
                </div>
                <div className='col-lg-6 d-flex align-items-center'>
                  <div
                    className="form-control border-0 bg-F0F5F6"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: formData?.extractedText }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-light bg-F0F5F6 border rounded-3 px-5" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>







      {/* Mobile-View Start */}
      <div className="container-fluid mobile-bg d-block d-lg-none" style={{ minHeight: '100vh' }}>
        {/* <Header /> */}
        <div className="row mb-2 pt-5 mt-4 mt-md-5">
          <div className="col-12 mb-3">
            <Link to='/upload-check' className="btn mob-addCheck-btn rounded-3 border w-100 text-start d-flex align-items-center">
              <i class="fa fa-plus text-white"></i>
              <span className="text-white fw-semibold ms-2 my-1">Add New Check</span>
            </Link>
          </div>

        </div>
        <div className="mb-4">
          <RecentCheck />
        </div>
      </div>

      {/* Mobile-View End */}







    </>
  )
}

export default Home


