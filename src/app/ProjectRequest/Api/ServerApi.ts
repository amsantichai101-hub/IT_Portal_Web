import axios from "axios";
import { baseHeader } from "@/lib/axios/customAxios";

// base on Serversite
export const apiServer = axios.create({
    baseURL: `${process.env.API_PROJECTREQUEST}`,
    headers: baseHeader
});


// New Request Gen
export const GenerateRequestFromNew = async () => {
  const data = apiServer.get("/api/RequestFromNew");
  return data
}