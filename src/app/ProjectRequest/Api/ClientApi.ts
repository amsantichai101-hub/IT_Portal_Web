import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT_PROJECTREQUEST,
});

//New Request 
export const SearchApplicationName = async (applicationName : string) => {
  const response = await apiClient.get("/api/ListApplication", {
    params: {
      ApplicationName: applicationName
    }
  });
  return response; 
};

export const SearchEmployeeName = async (employeeName : string) => {
  const response = await apiClient.get("/api/ListEmployee", {
    params: {
      EmpName: employeeName
    }
  });
  return response; 
};