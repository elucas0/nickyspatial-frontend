const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

/**
 * Calls the backend to perform SLIC segmentation on the raster in a given session.
 * @param {string} sessionId - The ID of the current processing session.
 * @param {Object} slicParams - Object containing scale and compactness for SLIC.
 * @param {string} segmentationLayerName - The name of the segmentation layer to create.
 * @returns {Promise<Object>} - A promise that resolves to the segmentation results (GeoJSON, plot_url).
 */
export const uploadRasterAndSegment = async (
  sessionId,
  slicParams,
  segmentationLayerName
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/process/segmentation/${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending slicParams as JSON body
        },
        body: JSON.stringify({
          slic_params: slicParams,
          segmentation_name: segmentationLayerName,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to perform segmentation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during segmentation:", error);
    throw error;
  }
};