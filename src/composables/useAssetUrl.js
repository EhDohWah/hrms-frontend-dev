/**
 * Composable for handling asset URLs in Vite
 * Replaces Webpack's require() for dynamic asset imports
 * 
 * @usage
 * import { useAssetUrl } from '@/composables/useAssetUrl';
 * const { getUserAvatar, getImageUrl } = useAssetUrl();
 * 
 * // For user avatars with automatic fallback
 * const avatarUrl = getUserAvatar(employee.profilePicture);
 * 
 * // For any asset with custom path
 * const imageUrl = getImageUrl('assets/img/icons/logo.png');
 */
export function useAssetUrl() {
  /**
   * Get image URL for any asset
   * @param {string} relativePath - Path relative to src/, e.g., 'assets/img/users/photo.jpg'
   * @param {string} fallback - Fallback path if main image fails
   * @returns {string} Full URL to the image
   */
  const getImageUrl = (relativePath, fallback = 'assets/img/users/user-01.jpg') => {
    try {
      // relativePath should be relative to src/, e.g., 'assets/img/users/photo.jpg'
      return new URL(`../${relativePath}`, import.meta.url).href;
    } catch (error) {
      console.warn(`Failed to load image: ${relativePath}`, error);
      return new URL(`../${fallback}`, import.meta.url).href;
    }
  };

  /**
   * Get user avatar with automatic fallback to default avatar
   * @param {string} imageName - Image filename (e.g., 'user-01.jpg' or 'john-doe.jpg')
   * @param {string} fallback - Fallback filename (default: 'user-01.jpg')
   * @returns {string} Full URL to the avatar
   */
  const getUserAvatar = (imageName, fallback = 'user-01.jpg') => {
    if (!imageName) {
      return getImageUrl(`assets/img/users/${fallback}`);
    }
    return getImageUrl(`assets/img/users/${imageName}`);
  };

  /**
   * Get icon image URL
   * @param {string} iconName - Icon filename
   * @param {string} fallback - Fallback icon filename
   * @returns {string} Full URL to the icon
   */
  const getIconUrl = (iconName, fallback = 'default-icon.png') => {
    if (!iconName) {
      return getImageUrl(`assets/img/icons/${fallback}`);
    }
    return getImageUrl(`assets/img/icons/${iconName}`);
  };

  /**
   * Get report image URL
   * @param {string} imageName - Report image filename
   * @returns {string} Full URL to the report image
   */
  const getReportImageUrl = (imageName) => {
    return getImageUrl(`assets/img/reports/${imageName}`);
  };

  /**
   * Get media image URL
   * @param {string} imageName - Media image filename
   * @returns {string} Full URL to the media image
   */
  const getMediaImageUrl = (imageName) => {
    return getImageUrl(`assets/img/media/${imageName}`);
  };

  /**
   * Get social image URL
   * @param {string} imageName - Social image filename
   * @returns {string} Full URL to the social image
   */
  const getSocialImageUrl = (imageName) => {
    return getImageUrl(`assets/img/social/${imageName}`);
  };

  return {
    getImageUrl,
    getUserAvatar,
    getIconUrl,
    getReportImageUrl,
    getMediaImageUrl,
    getSocialImageUrl
  };
}
