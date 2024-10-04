import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import liked from "../assets/liked.svg";
import like from "../assets/like.svg";
import useAxios from "../axios/axios";

const Like = ({ id, type, addClasses }) => {
    const userId = useSelector((state) => state.user.userData._id);

    const api = useAxios();

    const [likedByUser, setLikedByUser] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [togglingLike, setTogglingLike] = useState(false);

    const getVideoLikes = async (videoId) => {
        try {
            const res = await api.get(
                `/likes/${type}/${videoId}`
            );

            const data = res.data.data;

            const isLiked = data.some((item) => {
                if (item.likedBy === userId) return true;
            });

            if (res.status === 200 && data) {
                setLikeCount(data.length);
                setLikedByUser(isLiked);
            }
        } catch (e) {
            console.log("Error while getting video likes", e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleVideoLike = async () => {
        try {
            setTogglingLike(true);

            const res = await api.post(
                `/likes/toggle/${type}/${id}`,
                null,
                
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                data._id ? setLikedByUser(true) : setLikedByUser(false);
            } else {
                setLikedByUser(false);
            }
        } catch (e) {
            console.log("Error while toggling video like", e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
            setLikedByUser(false);
        } finally {
            setTogglingLike(false);
        }
    };

    useEffect(() => {
        getVideoLikes(id);
    }, [id, likedByUser]);

    return (
        <>
            {loading ? (
                <span className="w-fit bg-white/10 rounded-full py-2 px-4 text-xs flex items-center">
                    Loading...
                </span>
            ) : (
                <div
                    onClick={toggleVideoLike}
                    className={`${togglingLike ? "pointer-events-none brightness-75" : "pointer-events-auto"} w-fit flex justify-between items-end rounded-full gap-x-1.5 cursor-pointer ${addClasses}`}
                >
                    <img
                        className="w-5 mt-0.5 aspect-square"
                        src={likedByUser ? liked : like}
                        alt="like"
                    />
                    <span>{likeCount}</span>
                </div>
            )}
        </>
    );
};

export default Like;
