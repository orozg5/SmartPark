const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const parkingApi = {
  async getSensors() {
    try {
      const response = await fetch(`${API_BASE_URL}/sensors`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sensors:", error);
      throw error;
    }
  },

  async getResourceData(resourceUri: string) {
    try {
      const encodedUri = encodeURIComponent(resourceUri);
      const response = await fetch(`${API_BASE_URL}/resource/${encodedUri}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching resource data:", error);
      throw error;
    }
  },
};
