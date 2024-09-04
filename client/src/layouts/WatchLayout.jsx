import Header from "../components/Header";
import WatchVideo from "../pages/WatchVideo";

const WatchLayout = () => {
    return (
        <div className="watchLayout">
            <Header />
            <WatchVideo />
            {/* add videos list here page */}
        </div>
    );
};

export default WatchLayout;
