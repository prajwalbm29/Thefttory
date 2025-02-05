import { Outlet, Navigate } from "react-router-dom";
import { UseSession } from "../context/sessionContext";

function ProtectedRouter() {
    const { isLoggedIn } = UseSession();

    console.log("Login status in ProtectedRouter:", isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRouter;
