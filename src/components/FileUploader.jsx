import { loadRaster } from "../usecases/LoadRaster";

function FileUploader({
  handleRasterLoad,
  setLoading,
  setError,
  selectedFile,
  sessionId,
  onClearSession,
  loading,
}) {
  /**
   * Handles the file selection from the user's computer.
   * @param {File} file The file object selected by the user.
   */
  const handleFileSelect = async (file) => {
    setLoading(true);
    try {
      const result = await loadRaster(file);
      handleRasterLoad(file, result.session_id);
      console.log("Raster loaded successfully. Session ID:", result.session_id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFileSelect(event.target.files[0]);
    }
  };

  return (
    <div>
      {selectedFile && sessionId ? (
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <p
            style={{
              border: "1px solid black",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            Selected File: {selectedFile.name}
          </p>
          <p
            style={{
              border: "1px solid black",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            Current Session ID: {sessionId}
          </p>
          <button
            onClick={onClearSession}
            disabled={loading}
            className="secondary"
          >
            Clear Session
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor="raster-upload">Upload Raster Image (.tif):</label>
          <input
            id="raster-upload"
            type="file"
            accept=".tif, .tiff"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}

export default FileUploader;
