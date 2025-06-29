import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Якщо захочеш стилізувати окремо

const Footer = () => {
  return (
    <footer className="footer-section">
      <div
        id="top-footer"
        className="overlay-2 section-back-image-2"
        style={{ backgroundImage: "url('/assets/img/bg/footer-bg.jpg')" }}
      >
        <div className="auto-container">
          <div className="row">
            {/* Logo and About */}
            <div className="col-lg-3 col-md-6 mb-5">
              <div className="footer-widget-title">
                <div className="logo">
                  <Link to="/">
                    <img
                      className="img-fluid"
                      src="/assets/img/footer-logo.png"
                      alt="Logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="footer-widget-inner">
                <p>
                  Pellentesque Sed ut perspiciatisd omnis iste natus error sit
                  voluptatem accusantium doloremque laudantium, totam rem
                  aperiam.
                </p>
                <div className="footer-social mt-3">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="icofont-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="icofont-blogger"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="icofont-youtube"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="icofont-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="col-lg-3 col-md-6 mb-5">
              <div className="footer-widget-title">
                <h4>Корисні посилання</h4>
              </div>
              <div className="footer-widget-inner">
                <ul>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Наші класи
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Послуги
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Вчителі
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Галерея
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Часті питання
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icofont-circled-right"></i> Відгуки
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-5">
              <div className="footer-widget-title">
                <h4>Контакти</h4>
              </div>
              <div className="footer-widget-inner">
                <div className="footer-contact-widget">
                  <div className="footer-contact-sin">
                    <i className="icofont-pin"></i>
                    <p>Brooklyn, NY 11212</p>
                  </div>
                  <div className="footer-contact-sin">
                    <i className="icofont-smart-phone"></i>
                    <p>123-456-0975</p>
                  </div>
                  <div className="footer-contact-sin">
                    <i className="icofont-envelope"></i>
                    <p>info@yoursite.com</p>
                  </div>
                  <div className="footer-contact-sin">
                    <i className="icofont-clock-time"></i>
                    <p>Mon - Sun : 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Menu */}
            <div className="col-lg-3 col-md-6 mb-5">
              <div className="footer-widget-title">
                <h4>Навігація</h4>
              </div>
              <div className="footer-widget-inner">
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
                    <Link to="/privacy">Політика конфіденційності</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div id="bottom-footer" className="bg-gray">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <p className="copyright-text">
                Copyright © {new Date().getFullYear()}{" "}
                <Link to="#">Kidzton</Link> | All Rights Reserved
              </p>
            </div>
            <div className="col-lg-6 col-md-12">
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
