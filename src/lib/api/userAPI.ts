import { UserData } from "@/types/User";
import itPortalAPI  from "../axios/itPortalAPIInstance";
import axios from "axios";

export async function fetchUserData() : Promise<UserData | null> {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  console.log("Enter get user")

  try {
    const response = await itPortalAPI.get<UserData>(`/WeatherForecast`);
    
    if(response.status !== 200) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return response.data;
  } catch(err) {
    return null;
  }
}
