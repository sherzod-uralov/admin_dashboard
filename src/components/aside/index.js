import React from "react";
import {Link, useLocation} from "react-router-dom";
import { BsPersonFillCheck } from "react-icons/bs";
// Image
import logo from "../../assets/img/dash-logo.png";
// CSS
import "./aside.css";

const Sidebar = () => {
  const url = useLocation();
  return (
    <div className="aside">
      <nav className="aside-nav">
        <div className="aside-logo">
          <Link to="/">
            <img src={logo} alt="Logo" width="180px" />
          </Link>
        </div>
        <div className="aside-home">
          <Link
            className={`aside-home__link ${
                url.pathname === "/home" ? "active" : "inactive"
            }`}
            to="/"
          >
            <i className="ri-home-8-line"></i>Dashboard
          </Link>
          <span className="dashborad-bottom__line"></span>
        </div>
        <div className="aside-components__wrapper">
          <h3 className="aside-component__title">APPLICATIONS</h3>
          <ul className="aside-components">
            <li>
              <Link
                  className={`${
                      url.pathname === "/articles"
                          ? "active"
                          : "inactive"
                  }`}
                  to="/articles"
              >
                <i className="ri-archive-drawer-line"></i>Maqolalar
              </Link>
            </li>
            <li>
              <Link
                  className={`${
                      url.pathname === "/category"
                          ? "active"
                          : "inactive"
                  }`}
                  to="/category"
              >
                <i className="ri-archive-drawer-line"></i>Yonalishlar
              </Link>
            </li>
            <li>
              <Link
                  className={`${
                      url.pathname === "/sub-category"
                          ? "active"
                          : "inactive"
                  }`}
                  to="/sub-category"
              >
                <i className="ri-archive-drawer-line"></i>Soha Yo'nalishi
              </Link>
            </li>
            <li>
              <Link
                  className={`${
                      url.pathname === "/add-volume"
                          ? "active"
                          : "inactive"
                  }`}
                  to="/add-volume"
              >
                <i className="ri-code-s-slash-line"></i>Nashr Qo'shish
              </Link>
            </li>
            <li >
              <Link
                  className={`${
                      url.pathname === "/author"
                          ? "active"
                          : "inactive"
                  }`}
                  to="/author"
              >
                <div className="flex items-center">
                  <BsPersonFillCheck className="inline mr-2 text-2xl text-indigo-600" />
                  <p>Muallif</p>
                </div>

              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
