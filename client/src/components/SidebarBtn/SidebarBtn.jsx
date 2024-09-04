import { NavLink } from "react-router-dom";
import "./sidebarBtn.css";

const SidebarBtn = ({ linkTo, text, img }) => {
    return (
        <NavLink to={linkTo} className="side-btn">
            <img src={img} alt={img} />
            <div>{text}</div>
        </NavLink>
    );
};

export default SidebarBtn;
