const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

export const calculateFeatures = async (
    sessionId,
    selectedLayer,
    featureOptions,
    ndviParams
) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/features/calculate/${sessionId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    segmentation_layer_name: selectedLayer,
                    calculate_ndvi: featureOptions.includes("NDVI"),
                    ndvi_params: featureOptions.includes("NDVI") ? ndviParams : null,
                    calculate_spectral_indices: featureOptions.includes("Spectral Indices"),
                    calculate_shape_metrics: featureOptions.includes("Shape Metrics"),
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to calculate features.");
        }

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
