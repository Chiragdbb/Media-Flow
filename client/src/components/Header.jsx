import { useEffect, useState } from "react";
import logo from "../assets/asset-1.svg";
import search from "../assets/search.svg";
import { useNavigate } from "react-router";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // todo: login and logout 
    // todo: user avatar on login and 
    // todo: search api, 

    useEffect(() => {
        // check login status from store
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
    };

    return (
        <header className="h-[5.25rem] pt-2 pb-1 px-4 pl-0.5 bg-dark-bg flex justify-between items-center text-white border-b border-white">
            <div
                onClick={() => navigate("/")}
                className="h-full w-fit cursor-pointer"
            >
                <img className="h-full " src={logo} alt="logo" />
            </div>
            <div className="border py-2 px-3 w-[25rem]">
                <form
                    className="flex items-center justify-start"
                    onSubmit={submitHandler}
                >
                    <div>
                        <img className="w-5 h-6" src={search} alt="" />
                    </div>
                    <input
                        className="bg-dark-bg ml-2.5 w-full outline-none"
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                    />
                </form>
            </div>
            {isLoggedIn ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    {/* user avatar */}
                    <img
                        className="w-full h-full aspect-square"
                        src={avatar}
                        alt="avatar"
                    />
                </div>
            ) : (
                <div className="">
                    <button
                        onClick={() => navigate("/login")}
                        className="cursor-pointer bg-transparent px-5 py-2 mr-4"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="cursor-pointer bg-purple-400 px-4 py-2 text-black font-bold shadow-solid-box transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-active-solid-box"
                    >
                        Sign up
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
