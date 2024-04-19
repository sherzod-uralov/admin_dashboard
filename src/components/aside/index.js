import React from "react";
import { Link } from "react-router-dom";

// Image
import logo from "../../assets/img/dash-logo.png";
// CSS
import "./aside.css";

const Sidebar = () => {
  const url = window.location.href;
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
              url === "http://localhost:3000/home" ? "active" : "inactive"
            }`}
            to="/"
          >
            <i class="ri-home-8-line"></i>Dashboard
          </Link>
          <span className="dashborad-bottom__line"></span>
        </div>
        <div className="aside-components__wrapper">
          <h3 className="aside-component__title">APPLICATIONS</h3>
          <ul className="aside-components">
            <li>
              <Link
                className={`${
                  url === "http://localhost:3000/articles"
                    ? "active"
                    : "inactive"
                }`}
                to="/articles"
              >
                <i class="ri-archive-drawer-line"></i>Articles
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  url === "http://localhost:3000/category"
                    ? "active"
                    : "inactive"
                }`}
                to="/category"
              >
                <i class="ri-archive-drawer-line"></i>Category
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  url === "http://localhost:3000/sub-category"
                    ? "active"
                    : "inactive"
                }`}
                to="/sub-category"
              >
                <i class="ri-archive-drawer-line"></i>Sub Category
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  url === "http://localhost:3000/add-volume"
                    ? "active"
                    : "inactive"
                }`}
                to="/add-volume"
              >
                <i class="ri-code-s-slash-line"></i>Volume Add
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
