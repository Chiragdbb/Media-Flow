import { useState } from "react";
import logo from "../assets/logo-2.svg";
import eye from "../assets/eye.svg";
import closedEye from "../assets/eye-closed.svg";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { startSession } from "../store/userSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useAxios from "../services/axios";

const LoginPage = () => {
    document.title = "Login - Nexus Point";
    const navigate = useNavigate();

    const api = useAxios()

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const login = async (formData) => {
        try {
            toast.remove();
            const loadToast = toast.loading("Signing in user...");

            const res = await api.post(
                `/users/login`,
                formData,
            );
            const userData = res.data.data;

            if (res.data.statusCode === 200 && userData) {
                toast.remove(loadToast);
                toast.success("Logged in Successfully!! Redirecting...");

                setTimeout(() => {
                    toast.remove();
                    navigate("/");
                }, 500);

                dispatch(
                    startSession({
                        accessToken: userData.accessToken,
                        userData: userData.user,
                    })
                );
            }
        } catch (e) {
            toast.remove();
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while logging in user!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const emailOrUsername = regex.test(formData.email);

        const updatedFormData = {
            ...formData,
            username: !emailOrUsername ? formData.email : "",
        };

        login(updatedFormData);

        setFormData({
            email: "",
            password: "",
            username: "",
        });
    };

    return (
        <div className="h-screen overflow-hidden bg-dark-bg text-white flex flex-col justify-between pt-14 pb-3">
            <div>
                <div className="mx-auto w-[15rem]">
                    <img className="w-full aspect-square" src={logo} alt="logo" />
                </div>
                <form
                    onSubmit={submitHandler}
                    className="mx-auto mt-4 flex w-full max-w-sm flex-col px-4 gap-6"
                >
                    <label className="block text-gray-300">
                        Email / Username*
                            <input
                                name="email"
                                id="email-password"
                                type="text"
                                value={formData.email}
                                onChange={changeHandler}
                                placeholder="Enter your email or username"
                                className="outline-none mt-0.5 w-full  border rounded-xl bg-transparent px-3 py-2"
                                required
                                autoComplete="off"
                            />
                    </label>
                    <label className="text-gray-300">
                        Password*
                        <div className="flex mt-0.5 w-full rounded-xl border items-center justify-center ">
                            <input
                                name="password"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={changeHandler}
                                placeholder="Enter your password"
                                className=" pl-3 py-2 border-none outline-none flex-1 bg-transparent"
                                required
                                autoComplete="off"
                            />
                            <div
                                className="w-8 flex items-center justify-center mr-1 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {!showPassword ? (
                                    <img
                                        src={closedEye}
                                        className="h-[22px] aspect-square text-white cursor-pointer"
                                        alt="eye"
                                    />
                                ) : (
                                    <img
                                        src={eye}
                                        className="h-[20px] aspect-square text-white cursor-pointer ml-[2px]"
                                        alt="eye"
                                    />
                                )}
                            </div>
                        </div>
                    </label>
                    <button className="rounded-xl bg-[hsl(263,100%,64%)] mt-2.5 px-4 py-3 hover:bg-[hsl(263,100%,58%)] ">
                        Sign in
                    </button>
                </form>
            </div>
            <div className="mx-auto flex w-full max-w-sm flex-col px-4">
                <div className="mt-4 text-white/60 text-center">
                    <span className="text">New to the scene? </span>
                    <Link to={"/register"} className="ml-1 underline hover:text-purple-500 text-purple-400">Let's get you started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
