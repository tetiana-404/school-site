import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Footer.css"; 



const Footer = () => {
  return (
    <footer className="footer-section">
      <div
        id="top-footer"
        className="section-back-image-2"
        
      >
        <div className="auto-container">
          <div className="row">
            {/* Logo and About */}
            <div className="col-lg-4 col-md-12 mb-5">
              <div className="footer-widget-title">
                <div className="logo">
                  <Link to="/">
                    <img
                      className="img-fluid"
                      src="/img/logo.png"
                      alt="Logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="footer-widget-inner">
                <p>
                  Євшан, чарівне зілля <br />
                  Росте в степу, не знати, де.<br />
                  Та хто його добуде,<br />
                  Далекий Рідний Край знайде<br />
                  І виб'ється у люди.<br /><br />
                  <i>Леся Храплива</i>
                </p>
                
              </div>
            </div>

            {/* Useful Links */}
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="footer-widget-title">
                <h4>Корисні посилання</h4>
              </div>
              <div className="footer-widget-inner">
                <ul style={{paddingLeft: 0}}>
                  <li>
                    <Link to="https://mon.gov.ua/" target="blank">
                      <i class="bi bi-arrow-right-circle-fill"></i> Міністерства освіти і науки України
                    </Link>
                  </li>
                  <li>
                    <Link to="https://osvita.loda.gov.ua/" target="blank">
                      <i class="bi bi-arrow-right-circle-fill"></i> Освіта Львівщини
                    </Link>
                  </li>
                  <li>
                    <Link to="https://prometheus.org.ua/" target="blank">
                      <i class="bi bi-arrow-right-circle-fill"></i> Prometheus
                    </Link>
                  </li>
                  
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="footer-widget-title">
                <h4>Контакти</h4>
              </div>
              <div className="footer-widget-inner">
                <div className="footer-contact-widget">
                  <div className="footer-contact-sin">
                    <i class="bi bi-geo-alt-fill"></i>&nbsp;&nbsp;
                      м.Львів, вул.Любінська, 93а
                  </div>
                  <div className="footer-contact-sin">
                    <i class="bi bi-telephone-fill"></i>&nbsp;&nbsp;
                    <a href="tel:+380322622036"> +38 (032) 262-20-36</a>
                  </div>
                  <div className="footer-contact-sin">
                    <i class="bi bi-envelope-fill"></i>&nbsp;&nbsp;
                    yevshan79@gmail.com
                  </div>
                  
                </div>
                <div className="footer-social mt-3">
                  <ul>
                    <li>
                      <a href="#">
                       <i className="bi bi-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="bi bi-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="bi bi-youtube"></i>
                      </a>
                    </li>
                    
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Menu */}
           
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div id="bottom-footer" className="bg-gray">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <p className="copyright-text">
                Copyright © {new Date().getFullYear()}{" "}
                <Link to="#">Євшан</Link> | All Rights Reserved
              </p>
            </div>
            <div className="col-lg-6 col-md-6 d-none d-md-block d-lg-block">
              <div className="footer-menu">
                <ul>
                  <li>
                    <Link to="/">Головна</Link>
                  </li>
                  <li>
                    <Link to="/about">Про нас</Link>
                  </li>
                  <li>
                    <Link to="/contact">Контакти</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Політика</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
