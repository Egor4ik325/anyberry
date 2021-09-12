import axios from "axios";
import { USER_URL } from "../Constants";

// Determine whether user session 
export const checkSession = async () => {
    try {
        const response = await axios.get(USER_URL, { withCredentials: true });
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (errors) {
        console.error("Check session error", errors);
        return false;
    }
}