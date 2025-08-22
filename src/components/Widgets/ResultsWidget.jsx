import React, { useEffect, useState } from "react";
import GeoMap from "../GeoMap";
import ResultsDisplay from "../ResultsDisplay";
import RasterPreview from "../RasterPreview";
import { Alert, Button, Tab, Tabs } from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";

function ResultsTab({
  plotsUrl = [],
  segmentationResult,
  classificationResult,
}) {
  // State to manage the currently displayed plot URL
  const [currentPlotUrl, setCurrentPlotUrl] = useState(
    plotsUrl.length > 0 ? plotsUrl[0] : null
  );

  // Effect to update the current plot when the plotsUrl prop changes
  useEffect(() => {
    if (plotsUrl && plotsUrl.length > 0) {
      setCurrentPlotUrl(plotsUrl[0]);
    }
  }, [plotsUrl]);

  return (
    <div>
      {!segmentationResult && !classificationResult && (
        <>
          <h2>Results</h2>
          <Alert severity="info">
            Please perform segmentation or classification to view results.
          </Alert>
        </>
      )}

      {plotsUrl && plotsUrl.length > 0 && (
        <Tabs onChange={(e, val) => setCurrentPlotUrl(plotsUrl[val])}>
          {plotsUrl.map((url, index) => (
            <Tab
              startIcon={<RemoveRedEye />}
              key={index}
              label={`Plot ${index + 1}`}
            />
          ))}
        </Tabs>
      )}
      {currentPlotUrl && (
        <RasterPreview imageUrl={currentPlotUrl} alt="Generated Plot" />
      )}

      {segmentationResult && !classificationResult && (
        <div>
          <h3>Segmentation Results</h3>
          {/* <GeoMap geojsonData={segmentationResult.segmentation_geojson} /> */}
          {/* <RasterPreview imageUrl={segmentationResult.plot_url} /> */}
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer" }}>
              Raw GeoJSON (click to view)
            </summary>
            <pre
              style={{
                marginTop: "0.5rem",
                padding: "1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                overflow: "auto",
                maxHeight: "16rem",
                border: "1px solid #ccc",
              }}
            >
              {JSON.stringify(segmentationResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {classificationResult && (
        <div>
          <h3>Classification Results</h3>
          <GeoMap geojsonData={classificationResult.classified_geojson} />
          <ResultsDisplay
            areaStats={classificationResult.area_statistics}
            plotUrl={classificationResult.plot_url}
            rasterUrl={classificationResult.raster_url}
          />
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "500" }}>
              Raw Classified GeoJSON (click to view)
            </summary>
            <pre
              style={{
                marginTop: "0.5rem",
                padding: "1rem",
                backgroundColor: "#f3f4f6",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                overflow: "auto",
                maxHeight: "16rem",
              }}
            >
              {JSON.stringify(classificationResult.classified_geojson, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default ResultsTab;
