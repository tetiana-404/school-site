import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Topbar.css';

const Topbar = () => {
    return (

        <div className="top-bar p-1 bg-dark text-white">
            <div className="container">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-between flex-nowrap">
                        <div className="contact-info d-flex mb-2 justify-content-center">
                            <p className="mb-0 d-flex align-items-center text-nowrap">
                                <a href="#" className="text-light text-decoration-none fs-6 fs-sm-5 fs-md-4">
                                    <i className="fas fa-map-marker-alt me-2 d-none d-lg-inline"></i>
                                    вул. Любінська, 93-А м. Львів
                                </a>
                            </p>
                        </div>
                        <div className="social-icons ms-auto d-flex gap-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-6">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light fs-6">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light fs-6">
                                <i className="bi bi-youtube"></i>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Topbar;
