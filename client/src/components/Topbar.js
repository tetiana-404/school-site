import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Topbar.css';

const Topbar = () => {
    return (

        <div className="top-bar p-1 text-bg-dark">
            <div className="container">
                <div class="container-fluid">
                    <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start">
                        <div className="contact-info d-flex mb-2 justify-content-center ">
                            <p className="mb-0 d-flex align-items-center">
                                <a href="mailto:yevshan79@gmail.com" className="text-light text-decoration-none">
                                    <i className="far fa-envelope me-2 d-none d-lg-inline"></i>  yevshan79@gmail.com</a>
                                &nbsp;&nbsp;&nbsp;

                                <i className="bi bi-telephone me-2 d-none d-lg-flex"></i>
                                +380 32 262 20 36</p>
                        </div>

                        <div className="social-icons col-lg-auto mb-3 mb-lg-0 ms-auto d-flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
                                <i className="bi bi-facebook d-none d-sm-block"></i>


                            </a>

                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
                                <i className="bi bi-instagram d-none d-sm-block"></i>
                            </a>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
