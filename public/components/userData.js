import { useState } from "react";

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userData, setUserData] = useState(null);

const login = (aadhaarNo) => {
    if (aadhaarNo) {
        setIsLoggedIn(true);
        setUserData(aadhaarNo);
    }
}

const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
}

const getAadhaarNo = () => {
    return userData;
}

const getIsLoggedIn = () => {
    return isLoggedIn;
}

const userDetails = {
    login,
    logout,
    getAadhaarNo,
    getIsLoggedIn,
}

export default userDetails;