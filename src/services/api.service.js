import { API_CONFIG } from '../config/api.config';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = API_CONFIG.HEADERS;
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
        // Ensure endpoint is defined and properly formatted
        if (!endpoint) {
            endpoint = '';
        } else if (endpoint && !endpoint.startsWith('/')) {
            endpoint = `/${endpoint}`;
        }
        return `${this.baseURL}${endpoint}`;
    }

    // Handle response
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            const error = new Error(data.message || response.statusText);
            error.response = {
                status: response.status,
                data: data
            };
            return Promise.reject(error);
        }
        
        return data;
    }

    // GET request
    async get(endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });
            return this.handleResponse(response);
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
            return this.handleResponse(response);
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
            return this.handleResponse(response);
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
            return this.handleResponse(response);
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
            return this.handleResponse(response);
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
            
            return this.handleResponse(response);
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