import api from './api';

const getData = async (aadhaarNo) => {
    return await api.post('/getData', {
        "aadhaarNo": aadhaarNo,
    })
}

const login = async (aadhaarNo, password) => {
    console.log("Inside login")
    return await api.post('/admin/login', {
        "aadhaarNo": aadhaarNo,
        "password": password
    })
};

const loginStatus = async () => {
    return await api.post('/admin/loginStatus', {});
};

const generateOTP = async (aadhaarNo) => {
    return await api.post('/admin/generateOTP',
        { "aadhaarNo": aadhaarNo },
    );
};

const verifyOTP = async (aadhaarNo, otp) => {
    return await api.post('/admin/verifyOTP', {
        "aadhaarNo": aadhaarNo,
        "otp": otp
    },
    );
};

const getPolice = async () => {
    return await api.get('/admin/getPolice');
};

const allowAccess = async (policeId) => {
    return await api.post('/admin/allowAccess', {
        "policeId": policeId,
    });
};

const declineAccess = async (policeId) => {
    return await api.post('/admin/declineAccess', {
        "policeId": policeId,
    });
};

const getComplaints = async (id = null) => {
    if (id) {
        return await api.get(`/admin/getComplaints/${id}`)
    }
    return await api.get('/admin/getComplaints')
}

const allotComplaint = async (policeId, complaintId) => {
    return await api.post('/admin/allotComplaint', {
        "policeId": policeId,
        "complaintId": complaintId,
    })
}

const removeAllotment = async (policeId, complaintId) => {
    return await api.post('/admin/removeAllotment', {
        "policeId": policeId,
        "complaintId": complaintId,
    })
}

const logout = async () => {
    return await api.post('/admin/logout');
};

const authServices = {
    login,
    loginStatus,
    generateOTP,
    verifyOTP,
    getPolice,
    allowAccess,
    declineAccess,
    logout,
    getData,
    getComplaints,
    allotComplaint,
    removeAllotment,
}

export default authServices;