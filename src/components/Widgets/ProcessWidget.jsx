import React, { useImperativeHandle, useState } from "react";
import SegmentationForm from "../ProcessesForms/SegmentationForm";
import ClassificationForm from "../ProcessesForms/ClassificationForm";
import CalculateFeaturesForm from "../ProcessesForms/CalculateFeaturesForm";
import {
  Button,
  Collapse,
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";

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
  setPlotsUrl,
  ref,
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

  useImperativeHandle(ref, () => ({
    handleAddProcess,
  }));

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
      <List>
        {processes.map((process, index) => (
          <div key={process.id} style={{ marginBottom: "1rem" }}>
            <ListItemButton
              key={process.id}
              onClick={() => toggleExpander(process.id)}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.375rem",
                color: "#374151",
              }}
            >
              <ListItemText
                primary={`Process ${index + 1}: ${
                  process.type || "Select Operation"
                }`}
              />
              {process.isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={process.isExpanded} timeout="auto" unmountOnExit>
              <Select
                label="Select Operation"
                value={process.type}
                onChange={(e) =>
                  handleOperationChange(process.id, e.target.value)
                }
                displayEmpty
                fullWidth
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              >
                {operation_list.map((op, i) => (
                  <MenuItem key={i} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
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

              <Button
                onClick={() => handleDeleteProcess(process.id)}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );
}

export default ProcessTab;
