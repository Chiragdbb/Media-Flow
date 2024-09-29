import { useEffect, useState } from "react";
import save from "../assets/save.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import plus from "../assets/plus.svg";
import close from "../assets/close.svg";
import toast from "react-hot-toast";

const Save = ({ videoId }) => {
    const userId = useSelector((state) => state.user.userData._id);

    const [playlists, setPlaylists] = useState([]);
    const [createPlaylist, setCreatePlaylist] = useState(false);
    const [modalHidden, setModalHidden] = useState(true);
    const [loading, setLoading] = useState(true);

    const [newPlaylist, setNewPlaylist] = useState({
        name: "",
        description: "",
    });

    const getPlaylists = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/playlist/user/${userId}`,
                {
                    withCredentials: true,
                }
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                setPlaylists(data);
                // playlistVideo.videos.videoId
            }
        } catch (e) {
            console.log(e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addVideoToPlaylist = async (playlistId) => {
        try {
            const loadToast = toast.loading("Adding Video to Playlist...");

            const res = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/playlist/add/${videoId}/${playlistId}`,
                null,
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                getPlaylists();
                toast.remove(loadToast);
                toast.success("Video added to Playlist!");
            }
        } catch (e) {
            toast.remove();
            toast.error(e.resonse.data.message);
            console.log(e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    const removeVideoFromPlaylist = async (playlistId) => {
        try {
            const loadToast = toast.loading("Removing Video from Playlist...");

            const res = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/playlist/remove/${videoId}/${playlistId}`,
                null,
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                getPlaylists();
                toast.remove(loadToast);
                toast.success("Video removed from playlist");
            }
        } catch (e) {
            toast.remove();
            toast.error(e.response.data.message);
            console.log(e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    const toggleVideoInPlaylist = async (e, playlistId) => {
        if (e.target.checked) {
            addVideoToPlaylist(playlistId);
        } else {
            removeVideoFromPlaylist(playlistId);
        }
    };

    const createNewPlaylist = async (e) => {
        try {
            e.preventDefault();
            const loadToast = toast.loading("Creating Playlist...");

            // setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/playlist`,
                newPlaylist,
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                toast.remove(loadToast);
                toast.success("Playlist Created!");
                setCreatePlaylist(false);
                getPlaylists();
            }
        } catch (e) {
            console.log("Error while creating new playlist", e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
            toast.remove();
            toast.error(e.response.data.message);
        } finally {
            setNewPlaylist({
                name: "",
                description: "",
            });
            setLoading(false);
        }
    };

    const clickHandler = (e) => {
        if (e.target.classList.contains("playlist-modal")) {
            setModalHidden(true);
        }
        return;
    };

    useEffect(() => {
        getPlaylists();
    }, [videoId]);

    return (
        <>
            <div
                onClick={() => {
                    setModalHidden(false);
                    setCreatePlaylist(false);
                }}
                className="flex gap-x-4"
            >
                <div className="w-fit flex justify-between items-center bg-white/10  py-2 gap-x-2 px-4 rounded-full hover:bg-white/20 cursor-pointer">
                    <img
                        className="w-5 mt-0.5 aspect-square"
                        src={save}
                        alt="liked"
                    />
                    <span>Save</span>
                </div>
            </div>
            {/* playlists modal */}
            <div
                onClick={clickHandler}
                className={`playlist-modal fixed inset-0 bg-black/50 flex justify-center items-center z-10 ${modalHidden ? "hidden" : ""}`}
            >
                <div className="w-[17rem] h-fit bg-[#333] rounded-lg pt-3 font-normal overflow-hidden">
                    {/* loading spinner */}
                    {loading ? (
                        <div className="flex justify-between items-center w-full h-24">
                            <span className="text-center w-full">
                                Loading...
                            </span>
                        </div>
                    ) : (
                        <div className="">
                            <div className="flex justify-between items-center pl-5 pr-3">
                                <span>Save video to...</span>
                                <span
                                    onClick={() => setModalHidden(true)}
                                    className="p-2 cursor-pointer rounded-full hover:bg-black/20"
                                >
                                    <img
                                        className="w-5"
                                        src={close}
                                        alt="close"
                                    />
                                </span>
                            </div>
                            <div className="px-5 my-3 flex flex-col gap-y-3">
                                {playlists.map((item) => (
                                    <div key={item._id}>
                                        <label className="flex items-center gap-x-3 cursor-pointer">
                                            <input
                                                className="w-4 h-4 bg-white rounded-sm checked:bg-purple-400 cursor-pointer"
                                                type="checkbox"
                                                onChange={(e) =>
                                                    toggleVideoInPlaylist(
                                                        e,
                                                        item._id
                                                    )
                                                }
                                                checked={item.videos.some(
                                                    (id) =>
                                                        id === videoId
                                                            ? true
                                                            : false
                                                )}
                                            />
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {createPlaylist ? (
                                <div className="w-full mt-6">
                                    <form
                                        className="flex flex-col gap-y-5 px-5 pb-3"
                                        onSubmit={createNewPlaylist}
                                    >
                                        <div className="min-h-fit flex flex-col gap-y-4">
                                            <div className="h-12">
                                                <span>Name</span>
                                                <input
                                                    type="text"
                                                    className="w-full focus:outline-none bg-transparent text-md peer"
                                                    placeholder="Enter playlist title..."
                                                    required
                                                    onChange={(e) =>
                                                        setNewPlaylist(
                                                            (prev) => ({
                                                                ...prev,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    value={newPlaylist.name}
                                                />
                                                <div className="h-[1px] w-full bg-white rounded-full peer-focus:h-[2px] peer-focus:bg-purple-400 transition-colors duration-150"></div>
                                            </div>
                                            <div className="h-12">
                                                <span>Description</span>
                                                <input
                                                    type="text"
                                                    className="w-full focus:outline-none bg-transparent text-md peer"
                                                    placeholder="Enter playlist description..."
                                                    required
                                                    onChange={(e) =>
                                                        setNewPlaylist(
                                                            (prev) => ({
                                                                ...prev,
                                                                description:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    value={
                                                        newPlaylist.description
                                                    }
                                                />
                                                <div className="h-[1px] w-full bg-white rounded-full peer-focus:h-[2px] peer-focus:bg-purple-400 transition-colors duration-150"></div>
                                            </div>
                                        </div>
                                        <button className="self-end -mr-3 px-3 py-1.5 text-purple-300 hover:bg-purple-500 hover:text-white rounded-full font-bold text-sm transition-colors duration-75">
                                            Create
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div
                                    className="min-w-full flex gap-x-2 pt-2 hover:bg-black/20 pl-5 pr-3 pb-4 cursor-pointer -ml-1"
                                    onClick={() => setCreatePlaylist(true)}
                                >
                                    <img className="w-5" src={plus} alt="add" />
                                    <span>Create new playlist</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Save;
