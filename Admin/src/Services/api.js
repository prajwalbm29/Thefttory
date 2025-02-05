import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.47.63:7001/api",
})