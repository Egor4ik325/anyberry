import axios from "axios";
import { BERRIES_URL } from "./constants";

export const getBerry = async id => {
    try {
        const response = await axios.get(BERRIES_URL + `${id}/`, { withCredentials: true });
        const berry = response.data;
        return berry;
    } catch (errors) {
        console.error("Get berry error: ", errors);
        return null;
    }
}