import { API_URL } from "./constants";

const endpoints = {
    register: `${API_URL}auth/registration/`,
    resend: `${API_URL}auth/registration/resend-email/`,
}
export default endpoints;