import home from "../assets/home.svg";
import like from "../assets/like.svg";
import collection from "../assets/collection.svg";
import history from "../assets/history.svg";
import settings from "../assets/settings.svg";
import support from "../assets/support.svg";
import video from "../assets/video.svg";
import subscribers from "../assets/user-check.svg";
import SidebarBtn from "./SidebarBtn/SidebarBtn";

const Sidebar = () => {
    return (
        <aside className="h-full flex flex-col justify-between pl-1.5 py-4">
            <div className="flex flex-col gap-y-0.5">
                <SidebarBtn linkTo={"/"} text={"Home"} img={home} />
                <SidebarBtn
                    linkTo={"/user/liked"}
                    text={"Liked Videos"}
                    img={like}
                />
                <SidebarBtn
                    linkTo={"/user/history"}
                    text={"History"}
                    img={history}
                />
                <SidebarBtn
                    linkTo={"/user/content"}
                    text={"My Content"}
                    img={video}
                />
                <SidebarBtn
                    linkTo={"/user/collections"}
                    text={"Collections"}
                    img={collection}
                />
                <SidebarBtn
                    linkTo={"/user/subscribers"}
                    text={"Subscribers"}
                    img={subscribers}
                />
            </div>
            <div className="flex flex-col gap-y-0.5">
                <SidebarBtn
                    linkTo={"/user/support"}
                    text={"Support"}
                    img={support}
                />
                <SidebarBtn
                    linkTo={"/user/settings"}
                    text={"Settings"}
                    img={settings}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
