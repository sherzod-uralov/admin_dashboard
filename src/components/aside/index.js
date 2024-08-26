/** @format */

import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
// Icons
import { BsPersonFillCheck } from "react-icons/bs";
import { IoDocumentAttach } from "react-icons/io5";
import { PiArticleMediumFill } from "react-icons/pi";
import { HiDocumentSearch } from "react-icons/hi";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import { FaRegNewspaper } from "react-icons/fa6";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { TbSeo } from "react-icons/tb";
import logo from "../../assets/img/dash-logo.png";
import { FaChartBar } from "react-icons/fa";
import "./aside.css";

const Sidebar = () => {
  const url = useLocation();

  const links = [
    {
      path: "/articles",
      icon: <PiArticleMediumFill />,
      label: "Maqolalar",
    },
    {
      path: "/category",
      icon: <HiMiniDocumentCheck />,
      label: "Yo'nalishlar",
    },
    {
      path: "/sub-category",
      icon: <HiDocumentSearch />,
      label: "Yo‘nalish sohalari",
    },
    {
      path: "/add-volume",
      icon: <IoDocumentAttach />,
      label: "Nashr Qo'shish",
    },
    {
      path: "/author",
      icon: <BsPersonFillCheck />,
      label: "Mualliflar",
    },
    {
      path: "/news",
      icon: <FaRegNewspaper />,
      label: "Yangiliklar",
    },
    {
      path: "/chats",
      icon: <IoChatboxEllipsesSharp />,
      label: "Chatlar",
    },
    {
      path: "/statistics",
      icon: <FaChartBar />,
      label: "Statistika",
    },
  ];

  return (
    <div className="aside bg-gray-50">
      <nav className="aside-nav">
        <div className="aside-logo">
          <Link to="/articles">
            <img src={logo} alt="Logo" width="180px" />
          </Link>
        </div>
        <div className="aside-components__wrapper">
          <ul className="aside-components">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path}>
                  <div className="flex items-center">
                    {React.cloneElement(link.icon, {
                      className: `inline mr-2 text-2xl text-indigo-600 ${
                        url.pathname === link.path
                          ? "fill-white"
                          : "text-indigo-600"
                      }`,
                    })}
                    <p>{link.label}</p>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
