import logo from "../assets/temp/asset-6.svg";
import eye from "../assets/eye.svg";
import closedEye from "../assets/eye-closed.svg";
import { useState } from "react";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="">
            <div className="h-screen overflow-hidden bg-[#121212] text-white flex flex-col pt-14">
                <div className="mx-auto w-[15rem]">
                    <img
                        className="w-full aspect-square"
                        src={logo}
                        alt="logo"
                    />
                </div>
                <div className="mx-auto flex w-full max-w-sm flex-col px-4 gap-6">
                    <label className="block text-gray-300">
                        Email / Username*
                        <div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email or username"
                                className="outline-none mt-0.5 w-full rounded-lg border bg-transparent px-3 py-2"
                                required
                            />
                        </div>
                    </label>
                    <label className="text-gray-300">
                        Password*
                        {/* // TODO: view password btn */}
                        <div className="flex mt-0.5 w-full rounded-lg border items-center justify-center ">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className=" pl-3 py-2 border-none outline-none flex-1 bg-transparent"
                                required
                            />
                            <div
                                className="w-8 flex items-center justify-center mr-1 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
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
                    {/* // todo: loading for signin and success later */}
                    <button className="bg-[hsl(263,100%,64%)] mt-2.5 px-4 py-3  hover:bg-[hsl(263,100%,58%)] rounded-lg">
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
