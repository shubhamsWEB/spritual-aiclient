/**
 * Utility to detect user's country based on IP address
 */

interface GeolocationResponse {
  country_code: string;
  country_name: string;
}

/**
 * Detects the user's country based on their IP address
 * @returns {Promise<string>} - ISO country code (e.g., 'IN' for India)
 */
export const detectUserCountry = async (): Promise<string> => {
  try {
    // Using ipapi.co for geolocation (free tier has limits)
    const response = await fetch('https://ipapi.co/json/');
    const data: GeolocationResponse = await response.json();
    return data.country_code;
  } catch (error) {
    console.error('Error detecting country:', error);
    // Default to non-India if detection fails
    return 'US';
  }
};

/**
 * Check if the user is from India
 * @returns {Promise<boolean>} - True if user is from India
 */
export const isUserFromIndia = async (): Promise<boolean> => {
  const countryCode = await detectUserCountry();
  return countryCode === 'IN';
}; 