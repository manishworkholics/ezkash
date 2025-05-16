// ExportModal.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExportModal({ show, onClose }) {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState("Custom");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleApply = () => {
        new URLSearchParams({
            filter: filterType,
            ...(filterType === "Custom" && {
                startDate,
                endDate,
            }),
        }).toString();

        onClose();
        navigate(`/export-report`);
    };

    return (
        <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" style={{ background: "#445B6466" }}>
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content border-0 shadow rounded-4">
                    <div className="modal-header">
                        <h6 className="modal-title d-flex align-items-center fw-normal">
                            <div className="table-circular-icon bg-F0F5F6 me-2"
                                style={{ cursor: "pointer" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                    <path d="M7.875 5.4H12.6875L7.875 1.55V5.4ZM1.75 0.5H8.75L14 4.7V13.1C14 13.4713 13.8156 13.8274 13.4874 14.0899C13.1592 14.3525 12.7141 14.5 12.25 14.5H1.75C1.28587 14.5 0.840752 14.3525 0.512563 14.0899C0.184374 13.8274 0 13.4713 0 13.1V1.9C0 1.123 0.77875 0.5 1.75 0.5ZM2.625 13.1H4.375V8.9H2.625V13.1ZM6.125 13.1H7.875V7.5H6.125V13.1ZM9.625 13.1H11.375V10.3H9.625V13.1Z" fill="#000000" />
                                </svg>
                            </div>
                            Export Report</h6>
                        {/* <button type="button" className="btn-close border-0 shadow-none" onClick={onClose}></button> */}
                    </div>
                    <div className="modal-body d-flex">
                        <div className="list-group w-25">
                            {["Daily", "Weekly", "Monthly", "Custom"].map((type) => (
                                <button
                                    key={type}
                                    className={`list-group-item p-2 list-group-item-action ${filterType === type ? "active" : ""
                                        }`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="ms-4 w-100">
                            {filterType === "Custom" && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <label className="fs-14 fw-medium mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control fs-14 text-dark fw-medium bg-F4F4F4 border-0 rounded-3"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="fs-14 fw-medium mb-2">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control fs-14 text-dark fw-medium bg-F4F4F4 border-0 rounded-3"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="border-0 bg-white me-4" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="border-0 bg-white text-primary" onClick={handleApply}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExportModal;
