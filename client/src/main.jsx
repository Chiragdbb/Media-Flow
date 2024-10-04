import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomeFeed from "./pages/HomeFeed.jsx";
import WatchLayout from "./layouts/WatchLayout.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Collections from "./pages/Collections.jsx";
import History from "./pages/History.jsx";
import MyContent from "./pages/MyContent.jsx";
import Settings from "./pages/Settings.jsx";
import Subscribers from "./pages/Subscribers.jsx";
import Support from "./pages/Support.jsx";
import Auth from "./components/Auth.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* open routes */}
            <Route
                path="/register"
                element={
                        <RegisterPage />
                }
            />
            <Route
                path="/login"
                element={
                        <LoginPage />
                }
            />

            {/* protected routes */}
            <Route
                path="/"
                element={
                    <Auth authentication>
                        <RootLayout />
                    </Auth>
                }
            >
                <Route path="/" element={<HomeFeed />} />
                <Route path="/user/liked" element={<LikedVideos />} />
                <Route path="/user/subscribers" element={<Subscribers />} />
                <Route path="/user/content" element={<MyContent />} />
                <Route path="/user/history" element={<History />} />
                <Route path="/user/collections" element={<Collections />} />
                <Route path="/user/support" element={<Support />} />
                <Route path="/user/settings" element={<Settings />} />
            </Route>

            <Route
                path="/watch/:videoId"
                element={
                    <Auth authentication={true}>
                        <WatchLayout />
                    </Auth>
                }
            />
        </Route>
    )
);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
    </Provider>
);
