/*
Custom API exceptions (error objects) provide:

- more descriptive messages
- dispatching ability (determining what kind of error based on exception)
- additional data extracted from the API response
*/

// Exceptional error response from the API
export class APIError extends Error {
    constructor() {
        super();
        this.message = "Some error occur in the API.";
        this.name = "APIError";
    }
}

export class DetailError extends APIError {
    constructor({detail}) {
        super();
        this.message = "Error response containing details about the error."
        this.name = "DetailResponse";
        this.detail = detail;
    }
}

export class RegistrationError extends APIError {
    constructor() {
        super();
        this.message = "Some unknown error occur while registration process.";
        this.name = "RegistrationError";
    }
}

export class RegistrationBadRequestError extends RegistrationError {
    constructor(response) {
        super();
        this.name = "RegistrationBadRequestError";
        this.message = "Server returned bad request response status, meaning the initial data is erroneous.";

        const { username = null, email = null, password1 = null, non_field_errors = null } = response.data;
        this.username = username;
        this.email = email;
        this.password = password1;
        this.nonFieldErrors = non_field_errors;
    }
}