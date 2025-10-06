// services/userService.js
import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { STORAGE_KEYS } from '@/constants/storageKeys';


class UserService {
  // Get current user profile
  async getCurrentUser() {
    // Try to get user from storage first using STORAGE_KEYS.USER
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedUser) {
      return { data: JSON.parse(storedUser) };
    }

    return await apiService.get(API_ENDPOINTS.AUTH.USER);
  }

  // Update user's name
  async updateUsername(username) {
    try {
      const response = await apiService.post(API_ENDPOINTS.USER.UPDATE_USERNAME, { name: username });
      if (response && response.success) {
        // Update the user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        const updatedUser = { ...currentUser, name: username };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      return response;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }

  // Update user's email
  async updateEmail(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.USER.UPDATE_EMAIL, { email: email });
      if (response && response.success) {
        // Update the user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        const updatedUser = { ...currentUser, email };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      return response;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  // Update user's password
  async updatePassword(passwordData) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await apiService.post(API_ENDPOINTS.USER.UPDATE_PASSWORD, passwordData);

      return { success: true, message: response.message || 'Password updated successfully' };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message || 'Password update failed' };
    }
  }

  /**
   * Update user's profile picture
   * @param {File} imageFile - The profile picture file to upload
   * @returns {Promise} - Upload response
   */
  async updateProfilePicture(imageFile) {
    try {
      // Check if a file was actually provided
      if (!imageFile) {
        throw new Error('No file selected');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('profile_picture', imageFile);

      // Make the API request with FormData
      const response = await apiService.postFormData(API_ENDPOINTS.USER.UPDATE_PROFILE_PICTURE, formData);

      return response;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  }

  // Refetch and update the user in storage
  async refetchAndUpdateUser() {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.USER);

      if (response && response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        return { success: true, data: response.user };
      }

      return { success: false, error: 'Failed to fetch user data' };
    } catch (error) {
      console.error('Error refetching user data:', error);
      return { success: false, error: error.message || 'Failed to update user data' };
    }
  }
}

export const userService = new UserService();