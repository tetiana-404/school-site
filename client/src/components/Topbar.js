import React from "react";
import { useNavigate } from "react-router-dom";
import './Topbar.css';
import { FiLogOut } from "react-icons/fi";

const Topbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };
    return (

        <div className="top-bar p-1  text-white">
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

                            {user && (
                                <button
          onClick={handleLogout}
          className="btn btn-warning p-2 d-flex align-items-center justify-content-center"
          style={{ border: "none", borderRadius: "50%" }}
        >
          <FiLogOut size={10} />
        </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Topbar;
