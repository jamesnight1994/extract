import React from "react";
import { Outlet } from "react-router-dom";
import { baseConfig } from "../../config";
import Header from "../Header";
import "./Layout.css";
import Footer from "../Footer";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = () => {
  return (
    <div className="layout-container">
      {baseConfig.header ? <Header /> : <></>}
      {/* <SideBar /> */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <div className="page-container">
        <Outlet />
      </div>
      {baseConfig.footer ? <Footer /> : <></>}
    </div>
  );
};

export default Layout;
