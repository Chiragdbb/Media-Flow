import { useLocation } from "react-router";
import Header from "../components/Header";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoList from "../pages/VideoList";
import VideoDetails from "../components/VideoDetails";
import Comments from "../components/Comments";

const WatchLayout = () => {
    const path = useLocation().pathname;
    const videoId = path.split("/").at(-1);

    // todo: add compact sidebar
    return (
        <div className="bg-dark-bg text-white">
            <Header />
            <div className="min-h-[88vh] flex justify-center pl-4 pr-1">
                <div className="flex-[0.68] px-2 py-4 flex flex-col">
                    <VideoPlayer videoId={videoId}/>
                    <div className="mt-4">
                        <VideoDetails videoId={videoId}/>
                        <Comments videoId={videoId}/>
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
