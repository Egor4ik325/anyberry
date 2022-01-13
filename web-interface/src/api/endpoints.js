import { API_URL } from "./constants";

const endpoints = {
    register: `${API_URL}auth/registration/`,
    resend: `${API_URL}auth/registration/resend-email/`,
    cart: {
        order: `${API_URL}cart/`,
    },
    orders: {
        list: `${API_URL}orders/`,
        detail: id => `${API_URL}orders/${id}/`,
        reject: id => `${API_URL}orders/${id}/reject/`, 
        bill: id => `${API_URL}orders/${id}/bill/`, 
    },
    tasks: {
        detail: `${API_URL}tasks/`,
    },
    favorite: {
        list: `${API_URL}favorite/`,
        detail: berry_id => `${API_URL}favorite/${berry_id}/`,
    }
}
export default endpoints;