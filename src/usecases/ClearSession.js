const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

/**
 * Calls the backend to clear all data associated with a specific session.
 * @param {string} sessionId - The ID of the session to clear.
 * @returns {Promise<Object>} - A promise that resolves when the session is cleared.
 */
export const clearSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/clear/${sessionId}`, {
      method: "POST", // Use POST for state-changing operations
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to clear session");
    }
    return await response.json(); // Expected: { message: ... }
  } catch (error) {
    console.error("Error clearing session:", error);
    throw error;
  }
};
