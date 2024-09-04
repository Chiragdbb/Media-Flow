import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { endSession } from "../store/userSlice";
import { useNavigate } from "react-router";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const loadToast = toast.loading("Logging out..");

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/users/logout`,
                null,
                {
                    withCredentials: true,
                }
            );
            const data = res.data.data;

            // prod remove
            console.log(res);

            if (res.status === 200 && data) {
                dispatch(endSession());
                toast.remove(loadToast);
                toast.success("Logged out!!");
                navigate("/login");
            }
        } catch (e) {
            toast.remove();
            toast.error("Error while logging out!!");
            console.log(e.response);
        }
    };

    return (
        <div>
            <button onClick={logout} className="px-3 py-2 hover:bg-gray-600">
                Logout
            </button>
        </div>
    );
};

export default Logout;
