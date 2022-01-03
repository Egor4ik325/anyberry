// Exceptional error response from the API
export class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError"
    }
}