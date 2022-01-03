import axios from "axios";
import { USER_URL } from "../Constants";
import { APIError } from "./exceptions";
import endpoints from "./endpoints";

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


// Make a registration request to the API
// Return response or raised error object
const register = async ({username, email, password}) => {
    try {
        const response = await axios.post(endpoints.register, {
            username: username,
            email: email,
            password1: password,
            password2: password,
        });

        return RegisterResponse(response.data)
    } catch (error) {
        // Notify registering user about API exceptions

        // If non-2xx response status code
        if (error.response) {
            // Extract information about error from response
            if ("detail" in error.response) {
                throw APIError(error.response.detail);
            }

            // Construct and raise error object (exception)
            throw APIError("Registration error");
        }

        // Reraise other exceptions
        throw error;
    }
}

class DetailResponse {
    constructor({detail, ...rest}) {
        this.detail = detail;
    }
}

class RegisterResponse extends DetailResponse { }