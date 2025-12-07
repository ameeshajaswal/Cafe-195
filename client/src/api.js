import { API_BASE } from './config.js';

export async function apiFetch(path, options = {}) {
    const url = `${API_BASE}${path}`;  // Fixed: API_BASE not API_BASE_URL

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("authToken");
        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(url, mergedOptions);

    let data = null;
    try {
        data = await response.json();
    } catch {
        // If response has no JSON body, data stays null
    }

    if (!response.ok) {
        const message = data?.message || "Request failed";
        throw new Error(message);
    }

    return data;
}