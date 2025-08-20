const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

/**
 * Calls the backend to load a raster file and establish a new session.
 * @param {File} file - The raster file to upload.
 * @returns {Promise<Object>} - A promise that resolves to the API response, containing the session_id.
 */
export const loadRaster = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/load/raster`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to load raster");
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading raster:", error);
    throw error;
  }
};