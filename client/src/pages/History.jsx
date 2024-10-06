import VideoCard from "../components/VideoCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader";
import useAxios from "../services/axios";

//todo: update history in redux
const History = () => {
    document.title = "Watch History - Nexus Point";
    const api = useAxios()
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const getWatchHistoryData = async () => {
        try {
            const res = await api.get("/users/history");

            const data = res.data.data;

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
        <div className="h-full">
            {loading ? (
                <div className="h-full pb-10">
                    <Loader />
                </div>
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
