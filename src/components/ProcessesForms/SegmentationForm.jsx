import { useState } from "react";
import { uploadRasterAndSegment } from "../../usecases/Segment";

function SegmentationForm({
  loading,
  setSegmentationResult,
  setLoading,
  setError,
  setClassificationResult,
  sessionId,
  plotsUrl,
  setPlotsUrl
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
    <>
      <div>
        <h3>Image Segmentation</h3>
        <p>Configure segmentation parameters and run the algorithm</p>
      </div>
      <form onSubmit={handleSubmit} className="segmentation-form">
        <div>
          <label>
            Segmentation Layer Name:
            <input
              type="text"
              value={segmentationLayerName}
              onChange={(e) => setSegmentationLayerName(e.target.value)}
            />
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <label style={{ width: "100%" }}>
            Scale (segment size):
            <input
              type="number"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              min={5}
              max={100}
              step={5}
            />
          </label>
          <label style={{ width: "100%" }}>
            Compactness:
            <input
              type="number"
              value={compactness}
              onChange={(e) => setCompactness(parseFloat(e.target.value))}
              step={0.1}
              min={0.1}
              max={5.0}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Perform Segmentation"}
        </button>
      </form>
    </>
  );
}

export default SegmentationForm;
