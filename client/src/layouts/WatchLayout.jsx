import { useLocation } from "react-router";
import Header from "../components/Header";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoList from "../pages/VideoList";
import VideoDetails from "../components/VideoDetails";
import Comments from "../components/Comments";
import menu from "../assets/menu.svg";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const WatchLayout = () => {
    const path = useLocation().pathname;
    const videoId = path.split("/").at(-1);

    const [sidebarExtended, setSidebarExtended] = useState(false);

    const overlayHandler = () => {
        setSidebarExtended(!sidebarExtended);

        // bug
        /* !sidebarExtended
            ? (document.body.style.overflow = "hidden")
            : (document.body.style.overflow = "auto");
        */
    };

    // todo: add compact sidebar
    return (
        <div className="bg-dark-bg text-white">
            {/* overlay */}
            {sidebarExtended && (
                <div
                    onClick={() => setSidebarExtended(false)}
                    className="fixed bg-black/50 inset-0 z-10 transition-all duration-200"
                ></div>
            )}

            <div
                className={`fixed left-0 top-0 bottom-0 bg-dark-bg z-10 w-[14rem] flex flex-col justify-center pt-6 transition-all duration-300 ${sidebarExtended ? "translate-x-0" : "-translate-x-[15rem]"} `}
            >
                <div className="w-fit ml-4">
                    <button
                        onClick={overlayHandler}
                        className=" w-10 rounded-full p-1.5 hover:bg-white/10"
                    >
                        <img src={menu} alt="menu" />
                    </button>
                </div>
                <Sidebar />
            </div>

            {/* header */}
            <div className="flex">
                <div className="w-10 h-[12vh] flex justify-center items-center ml-4 mr-1">
                    <button
                        onClick={overlayHandler}
                        className="w-full rounded-full p-1.5 hover:bg-white/10"
                    >
                        <img src={menu} alt="menu" />
                    </button>
                </div>
                <div className="flex-1">
                    <Header />
                </div>
            </div>
            {/* content */}
            <div className="min-h-[88vh] flex justify-center pl-4 pr-1">
                <div className="flex-[0.68] px-2 py-4 flex flex-col">
                    <VideoPlayer videoId={videoId} />
                    <div className="mt-4">
                        <VideoDetails videoId={videoId} />
                        <div className="mt-6">
                            <Comments videoId={videoId} />
                        </div>
                    </div>
                </div>
                <div className="flex-[0.3]">
                    <VideoList />
                </div>
            </div>
        </div>
    );
};

export default WatchLayout;
