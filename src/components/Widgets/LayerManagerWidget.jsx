import React, { useState, useEffect, useCallback } from "react";
import {
  deleteLayer,
  getLayers,
  getLayerInfo,
} from "../../usecases/LayerManager";
import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

function LayerManagerTab({ sessionId, onLayerDeleted, loading }) {
  const [layers, setLayers] = useState([]);
  const [layerListLoading, setLayerListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openLayer, setOpenLayer] = useState(null);
  const [layerInfo, setLayerInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [infoError, setInfoError] = useState(null);

  // Fetch the list of layers from the API
  const fetchLayers = useCallback(async () => {
    if (!sessionId) return;
    setLayerListLoading(true);
    setError(null);
    try {
      const response = await getLayers(sessionId);
      setLayers(response.layers);
    } catch (err) {
      setError("Failed to fetch layers. Please try again.");
      console.error(err);
    } finally {
      setLayerListLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers, loading]);

  // Fetch detailed info for the currently open layer
  useEffect(() => {
    if (openLayer) {
      setLoadingInfo(true);
      setInfoError(null);
      getLayerInfo(sessionId, openLayer)
        .then((info) => {
          setLayerInfo(info);
        })
        .catch((err) => {
          setInfoError("Failed to get layer info: " + err.message);
          console.error(err);
        })
        .finally(() => {
          setLoadingInfo(false);
        });
    } else {
      setLayerInfo(null); // Clear info when no layer is open
    }
  }, [sessionId, openLayer]); // Trigger on sessionId or openLayer change

  // Toggle the dropdown for a specific layer
  const handleToggleLayer = (layerName) => {
    if (openLayer === layerName) {
      setOpenLayer(null); // Close the currently open layer
    } else {
      setOpenLayer(layerName); // Open a new layer
    }
  };

  const handleDeleteLayer = async (layerName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the layer '${layerName}'?`
      )
    ) {
      try {
        await deleteLayer(sessionId, layerName);
        fetchLayers(); // Refresh the layer list after deletion
        if (onLayerDeleted) {
          onLayerDeleted();
        }
        if (openLayer === layerName) {
          setOpenLayer(null); // Close the dropdown if the deleted layer was open
        }
      } catch (err) {
        alert("Failed to delete layer: " + err.message);
      }
    }
  };

  const handleExport = (layerName) => {
    alert(`Export for layer '${layerName}' is not yet implemented.`);
  };

  if (!sessionId) {
    return (
      <div>
        <h2>Layer Manager</h2>
        <p>Please load a raster file to view layers.</p>
      </div>
    );
  }

  return (
    <div>
      {layerListLoading && <p>Loading layers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!layerListLoading && layers.length === 0 && (
        <p>No layers created yet.</p>
      )}

      <List>
        {layers.map((layerName) => (
          <div key={layerName} style={{ marginBottom: "1rem" }}>
            <ListItemButton
              key={layerName}
              onClick={() => handleToggleLayer(layerName)}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.375rem",
                color: "#374151",
              }}
            >
              <ListItemText primary={layerName} />
              {openLayer === layerName ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openLayer === layerName} timeout="auto" unmountOnExit>
              <div>
                {loadingInfo && <p>Loading info...</p>}
                {infoError && <p style={{ color: "red" }}>{infoError}</p>}
                {layerInfo && (
                  <>
                    <p>
                      <strong>Number of features:</strong>{" "}
                      {layerInfo.num_features}
                    </p>
                    <p>
                      <strong>Attributes:</strong>{" "}
                      {layerInfo.attributes.join(", ") || "None"}
                    </p>
                  </>
                )}
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                >
                  <Button onClick={() => handleExport(layerName)} variant="contained">
                    Export Options
                  </Button>
                  <Button
                    onClick={() => handleDeleteLayer(layerName)}
                    variant="outlined"
                    color="error"
                  >
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );
}

export default LayerManagerTab;
