const Sidebar = () => {
    return (
        <aside className="h-full flex flex-col justify-between px-2 py-4">
            <div className="flex flex-col gap-y-2">
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Home
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Liked Videos
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    History
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    My Content
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Collections
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Subscribers
                </div>
            </div>
            <div className="flex flex-col gap-y-2">
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Support
                </div>
                <div className="border-2 px-2 py-1">
                    <img src="" alt="" />
                    Settings
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
