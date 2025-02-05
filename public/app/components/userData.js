import { useState } from "react"

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);

const login = (data) => {
    if (data) {
        setUser(data);
        isLoggedIn(true);
    }
}

const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
}

const getData = () => {
    return user;
}

const isAuthorized = () => {
    return isLoggedIn;
}

const userDetails = {
    login,
    logout,
    getData,
    isAuthorized,
}

export default userDetails;