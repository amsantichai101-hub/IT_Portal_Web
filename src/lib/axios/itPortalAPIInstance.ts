import axios from "axios";
import { baseHeader } from "./customAxios";

const itPortalAPI = axios.create({
    baseURL: `${process.env.API_ENDPOINT}`,
    headers: baseHeader
});

export default itPortalAPI