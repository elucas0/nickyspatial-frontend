import React, { useState } from "react";
import SegmentationForm from "../ProcessesForms/SegmentationForm";
import ClassificationForm from "../ProcessesForms/ClassificationForm";
import CalculateFeaturesForm from "../ProcessesForms/CalculateFeaturesForm";

const operation_list = [
  "",
  "Segmentation",
  "Rule-based Classification",
  "Add features",
  "Create Rule",
  "Supervised Classification (ML)",
  "Supervised Classification (DL)",
  "Merge Region",
  "Find Enclosed by Class",
  "Touched_by",
];

/**
 * The main tab for processing raster data.
 */
function ProcessTab({
  selectedFile,
  sessionId,
  segmentationResult,
  setSegmentationResult,
  setLoading,
  setError,
  loading,
  error,
  classificationResult,
  setClassificationResult,
  onFileSelect,
  onRasterLoad,
  onClearSession,
  onSegment,
  onClassify,
  refreshLayers,
  setRefreshLayers,
  plotsUrl,
  setPlotsUrl
}) {
  // State to manage the dynamic list of processes
  const [processes, setProcesses] = useState([]);

  /**
   * Adds a new process to the list.
   */
  const handleAddProcess = () => {
    const newId =
      processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1;
    setProcesses([
      ...processes.map((p) => ({ ...p, isExpanded: false })), // Collapse all others
      { id: newId, type: "", isExpanded: true }, // Add a new, expanded process
    ]);
  };

  /**
   * Removes a process from the list.
   * @param {number} id The ID of the process to delete.
   */
  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter((process) => process.id !== id));
  };

  /**
   * Handles the change of the operation type for a specific process.
   * @param {number} id The ID of the process to update.
   * @param {string} newType The new operation type.
   */
  const handleOperationChange = (id, newType) => {
    setProcesses(
      processes.map((process) =>
        process.id === id ? { ...process, type: newType } : process
      )
    );
  };

  /**
   * Toggles the expanded state of a process.
   * @param {number} id The ID of the process to toggle.
   */
  const toggleExpander = (id) => {
    setProcesses(
      processes.map((process) =>
        process.id === id
          ? { ...process, isExpanded: !process.isExpanded }
          : { ...process, isExpanded: false }
      )
    );
  };

  return (
    <div>
      {processes.length === 0 && (
        <div>
          <h2>Processing</h2>
          <p>Select a process to apply to the raster data.</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Dynamic process list section */}
      <div className="section">
        <button
          onClick={handleAddProcess}
          style={{ marginBottom: "20px", position: "sticky", top: "5px" }}
          disabled={loading || !selectedFile || !sessionId}
        >
          + Add process
        </button>

        {processes.map((process, index) => (
          <div key={process.id} className="process-container">
            <div
              className="dropdown-header"
              onClick={() => toggleExpander(process.id)}
            >
              <h3 style={{ margin: 0, cursor: "pointer" }}>
                Process {index + 1}: {process.type || "Select Operation"}
              </h3>
              <span style={{ cursor: "pointer" }}>
                {process.isExpanded ? "▲" : "▼"}
              </span>
            </div>

            {process.isExpanded && (
              <div className="dropdown-content">
                <div className="form-group">
                  <label>Select Operation:</label>
                  <select
                    value={process.type}
                    onChange={(e) =>
                      handleOperationChange(process.id, e.target.value)
                    }
                    style={{ width: "100%", padding: "8px" }}
                  >
                    {operation_list.map((op, i) => (
                      <option key={i} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>

                {process.type === "Segmentation" && (
                  <SegmentationForm
                    loading={loading}
                    setSegmentationResult={setSegmentationResult}
                    setLoading={setLoading}
                    setError={setError}
                    setClassificationResult={setClassificationResult}
                    sessionId={sessionId}
                    refreshLayers={refreshLayers}
                    setRefreshLayers={setRefreshLayers}
                    plotsUrl={plotsUrl}
                    setPlotsUrl={setPlotsUrl}
                  />
                )}

                {process.type === "Rule-based Classification" && (
                  <ClassificationForm
                    sessionId={sessionId}
                    segmentationResult={segmentationResult}
                    setError={setError}
                    setLoading={setLoading}
                    setClassificationResult={setClassificationResult}
                    loading={loading}
                    refreshLayers={refreshLayers}
                    setRefreshLayers={setRefreshLayers}
                  />
                )}

                {process.type === "Add features" && (
                  <CalculateFeaturesForm
                    sessionId={sessionId}
                    setError={setError}
                    setLoading={setLoading}
                    loading={loading}
                    plotsUrl={plotsUrl}
                    setPlotsUrl={setPlotsUrl}
                  />
                )}

                <button
                  onClick={() => handleDeleteProcess(process.id)}
                  className="secondary"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessTab;
