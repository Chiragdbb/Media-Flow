import logo from "../assets/asset-1.svg";
import search from "../assets/search.svg";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Logout from "./logout";

const Header = () => {
    const navigate = useNavigate();
    let { loggedIn, userData } = useSelector((state) => state.user);

    const submitHandler = (e) => {
        e.preventDefault();
        // todo: show videos with user query title
        // ? videos feed for search or resuse home feed 
    };

    return (
        <header className="h-[12vh] pt-2 pb-1 pr-5 pl-0.5 bg-dark-bg flex justify-between items-center text-white">
            <div
                onClick={() => navigate("/")}
                className="h-full w-fit cursor-pointer"
            >
                <img className="h-full " src={logo} alt="logo" />
            </div>
            <div className="border rounded-full py-2 px-3 w-[25rem]">
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
                        autoComplete="off"
                        placeholder="Search"
                    />
                </form>
            </div>
            {loggedIn ? (
                <div className="flex justify-center items-center gap-x-5">
                    <Logout />
                    <div className="w-11 h-11 rounded-full flex justify-center items-center overflow-hidden">
                        {/* logout btn */}
                        <img
                            className="h-full object-cover object-center"
                            src={userData.avatar}
                            alt="avatar"
                        />
                    </div>
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
