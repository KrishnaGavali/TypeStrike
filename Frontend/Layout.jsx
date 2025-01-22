import Navbar from "./src/Components/Navbar/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <div className="" id="layout-main-div">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
