/**
 * Centralized API client.
 * - Automatically attaches Authorization header from localStorage
 * - Throws ApiError with { message, status } on non-2xx responses
 * - All pages use this instead of raw fetch
 */

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(path, { ...options, headers });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            message = data.message || data.error || message;
        } catch {}
        throw new ApiError(message, res.status);
    }

    return res.json();
}

export const api = {
    get: (path, options = {}) => request(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) =>
        request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
    put: (path, body, options = {}) =>
        request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
    delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
};
