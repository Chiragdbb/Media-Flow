import "./loader.css";

const Loader = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
        </div>
    );
};

export default Loader;
