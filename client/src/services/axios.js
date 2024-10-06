import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { endSession, updateSession } from "../store/userSlice";
import { useEffect } from "react";

const useAxios = () => {
    const { userData, accessToken } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let isRefreshingToken = false;
    let refreshSubscribers = []; // Store pending requests during token refresh

    const api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        withCredentials: true, // Automatically include cookies in requests
    });

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        return decoded.exp < now;
    };

    const onRefreshed = () => {
        refreshSubscribers.forEach((callback) => callback());
        refreshSubscribers = [];
    };

    const addRefreshSubscriber = (callback) => {
        refreshSubscribers.push(callback);
    };

    // Refresh tokens and update access token in redux store
    const refreshTokens = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/users/refresh-token`,
                null,
                {
                    withCredentials: true,
                }
            );

            if (res && res.status === 200) {
                dispatch(
                    updateSession({
                        accessToken: res.data.data.accessToken,
                        userData,
                    })
                );
                console.log("Tokens refreshed");
                onRefreshed(); // Notify subscribers waiting for token refresh
                return res.data.data.accessToken;
            }
        } catch (e) {
            console.log("Error while refreshing tokens:", e);

            // Logout on failure
            dispatch(endSession());
            navigate("/login");
            throw new Error("Session expired");
        } finally {
            isRefreshingToken = false;
        }
    };

    useEffect(() => {
        api.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if (error.response && error.response.status === 401) {
                    if (isTokenExpired(accessToken)) {
                        console.log("Token expired, refreshing...");

                        if (!isRefreshingToken) {
                            isRefreshingToken = true;

                            try {
                                await refreshTokens();

                                // Retry original request after refresh
                                return api(originalRequest);
                            } catch (err) {
                                return Promise.reject(err);
                            }
                        } else {
                            // Add request to queue to wait for token refresh
                            return new Promise((resolve) => {
                                addRefreshSubscriber(() => {
                                    resolve(api(originalRequest)); // Retry request once token is refreshed
                                });
                            });
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }, [accessToken, dispatch]);

    return api;
};

export default useAxios;

