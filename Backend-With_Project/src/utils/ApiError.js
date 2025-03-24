class ApiError extends Error{
    constructor(statusCode, message = "Something Went Wrong", errors =[], stack = "") {
        super(message);
        this.statusCode = statusCode;   // Stores HTTP status code
        this.data = null;               // No data returned in case of an error
        this.message = message;         // Stores the error message
        this.success = false;           // API response will always be unsuccessful (false)
        this.error = errors;            // Stores additional error details (if any)
        
        if(stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }