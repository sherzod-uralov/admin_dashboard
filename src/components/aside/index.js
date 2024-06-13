import React from "react";
import {Link, useLocation} from "react-router-dom";
//Icons
import { BsPersonFillCheck } from "react-icons/bs";
import { IoDocumentAttach } from "react-icons/io5";
import { PiArticleMediumFill } from "react-icons/pi";
import { HiDocumentSearch } from "react-icons/hi";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import { SiHomeadvisor } from "react-icons/si";
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
            <div className="flex items-center">
              <SiHomeadvisor className={`inline mr-2 text-2xl text-indigo-600 
                     ${url.pathname === "/home"
                  ? "fill-white"
                  : "text-indigo-600"}`}/>  <p>Bosh Sahifa</p>
            </div>

          </Link>
          <span className="dashborad-bottom__line"></span>
        </div>
        <div className="aside-components__wrapper">
          <h3 className="aside-component__title text-xl text-indigo-600 ">ILOVALAR</h3>
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
                <div className="flex items-center">
                  <PiArticleMediumFill className={`inline mr-2 text-2xl text-indigo-600 
                     ${ url.pathname === "/articles"
                      ? "fill-white"
                      : "text-indigo-600"}`} />  <p>Maqolalar</p>
                </div>

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
                <div className="flex items-center">
                  <HiMiniDocumentCheck className={`inline mr-2 text-2xl text-indigo-600 
                     ${url.pathname === "/category"
                      ? "fill-white"
                      : "text-indigo-600"}`}/>  <p> Yo'nalishlar</p>
                </div>

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

                <div className="flex items-center">
                  <HiDocumentSearch className={`inline mr-2 text-2xl text-indigo-600 
                     ${url.pathname === "/sub-category"
                      ? "fill-white"
                      : "text-indigo-600"}`}/>  <p>Soha Yo'nalishlari</p>
                </div>
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

              <div className="flex items-center">
                  <IoDocumentAttach className={`inline mr-2 text-2xl text-indigo-600 
                     ${ url.pathname === "/add-volume"
                          ? "fill-white"
                          : "text-indigo-600"}`}/>
                  <p>Nashr Qo'shish</p>
                </div>

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
                  <BsPersonFillCheck className={`inline mr-2 text-2xl text-indigo-600 
                     ${ url.pathname === "/author"
                      ? "fill-white"
                      : "text-indigo-600"}`} />
                  <p>Mualliflar</p>
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
