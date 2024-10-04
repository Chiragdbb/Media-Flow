import { useEffect, useState } from "react";
import sub from "../assets/subscribe.svg";
import toast from "react-hot-toast";
import useAxios from "../axios/axios";

const Subscribe = ({ channelId, subStatus }) => {
    const [subscribed, setSubscribed] = useState(subStatus);
    const [loading, setLoading] = useState(false);
    const api = useAxios()

    useEffect(() => {
        setSubscribed(subStatus);
    }, [subStatus, channelId]);

    const toggleSubscription = async () => {
        try {
            setLoading(true);
            const loadToast = toast.loading(
                subscribed ? "Unsubscribing..." : "Subscribing..."
            );

            const res = await api.post(
                `/subscribe/${channelId}`,
                null,
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                data._id ? setSubscribed(true) : setSubscribed(false);
                toast.remove(loadToast);
                toast.success(!subscribed ? "Subscribed!" : "Unsubscribed!");
            } else {
                setSubscribed(!subscribed);
                toast.remove(loadToast);
                toast.error(
                    !subscribed
                        ? "Error while subscribing"
                        : "Error while unsubscribing"
                );
            }
        } catch (e) {
            toast.remove();
            toast.error(e.response.data.message);
            setSubscribed(!subscribed);
            console.log("Error while toggling subscription to channel:", error);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleSubscription}
                className={`flex items-center justify-center gap-x-2 px-4 py-2 text-sm cursor-pointer 
                bg-purple-500 text-black shadow-solid-box transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-active-solid-box
                ${loading ? "pointer-events-none " : ""}`}
            >
                <img className="w-5" src={sub} alt="subscribe" />
                {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
        </>
    );
};

export default Subscribe;
