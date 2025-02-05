import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import ErrorPage from "./pages/error";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import ProtectedRouter from "./pages/protectedRouter";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <ProtectedRouter />, // ✅ Wraps only protected routes
        errorElement: <ErrorPage />,
        children: [
            {
                index: true, // ✅ Default route when "/" is visited
                element: <HomePage />,
            },
            {
                path: "about", // ✅ Nested properly under "/"
                element: <AboutPage />,
            },
        ],
    },
]);

export default router;
