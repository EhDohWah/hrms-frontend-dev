import { API_CONFIG } from '../config/api.config';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = { ...API_CONFIG.HEADERS };

        // If there's a token in localStorage, set it
        const token = localStorage.getItem('token');
        if (token) {
            this.setAuthToken(token);
        }
    }

    // Set auth token
    setAuthToken(token) {
        if (token) {
            this.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.headers['Authorization'];
        }
    }

    // Get full URL
    getFullURL(endpoint) {
        if (!endpoint) {
            endpoint = '';
        } else if (endpoint && !endpoint.startsWith('/')) {
            endpoint = `/${endpoint}`;
        }
        return `${this.baseURL}${endpoint}`;
    }

    // Handle response
    async handleResponse(response, originalRequest) {
        // Check if response is unauthorized
        if (response.status === 401) {
            // Attempt to refresh token
            const refreshed = await this.attemptRefreshToken();
            if (refreshed) {
                // Retry the original request with new token
                return this.retryRequest(originalRequest);
            } else {
                // If refresh fails, clear stored token and reject
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                throw new Error('Unauthenticated.');
            }
        }

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || response.statusText);
            error.response = {
                status: response.status,
                data: data
            };
            throw error;
        }
        return data;
    }

    async attemptRefreshToken() {
        try {
            // Call the refresh endpoint; adjust the URL if needed
            const refreshResponse = await fetch(this.getFullURL('/refresh-token'), {
                method: 'POST',
                headers: this.headers,
                credentials: 'include'
            });
            if (!refreshResponse.ok) {
                return false;
            }
            const refreshData = await refreshResponse.json();
            const newToken = refreshData.access_token;
            // Update localStorage and headers
            localStorage.setItem('token', newToken);
            // Optionally update token expiration if provided
            if (refreshData.expires_in) {
                const expiration = Date.now() + refreshData.expires_in * 1000;
                localStorage.setItem('tokenExpiration', expiration);
            }
            this.setAuthToken(newToken);
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }

    async retryRequest(originalRequest) {
        // Re-run the original request using its parameters
        const { endpoint, method, data } = originalRequest;
        switch (method) {
            case 'GET':
                return this.get(endpoint);
            case 'POST':
                return this.post(endpoint, data);
            case 'PUT':
                return this.put(endpoint, data);
            case 'DELETE':
                return this.delete(endpoint);
            case 'PATCH':
                return this.patch(endpoint, data);
            default:
                throw new Error('Method not supported for retry');
        }
    }

    // GET request
    async get(endpoint) {
        const fullURL = this.getFullURL(endpoint);
        try {
            const response = await fetch(fullURL, {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'GET' });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }

    // POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data),
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'POST', data });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }

    // PUT request
    async put(endpoint, data) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data),
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'PUT', data });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }

    // DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'DELETE',
                headers: this.headers,
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'DELETE' });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }

    // PATCH request
    async patch(endpoint, data) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(data),
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'PATCH', data });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }

    // Method for handling FormData uploads
    async postFormData(endpoint, formData) {
        try {
            // Create headers without Content-Type (browser will set it with boundary)
            const headers = { ...this.headers };
            delete headers['Content-Type']; // Let the browser set this for FormData
            
            // Make sure X-Requested-With is set for Laravel to recognize AJAX requests
            headers['X-Requested-With'] = 'XMLHttpRequest';
            
            // Log the endpoint for debugging
            console.log('Posting FormData to endpoint:', endpoint);
            const fullUrl = this.getFullURL(endpoint);
            console.log('Full URL:', fullUrl);
            
            // Make the request with FormData
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: headers,
                body: formData, // Send FormData directly, not JSON.stringify
                credentials: 'include'
            });
            
            return this.handleResponse(response, { endpoint, method: 'POST', data: formData });
        } catch (error) {
            console.error('Error in postFormData:', error);
            if (!error.response) {
                error.message = 'Network Error';
            }
            return Promise.reject(error);
        }
    }
}

export const apiService = new ApiService();