import { useEffect, useState } from "react";
import logo from "../assets/asset-6.svg";
import eye from "../assets/eye.svg";
import upload from "../assets/upload.svg";
import closedEye from "../assets/eye-closed.svg";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

// todo: check for valid email
const RegisterPage = () => {
    const url = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // * testing
    // useEffect(() => {
    //     console.log("avatar", avatar);
    //     console.log("cover image", coverImage);
    // }, [avatar, coverImage]);

    const register = async (userFormData) => {
        try {
            setLoading(true);
            const loadToast = toast.loading("Registering User...");

            const formData = new FormData();

            formData.append("avatar", avatar);

            if (coverImage) {
                formData.append("coverImage", coverImage);
            }

            formData.append("username", userFormData.username);
            formData.append("password", userFormData.password);
            formData.append("email", userFormData.email);
            formData.append("fullname", userFormData.fullname);

            const res = await axios.post(
                `${url}/users/register`,
                formData,
                { withCredentials: true },
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const userData = res.data.data;

            // todo: production remove
            console.log(userData);

            if (res.status >= 200 || res.status < 300) {
                setLoading(false);
                toast.remove(loadToast);
                toast.success("User Registered Successfully!! Redirecting...");

                setTimeout(() => {
                    toast.remove();
                    navigate("/login");
                }, 2000);
            }
        } catch (e) {
            setLoading(false);
            toast.remove();

            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while registering user!!");

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

    // * drag and drop component
    // const uploadHandler = (e)=>{
    //     e.preventDefault()
    //     e.stopPropagation()
    // }

    const fileChangeHandler = (e) => {
        const files = e.target.files;

        if (files) {
            e.target.id === "avatar"
                ? setAvatar(files[0])
                : setCoverImage(files[0]);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        register(formData);

        setFormData({
            fullname: "",
            username: "",
            email: "",
            password: "",
        });
    };

    return (
        // todo: sticky logo
        <div className="h-fit overflow-y-auto bg-dark-bg text-white flex pt-24 pb-10 px-12 justify-between ">
            <div className="flex-[0.5] flex justify-center items-center relative">
                <img
                    className="self-start  w-[30rem] aspect-square sticky top-0"
                    src={logo}
                    alt="logo"
                />
            </div>
            <div className="flex-[0.5] h-fit">
                <form
                    onSubmit={submitHandler}
                    className="mx-auto w-[60%] flex flex-col gap-y-6"
                >
                    <label className="block text-gray-300">
                        Full Name*
                        <div>
                            <input
                                name="fullname"
                                id="fullname"
                                type="text"
                                value={formData.fullname}
                                onChange={changeHandler}
                                placeholder="Enter your full name"
                                className="outline-none mt-0.5 w-full border bg-transparent px-3 py-2"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </label>
                    <label className="block text-gray-300">
                        Username*
                        <div>
                            <input
                                name="username"
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={changeHandler}
                                placeholder="Enter your username"
                                className="outline-none mt-0.5 w-full border bg-transparent px-3 py-2"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </label>
                    <label className="block text-gray-300">
                        Email*
                        <div>
                            <input
                                name="email"
                                id="email-password"
                                type="email"
                                value={formData.email}
                                onChange={changeHandler}
                                placeholder="Enter your email or username"
                                className="outline-none mt-0.5 w-full border bg-transparent px-3 py-2"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </label>
                    <label className="text-gray-300">
                        Password*
                        <div className="flex mt-0.5 w-full border items-center justify-center ">
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
                    <label className="mt-6 border-2 border-dashed h-fit flex justify-center items-center text-gray-300 py-12">
                        {/* // todo: show image when selected */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full bg-gray-200 p-6">
                                <img
                                    className="w-12 aspect-square"
                                    src={upload}
                                    alt="upload"
                                />
                            </div>
                            <h4 className="text-lg font-semibold text-white mt-4">
                                Upload Avatar
                            </h4>
                            <p className="mt-1 text-gray-400">
                                Drag and drop image file to upload
                            </p>
                            <div className="cursor-pointer bg-purple-600 px-4 py-2 mt-8 text-black font-bold shadow-solid-box transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-active-solid-box">
                                Select File
                            </div>
                        </div>

                        <input
                            name="avatar"
                            id="avatar"
                            type="file"
                            hidden
                            onChange={fileChangeHandler}
                            multiple={false}
                            className="outline-none mt-0.5 w-full border bg-transparent px-3 py-2"
                            required
                        />
                    </label>
                    <label className="block text-gray-300">
                        Cover Image
                        <div>
                            <input
                                name="coverImage"
                                id="coverImage"
                                type="file"
                                onChange={fileChangeHandler}
                                multiple={false}
                                className="outline-none mt-0.5 w-full border bg-transparent px-3 py-2"
                            />
                        </div>
                    </label>
                    {!loading ? (
                        <button className="bg-[hsl(263,100%,64%)] mt-2.5 px-4 py-3 hover:bg-[hsl(263,100%,58%)] text-black font-bold">
                            Register
                        </button>
                    ) : (
                        <div className="bg-gray-500 mt-2.5 px-4 py-3 cursor-not-allowed text-center text-gray-300">
                            Registering...
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
