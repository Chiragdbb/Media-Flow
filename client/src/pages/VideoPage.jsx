import { useLocation } from "react-router";

const VideoPage = () => {
    const path = useLocation().pathname;
    const videoId = path.split("/").at(-1);

    return <div className="videoPage">{videoId}</div>;
};

export default VideoPage;
