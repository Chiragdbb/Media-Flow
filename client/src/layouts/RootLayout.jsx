import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-dark-bg text-white">
            <Header />
            <div className="flex">
                <div className="flex-[0.17] h-[88vh] border-r">
                    <Sidebar />
                </div>
                <div className="flex-[0.7]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RootLayout;
