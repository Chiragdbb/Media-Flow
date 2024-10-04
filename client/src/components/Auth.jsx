import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Auth({ children, authentication = true }) {
    const { loggedIn } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (authentication && loggedIn !== authentication) {
            navigate("/login");
        } else if (!authentication && loggedIn !== authentication) {
            navigate("/");
        }
        setLoader(false);
    }, [loggedIn, navigate, authentication]);

    return loader ? "" : <>{children}</>;
}
