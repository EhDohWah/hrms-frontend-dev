import { API_CONFIG } from '../config/api.config';

/**
 * Permission error event handler
 * Emits a custom event when a 403 permission error occurs
 */
function emitPermissionError(message, requiredPermissions = []) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('permission-denied', {
            detail: {
                message: message || "You don't have permission to perform this action",
                requiredPermissions,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
}

/**
 * Debounce permission error toasts to prevent spam
 */
let lastPermissionErrorTime = 0;
const PERMISSION_ERROR_DEBOUNCE = 2000; // 2 seconds

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = { ...API_CONFIG.HEADERS };

        // NOTE: Authentication token is now stored in HttpOnly cookie
        // The browser automatically sends the cookie with each request
        // when credentials: 'include' is set (which is already configured)
        // No need to manage Authorization header manually
    }

    // Set auth token - DEPRECATED: Token is now in HttpOnly cookie
    // Kept for backward compatibility during migration
    setAuthToken(token) {
        // No-op: Token is now handled via HttpOnly cookie
        // The browser sends the cookie automatically with credentials: 'include'
        console.debug('[ApiService] setAuthToken called but token is now in HttpOnly cookie');
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
            // First, try to parse the response to get the actual error message
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: 'Unauthenticated.' };
            }

            // Check if this is a login-related error (has error_type from backend)
            // These should NOT trigger token refresh - they are authentication failures
            if (data.error_type && ['EMAIL_NOT_FOUND', 'INVALID_PASSWORD', 'ACCOUNT_INACTIVE'].includes(data.error_type)) {
                const error = new Error(data.message || 'Authentication failed');
                error.response = {
                    status: response.status,
                    data: data
                };
                throw error;
            }

            // For other 401 errors (token expiration), attempt to refresh token
            const refreshed = await this.attemptRefreshToken();
            if (refreshed) {
                // Retry the original request with new token (cookie is updated automatically)
                return this.retryRequest(originalRequest);
            } else {
                // If refresh fails, only clear stored data if the session is actually stale
                // Don't clear during fresh login setup (token expiration far in future means we just logged in)
                const tokenExpiration = localStorage.getItem('tokenExpiration');
                const timeUntilExpiry = tokenExpiration ? Number(tokenExpiration) - Date.now() : 0;
                const FRESH_LOGIN_THRESHOLD = 5 * 60 * 1000; // 5 minutes

                if (!tokenExpiration || timeUntilExpiry < FRESH_LOGIN_THRESHOLD) {
                    // Session is stale or expired - safe to clear
                    localStorage.removeItem('tokenExpiration');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('permissions');
                } else {
                    // Session was just established - don't clear auth data
                    // This prevents race conditions during login setup
                    console.warn('[ApiService] 401 during fresh session, not clearing auth data');
                }

                const error = new Error(data.message || 'Unauthenticated.');
                error.response = {
                    status: response.status,
                    data: data
                };
                throw error;
            }
        }

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || response.statusText);
            error.response = {
                status: response.status,
                data: data
            };
            
            // Handle 403 Forbidden - Permission denied
            if (response.status === 403) {
                const now = Date.now();
                // Debounce permission error events to prevent toast spam
                if (now - lastPermissionErrorTime > PERMISSION_ERROR_DEBOUNCE) {
                    lastPermissionErrorTime = now;
                    
                    // Extract permission info from response if available
                    const requiredPermissions = data.required_permissions || [];
                    const message = data.message || "You don't have permission to perform this action";
                    
                    console.warn('[ApiService] Permission denied:', message, requiredPermissions);
                    emitPermissionError(message, requiredPermissions);
                }
            }
            
            throw error;
        }
        return data;
    }

    async attemptRefreshToken() {
        try {
            // Call the refresh endpoint - the HttpOnly cookie is sent automatically
            const refreshResponse = await fetch(this.getFullURL('/refresh-token'), {
                method: 'POST',
                headers: this.headers,
                credentials: 'include'
            });
            if (!refreshResponse.ok) {
                return false;
            }
            const refreshData = await refreshResponse.json();

            // Token is now in HttpOnly cookie, no need to store in localStorage
            // Just update the expiration tracking
            if (refreshData.expires_in) {
                const expiration = Date.now() + refreshData.expires_in * 1000;
                localStorage.setItem('tokenExpiration', expiration);
            }

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

    // Get Job Offer Report PDF using POST
    async getJobOfferReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Interview Report PDF using POST
    async getInterviewReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Interview Report Excel using POST
    async getInterviewReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }


    // Get Request with pdf
    async getPdf(endpoint) {
        const fullURL = this.getFullURL(endpoint);
        try {
            const response = await fetch(fullURL, {
                method: 'GET',
                headers: {
                    ...this.headers,
                    'Accept': 'application/pdf'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // GET request
    async get(endpoint, options = {}) {
        const fullURL = this.getFullURL(endpoint);
        try {
            const fetchOptions = {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            };

            const response = await fetch(fullURL, fetchOptions);

            // If responseType is 'blob', return blob directly
            if (options.responseType === 'blob') {
                if (!response.ok) {
                    const error = new Error(`HTTP error! Status: ${response.status}`);
                    error.response = response;
                    throw error;
                }
                return await response.blob();
            }

            // Otherwise, handle as JSON
            return this.handleResponse(response, { endpoint, method: 'GET' });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // POST request
    async post(endpoint, data, config = {}) {
        try {
            // Check if data is FormData
            const isFormData = data instanceof FormData;
            
            // Prepare headers
            let headers = { ...this.headers };
            
            // If FormData, remove Content-Type to let browser set it with boundary
            if (isFormData) {
                delete headers['Content-Type'];
            }
            
            // Merge with custom headers from config if provided
            if (config.headers) {
                // Don't override Content-Type for FormData
                if (isFormData && config.headers['Content-Type']) {
                    delete config.headers['Content-Type'];
                }
                headers = { ...headers, ...config.headers };
            }
            
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: headers,
                body: isFormData ? data : JSON.stringify(data),
                credentials: 'include'
            });
            return this.handleResponse(response, { endpoint, method: 'POST', data });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
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
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // DELETE request
    async delete(endpoint, data = null) {
        try {
            const opts = {
                method: 'DELETE',
                headers: this.headers,
                credentials: 'include'
            };

            // if data passed, stringify it into the body
            if (data !== null) {
                opts.body = JSON.stringify(data);
                // ensure the server sees JSON
                opts.headers = {
                    ...opts.headers,
                    'Content-Type': 'application/json'
                };
            }

            const response = await fetch(this.getFullURL(endpoint), opts);
            // include data in originalRequest so retry logic still works
            return this.handleResponse(response, { endpoint, method: 'DELETE', data });
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
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
                error.message = 'Network Error: Server is not responding';
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
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }


    // Leave Report Methods
    async getLeaveReportPdf(startDate, endDate, workLocation, department, endpoint) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for leave report generation');
            }
            if (!department) {
                throw new Error('Department is required for leave report generation');
            }

            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                work_location: workLocation,
                department: department
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting leave report PDF:', error);
            throw error;
        }
    }

    async getLeaveReportExcel(startDate, endDate, workLocation, department, endpoint) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for leave report generation');
            }
            if (!department) {
                throw new Error('Department is required for leave report generation');
            }

            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                work_location: workLocation,
                department: department
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting leave report Excel:', error);
            throw error;
        }
    }

    async getLeaveReportCsv(startDate, endDate, workLocation, department, endpoint) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for leave report generation');
            }
            if (!department) {
                throw new Error('Department is required for leave report generation');
            }

            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                work_location: workLocation,
                department: department
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'text/csv'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting leave report CSV:', error);
            throw error;
        }
    }

    // Individual Leave Report Methods
    async getIndividualLeaveReportPdf(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                staff_id: staffId
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting individual leave report PDF:', error);
            throw error;
        }
    }

    async getIndividualLeaveReportExcel(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                staff_id: staffId
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting individual leave report Excel:', error);
            throw error;
        }
    }

    async getIndividualLeaveReportCsv(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate,
                staff_id: staffId
            };

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'text/csv'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting individual leave report CSV:', error);
            throw error;
        }
    }

    // Get Employee Personal Data Report PDF using POST
    async getEmployeePersonalDataReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Employee Personal Data Report Excel using POST
    async getEmployeePersonalDataReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            console.error('Error getting employee personal data report Excel:', error);
            throw error;
        }
    }

    // Get Employment Data Report PDF using POST
    async getEmploymentDataReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Employment Data Report Excel using POST
    async getEmploymentDataReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            console.error('Error getting employment data report Excel:', error);
            throw error;
        }
    }

    // Get Total Grant Report PDF using POST
    async getTotalGrantReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Total Grant Report Excel using POST
    async getTotalGrantReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            console.error('Error getting total grant report Excel:', error);
            throw error;
        }
    }

    // Get Training Attendance Report PDF using POST
    async getTrainingAttendanceReportPdf(startDate, endDate, trainingTitle, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (trainingTitle) {
                requestBody.training_title = trainingTitle;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting training attendance report PDF:', error);
            throw error;
        }
    }

    // Get Training Attendance Report Excel using POST
    async getTrainingAttendanceReportExcel(startDate, endDate, trainingTitle, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (trainingTitle) {
                requestBody.training_title = trainingTitle;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting training attendance report Excel:', error);
            throw error;
        }
    }

    // Get Training Attendance Report CSV using POST
    async getTrainingAttendanceReportCsv(startDate, endDate, trainingTitle, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (trainingTitle) {
                requestBody.training_title = trainingTitle;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'text/csv'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting training attendance report CSV:', error);
            throw error;
        }
    }

    // Get Employee Training History Report PDF using POST
    async getEmployeeTrainingHistoryReportPdf(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (staffId) {
                requestBody.staff_id = staffId;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting employee training history report PDF:', error);
            throw error;
        }
    }

    // Get Employee Training History Report Excel using POST
    async getEmployeeTrainingHistoryReportExcel(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (staffId) {
                requestBody.staff_id = staffId;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting employee training history report Excel:', error);
            throw error;
        }
    }

    // Get Employee Training History Report CSV using POST
    async getEmployeeTrainingHistoryReportCsv(startDate, endDate, staffId, endpoint) {
        try {
            // Prepare the request body with required parameters
            const requestBody = {
                start_date: startDate,
                end_date: endDate
            };

            // Add optional parameters if provided
            if (staffId) {
                requestBody.staff_id = staffId;
            }

            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'text/csv'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting employee training history report CSV:', error);
            throw error;
        }
    }

    // Get Payroll Report PDF using POST
    async getPayrollReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Payroll Report Excel using POST
    async getPayrollReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            console.error('Error getting payroll report Excel:', error);
            throw error;
        }
    }

    // Get Travel Report PDF using POST
    async getTravelReportPdf(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            if (!error.response) {
                error.message = 'Network Error: Server is not responding';
            }
            return Promise.reject(error);
        }
    }

    // Get Travel Report Excel using POST
    async getTravelReportExcel(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            // Return the blob directly instead of parsing as JSON
            return await response.blob();
        } catch (error) {
            console.error('Error getting travel report Excel:', error);
            throw error;
        }
    }

    // Get Travel Report CSV using POST
    async getTravelReportCsv(startDate, endDate, endpoint) {
        try {
            const response = await fetch(this.getFullURL(endpoint), {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'text/csv'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.response = response;
                throw error;
            }

            return await response.blob();
        } catch (error) {
            console.error('Error getting travel report CSV:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService();