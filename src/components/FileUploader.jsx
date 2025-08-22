import { Button, Chip } from "@mui/material";
import { loadRaster } from "../usecases/LoadRaster";
import { Delete } from "@mui/icons-material";

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
        <div style={{ display: "flex", flexDirection: "row", gap: "15px", alignItems: "center" }}>
          <Chip
            label={`Selected File: ${selectedFile.name}`}
            color="primary"
          />
          <Chip
            label={`Current Session ID: ${sessionId}`}
            color="primary"
          />
          <Button
            onClick={onClearSession}
            disabled={loading}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Clear Session
          </Button>
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
