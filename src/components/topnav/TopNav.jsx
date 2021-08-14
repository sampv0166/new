import React from "react";

import "./topnav.css";

import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import ThemeMenu from "../thememenu/ThemeMenu";

import notifications from "../../assets/JsonData/notification.json";

import user_image from "../../assets/images/tuat.png";

import user_menu from "../../assets/JsonData/user_menus.json";

import useUserInfo from "../../pages/useToken";

const curr_user = {
  display_name: "Tuat Tran",
  image: user_image,
};

//const userinfo = JSON.parse(localStorage.getItem("userInfo"));

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    {console.log(user)}
    <div className="topnav__right-user__image">
      {user.user.photo ? (
        <img src={user.user.photo} alt="" />
      ) : (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPZJwwkdrWayidQLVyvcP2l80jY0Ldmqx-w&usqp=CAU"
          alt=""
        />
      )}
    </div>
    <div className="topnav__right-user__name">{user.user.name}</div>
  </div>
);

const Topnav = ({ history }) => {
  const { user, setUser } = useUserInfo();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    // history.push('/');
  };

  const renderUserMenu = (item, index) => (
    <Link to="/" key={index}>
      {item.content === "Logout" ? (
        <div onClick={logoutHandler} className="notification-item">
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      ) : (
        <div className="notification-item">
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      )}
    </Link>
  );

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderFooter={() => <Link to="/">View All</Link>}
          />
          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;
