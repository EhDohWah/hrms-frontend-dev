// services/userService.js
import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { useAuthStore } from '@/stores/authStore';
import { STORAGE_KEYS } from '@/constants/storageKeys';

class UserService {
  // Get current user profile
  async getCurrentUser() {
    // Try to get user from storage first using STORAGE_KEYS.USER
    const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    
    if (storedUser) {
      return { data: storedUser };
    }
    
    return await apiService.get(API_ENDPOINTS.USER.ME);
  }

  // Update user's name
  async updateName(name) {
    try {
      const response = await apiService.put(API_ENDPOINTS.USER.UPDATE_NAME, { name });  
      return response;
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  }

  // Update user's email
  async updateEmail(email) {
    try {   
      const response = await apiService.put(API_ENDPOINTS.USER.UPDATE_EMAIL, { email });
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
      
      apiService.setAuthToken(`Bearer ${token}`);
      const response = await apiService.put(API_ENDPOINTS.USER.UPDATE_PASSWORD, passwordData);
      
      return { success: true, message: response.message || 'Password updated successfully' };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message || 'Password update failed' };
    }
  }

  // Update user's profile
  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }
      
      apiService.setAuthToken(`Bearer ${token}`);
      const response = await apiService.put(API_ENDPOINTS.USER.UPDATE_PROFILE, userData);
      
      if (response && response.user) {
        // Update only the user data in localStorage using STORAGE_KEYS.USER
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
        const updatedUser = { ...currentUser, ...response.user };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'Update failed' };
    }
  }

  // Update user's profile picture
  async updateProfilePicture(imageFile) {
    try {
      const response = await apiService.post(API_ENDPOINTS.USER.UPDATE_PROFILE_PICTURE, imageFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  }

  // Refetch and update the user in storage
  async refetchAndUpdateUser(userData) {
    try {
      if (userData) {
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        const updatedUser = { ...currentUser, ...userData };
        
        // Update localStorage using STORAGE_KEYS.USER
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        
        return { success: true, data: updatedUser };
      } else {
        const response = await apiService.get(API_ENDPOINTS.USER.GET_PROFILE);
        
        if (response && response.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
          
          const authStore = useAuthStore();
          if (authStore) {
            authStore.user = response.user;
          }
          
          return { success: true, data: response.user };
        }
        
        return { success: false, error: 'Failed to fetch user data' };
      }
    } catch (error) {
      console.error('Error refetching user data:', error);
      return { success: false, error: error.message || 'Failed to update user data' };
    }
  }
}

export const userService = new UserService();