import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Like from "./Like";
import trash from "../assets/trash.svg";

// todo: pagination => change params to get next comments
const Comments = ({ videoId }) => {
    const user = useSelector((state) => state.user.userData);

    const [videoComments, setVideoComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentInputExpanded, setCommentInputExpanded] = useState(false);
    const [userComment, setUserComment] = useState("");

    let page = 1;
    let limit = 10;

    let params = {
        page,
        limit,
    };

    const getVideoComments = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/comments/${videoId}`,
                {
                    params,
                    withCredentials: true,
                }
            );

            const data = res.data.data.docs;

            if (res.status === 200 && data) {
                setVideoComments(data);
            }
        } catch (e) {
            console.log(e);
            console.log("error msg: ", e.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (comment) => {
        try {
            const loadToast = toast.loading("Adding comment...");

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/comments/${videoId}`,
                {
                    content: comment,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                toast.remove(loadToast);
                toast.success("Comment Added");
                getVideoComments();
            }
        } catch (e) {
            console.log(e);
            toast.remove();
            toast.error(
                "Error while adding comment: ",
                e.response.data.message
            );
        }
    };

    const submitHandler = () => {
        const comment = userComment.trim();

        addComment(comment);

        setUserComment("");
        setCommentInputExpanded(false);
    };

    const deleteHandler = async (commentId) => {
        try {
            const loadToast = toast.loading("Deleting comment...");

            const res = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/comments/c/${commentId}`,
                {
                    withCredentials: true,
                }
            );

            if (res.status === 200) {
                toast.remove(loadToast);
                toast.success("Comment Deleted");
                getVideoComments();
            }
        } catch (e) {
            console.log(e);
            toast.remove();
            toast.error(
                "Error while deleting comment: ",
                e.response.data.message
            );
        }
    };

    function timeSince(date) {
        const now = new Date();
        const pastDate = new Date(date);
        const seconds = Math.floor((now - pastDate) / 1000);

        const ranges = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (let [key, value] of Object.entries(ranges)) {
            const range = Math.floor(seconds / value);
            if (range >= 1) {
                return `${range} ${key}${range !== 1 ? "s" : ""} ago`;
            }
        }

        return "Just now";
    }

    useEffect(() => {
        getVideoComments();
    }, [videoId]);

    return (
        <div className="">
            {loading ? (
                <div>
                    <span>Loading...</span>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold ">
                        {videoComments.length} Comments
                    </h2>
                    {/* comment input */}
                    <div className="flex flex-col mt-6 gap-y-1">
                        <div className="flex gap-x-4">
                            <div className="w-fit rounded-full overflow-hidden">
                                <img
                                    className="w-10 h-10 object-cover object-center"
                                    src={user.avatar}
                                    alt="user-avatar"
                                />
                            </div>
                            <div className="w-full">
                                <input
                                    className="w-full bg-transparent outline-none peer"
                                    type="text"
                                    placeholder="Add a comment..."
                                    onClick={() =>
                                        setCommentInputExpanded(true)
                                    }
                                    onChange={(e) =>
                                        setUserComment(e.target.value)
                                    }
                                    value={userComment}
                                />
                                <div className="bg-white/20 peer-focus:bg-white h-[1px] peer-focus:h-[1px]"></div>
                            </div>
                        </div>
                        {commentInputExpanded && (
                            <div className="self-end">
                                <button
                                    onClick={() => {
                                        setCommentInputExpanded(false);
                                        setUserComment("");
                                    }}
                                    className="py-1.5 px-4 rounded-full hover:bg-white/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitHandler}
                                    className={`py-1.5 px-4 rounded-full ml-4 ${userComment?.trim() !== "" ? "bg-purple-500" : "bg-white/20 pointer-events-none brightness-50"}`}
                                >
                                    Comment
                                </button>
                            </div>
                        )}
                    </div>
                    {/* all comments */}
                    <div className="mt-10 grid space-y-4">
                        {videoComments.map((item) => (
                            <div className="flex gap-x-4 w-full" key={item._id}>
                                <div className="min-w-fit h-fit">
                                    <img
                                        className="w-10 h-10 aspect-square rounded-full object-cover object-center"
                                        src={item.owner.avatar}
                                        alt="avatar"
                                    />
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm font-bold">
                                                @{item.owner.username}
                                            </span>
                                            <span className="ml-2 text-xs text-white/40">
                                                {timeSince(item.updatedAt)}
                                            </span>
                                        </div>
                                        {item.owner._id === user._id && (
                                            <button
                                                className="w-6 p-1 rounded-full hover:bg-red-500 transition-colors duration-100"
                                                onClick={() =>
                                                    deleteHandler(item._id)
                                                }
                                            >
                                                <img src={trash} alt="delete"/>
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-1">{item.content}</p>
                                    <div className="mt-1 text-sm text-white/80 -ml-1">
                                        <Like id={item._id} type={"c"} addClasses={"px-1.5 py-1 hover:bg-white/20"}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comments;
