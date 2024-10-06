import { useSelector } from "react-redux";
import PlaylistCard from "../components/PlaylistCard";
import { useEffect, useState } from "react";
import useAxios from "../services/axios";
import Loader from "../components/Loader/Loader";

const Collections = () => {
    document.title = "Collections - Nexus Point";

    const userId = useSelector((state) => state.user.userData._id);

    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState([]);

    const api = useAxios();

    const getUserPlaylists = async () => {
        try {
            const res = await api(`/playlist/user/${userId}`);

            const data = res.data.data;

            if (res.status === 200 && data) {
                setPlaylists(data);
            }
        } catch (e) {
            console.log("Error while fetching user playlists: ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserPlaylists();
    }, []);

    return (
        <div className="h-full w-full px-6 pt-1 pb-2">
            <h2 className="text-4xl font-bold">Collections</h2>
            {loading ? (
                <div className="h-4/5">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-x-6 gap-y-5 mt-6">
                    {playlists.map((item) => (
                        <div key={item._id} className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-150">
                            <PlaylistCard
                                playlistId={item._id}
                                totalVideos={item.videos.length}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Collections;
