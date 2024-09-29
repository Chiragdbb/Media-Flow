import axios from "axios";
import { useEffect, useState } from "react";

const Subscribe = ({ channelId, subStatus }) => {
    const [subscribed, setSubscribed] = useState(subStatus);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSubscribed(subStatus);
    }, [subStatus, channelId]);

    const toggleSubscription = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/subscribe/${channelId}`,
                null,
                { withCredentials: true }
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                data._id ? setSubscribed(true) : setSubscribed(false);
            } else {
                setSubscribed(!subscribed);
            }
        } catch (e) {
            console.log("Error while toggling subscription to channel:", error);
            setSubscribed(!subscribed);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleSubscription}
                className={`bg-white/90 rounded-full text-black/90 px-4 py-2 text-sm cursor-pointer hover:bg-white ${loading ? "pointer-events-none" : ""}`}
            >
                {loading
                    ? "Loading..."
                    : subscribed
                      ? "Unsubscribe"
                      : "Subscribe"}
            </button>
        </>
    );
};

export default Subscribe;
