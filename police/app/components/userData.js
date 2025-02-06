import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (userData) => {
    try {
        const jsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem('user', jsonValue);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

const getUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

const logout = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error('Error removing user data:', error);
    }
};

export default userDetails = {
    login,
    logout,
    getUserData,
}
