const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

/**
 * Calls the backend to classify a layer within a given session based on provided rules.
 * @param {string} sessionId - The ID of the current processing session.
 * @param {Object} rulesetData - Object containing classification rules, layer_name, result_field, and base_layer_name.
 * @returns {Promise<Object>} - A promise that resolves to the classification results (GeoJSON, area stats, plot_url, raster_url).
 */
export const classifyLayer = async (sessionId, rulesetData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/process/classify/${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleset_data: rulesetData, // Send the rulesetData directly
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to perform classification");
    }

    // Expected: { message: ..., classified_geojson: ..., area_statistics: ..., plot_url: ..., raster_url: ... }
    return await response.json();
  } catch (error) {
    console.error("Error during classification:", error);
    throw error;
  }
};
