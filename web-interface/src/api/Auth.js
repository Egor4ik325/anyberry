import axios from "axios";
import { USER_URL } from "../Constants";
import { APIError, RegistrationError, DetailError, RegistrationBadRequestError } from "./exceptions";
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
export const register = async ({username, email, password}) => {
    try {
        const response = await axios.post(endpoints.register, {
            username: username,
            email: email,
            password1: password,
            password2: password,
        });

        return new RegistrationResponse(response);
    } catch (error) {
        // Notify registering user about API exceptions

        // If non-2xx response status code
        if (error.response) {
            // Dispatch error type based on status code
            if (error.response.status === 400) {
                throw new RegistrationBadRequestError(error.response);
            }

            // Extract information about error from response
            if ("detail" in error.response) {
                throw new DetailError({ detail: error.response.detail });
            }

            // Construct and raise error object (exception)
            throw new RegistrationError();
        }

        // Reraise other exceptions
        throw error;
    }
}

class RegistrationResponse {
    constructor(response) {
        const { detail = null } = response.data;
        this.detail = detail;
    }
}