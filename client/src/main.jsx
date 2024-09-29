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
import Collections from "./components/Collections.jsx";
import History from "./components/History.jsx";
import MyContent from "./components/MyContent.jsx";
import Settings from "./components/Settings.jsx";
import Subscribers from "./components/Subscribers.jsx";
import Support from "./components/Support.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* protected route */}
            <Route path="" element={<RootLayout />}>
                <Route path="/" element={<HomeFeed />} />
            </Route>

            {/* protected routes */}
            {/* change user = username later */}
            <Route path="/user" element={<RootLayout />}>
                <Route path="/user/liked" element={<LikedVideos />} />
                <Route path="/user/subscribers" element={<Subscribers />} />
                <Route path="/user/content" element={<MyContent />} />
                <Route path="/user/history" element={<History />} />
                <Route path="/user/collections" element={<Collections />} />
                <Route path="/user/support" element={<Support />} />
                <Route path="/user/settings" element={<Settings />} />
            </Route>

            {/* protected route */}
            <Route path="/watch/:videoId" element={<WatchLayout />}>
                {/* <Route path="" element={<WatchVideo />} /> */}
            </Route>

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Route>
    )
);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
    </Provider>
);
