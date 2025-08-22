import { useState } from "react";
import { uploadRasterAndSegment } from "../../usecases/Segment";
import { Button, Slider, TextField } from "@mui/material";

function SegmentationForm({
  loading,
  setSegmentationResult,
  setLoading,
  setError,
  setClassificationResult,
  sessionId,
  plotsUrl,
  setPlotsUrl,
}) {
  const [segmentationLayerName, setSegmentationLayerName] =
    useState("Base_Segmentation");
  const [scale, setScale] = useState(20);
  const [compactness, setCompactness] = useState(0.5);

  /**
   * Handles the segmentation process.
   * @param {object} slicParams The parameters for SLIC segmentation.
   */
  const handleSegmentation = async (slicParams, segmentationLayerName) => {
    if (!sessionId) {
      setError("Please load a raster file first to start a session.");
      return;
    }
    setLoading(true);
    setError(null);
    setSegmentationResult(null);
    setClassificationResult(null);

    try {
      const data = await uploadRasterAndSegment(
        sessionId,
        slicParams,
        segmentationLayerName
      );
      setSegmentationResult(data);
      setPlotsUrl((prev) => [...prev, data.plot_url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSegmentation({ scale, compactness }, segmentationLayerName);
  };

  return (
    <div>
      <div>
        <h3>Image Segmentation</h3>
        <p>Configure segmentation parameters and run the algorithm</p>
      </div>
      <form onSubmit={handleSubmit} className="segmentation-form">
        <TextField
          type="text"
          label="Segmentation Layer Name"
          required
          value={segmentationLayerName}
          color="primary"
          fullWidth
          onChange={(e) => setSegmentationLayerName(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <label style={{ width: "100%" }}>
            Scale (segment size):
            <Slider
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              min={5}
              marks
              max={100}
              step={5}
              valueLabelDisplay="auto"
            />
          </label>
          <label style={{ width: "100%" }}>
            Compactness:
            <Slider
              value={compactness}
              onChange={(e) => setCompactness(parseFloat(e.target.value))}
              step={0.1}
              min={0.1}
              max={5.0}
              marks
              valueLabelDisplay="auto"
            />
          </label>
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? "Loading..." : "Perform Segmentation"}
        </Button>
      </form>
    </div>
  );
}

export default SegmentationForm;
