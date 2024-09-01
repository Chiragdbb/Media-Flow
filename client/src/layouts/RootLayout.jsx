import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
    return (
        <div className="rootLayout">
            <Header />
            <div>
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
};

export default RootLayout;
