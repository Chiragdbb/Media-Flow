import { useLocation } from "react-router";

const WatchVideo = () => {
    const path = useLocation().pathname;
    const videoId = path.split("/").at(-1);

    // use cloudinary videoplayer
    // get video data from url

    return <div className="watchVideo">video:{videoId}</div>;
}

export default WatchVideo