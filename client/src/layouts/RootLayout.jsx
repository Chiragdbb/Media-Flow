import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
    return (
        <div className="w-screen h-screen overflow-x-hidden  bg-dark-bg text-white">
            <Header />
            <div className="flex overflow-x-hidden">
                <div className="flex-[0.15] h-[88vh]">
                    <Sidebar />
                </div>
                <div className="flex-[0.85] h-[88vh] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RootLayout;
