import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { endSession } from "../store/userSlice";
import { useNavigate } from "react-router";
import useAxios from "../axios/axios";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const api = useAxios();

    const logout = async () => {
        try {
            const loadToast = toast.loading("Logging out...");

            const res = await api.post(`/users/logout`, null);

            const data = res.data.data;

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
            <button
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-700 rounded-full"
            >
                Logout
            </button>
        </div>
    );
};

export default Logout;
