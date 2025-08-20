const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

/**
 * Retrieves the list of available layers for a session.
 * @param {string} sessionId The session identifier.
 * @returns {Promise<object>} An object containing the list of layers.
 */
export const getLayers = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/layers/${sessionId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch layers.");
    }
    return response.json();
  } catch (error) {
    console.error("Error in getLayers:", error);
    throw error;
  }
};

/**
 * Retrieves detailed information about a specific layer.
 * @param {string} sessionId The session identifier.
 * @param {string} layerName The name of the layer.
 * @returns {Promise<object>} An object containing layer details.
 */
export const getLayerInfo = async (sessionId, layerName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/layers/${sessionId}/info/${layerName}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get layer info.");
    }
    return response.json();
  } catch (error) {
    console.error("Error in getLayerInfo:", error);
    throw error;
  }
};

/**
 * Deletes a specified layer from the session.
 * @param {string} sessionId The session identifier.
 * @param {string} layerName The name of the layer to delete.
 * @returns {Promise<object>} A promise that resolves to a success message.
 */
export const deleteLayer = async (sessionId, layerName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/layers/${sessionId}/${layerName}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete layer.");
    }
    return response.json();
  } catch (error) {
    console.error("Error in deleteLayer:", error);
    throw error;
  }
};
