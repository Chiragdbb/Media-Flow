import axios from "axios";
import VideoCard from "./VideoCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//todo: update history in redux
const History = () => {
    document.title = "Watch History - Nexus Point";

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const getWatchHistoryData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/users/history`,
                {
                    withCredentials: true,
                }
            );

            const data = res.data.data;
            // console.log(data);

            if (res.status === 200 && data) {
                setHistory(data);
            }
        } catch (e) {
            console.log(e);
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while logging in user!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWatchHistoryData();
    }, []);

    return (
        <div className="">
            {loading ? (
                "Loading..."
            ) : (
                <div className="w-full grid grid-cols-3 place-items-center gap-y-4">
                    {history.map((item) => (
                        <VideoCard key={item._id} video={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
