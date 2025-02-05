import { createContext, useContext, useState } from "react";
import authServices from "../Services/apiRouters";

const SessionContext = createContext();

export const UseSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return sessionStorage.getItem("user") ? true : false;
    });

    const [user, setUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem("user")) || null;
    });

    const login = (userData) => {
        if (!userData) return;
        setIsLoggedIn(true);
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        await authServices.logout();
        setIsLoggedIn(false);
        setUser(null);
        sessionStorage.removeItem("user");
        window.location.href = "/login"; // ✅ Ensure session is cleared
    };

    return (
        <SessionContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;
