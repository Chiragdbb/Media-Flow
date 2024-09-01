import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
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
import VideoPage from "./pages/VideoPage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>

            {/* protected route */}
            <Route path="" element={<RootLayout />}>
                <Route path="" element={<HomeFeed />} />
            </Route>

            {/* protected route */}
            <Route path="watch/:videoId" element={<WatchLayout />}>
                {/* <Route path="" element={<VideoPage />} /> */}
            </Route>

            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
        </Route>
    )
);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
);
