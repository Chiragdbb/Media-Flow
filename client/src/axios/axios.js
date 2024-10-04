import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { endSession, updateSession } from "../store/userSlice";
import { useEffect } from "react";

const useAxios = () => {
    const { userData, accessToken } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // axios instance
    const api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        withCredentials: true,
    });

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        return decoded.exp < now;
    };

    // refresh with new access token
    const refreshTokens = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/users/refresh-token`,
                null,
                {
                    withCredentials: true,
                }
            );

            // console.log("tokens refreshed");

            // update access token
            dispatch(
                updateSession({
                    accessToken: res.data.data.accessToken,
                    userData,
                })
            );
        } catch (e) {
            console.log("Error while refreshing tokens", e);
            console.log("cleared state");

            // logout
            dispatch(endSession());
            navigate("/login");
        }
    };

    // intercept every request to check for valid access token
    useEffect(() => {
        api.interceptors.request.use(
            async (req) => {
                if (isTokenExpired(accessToken)) {
                    // console.log("token expired: refreshing...");
                    await refreshTokens();
                }
                return req;
            },
            (err) => Promise.reject(err)
        );
    }, []);

    return api;
};

export default useAxios;
