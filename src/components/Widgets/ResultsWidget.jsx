import React, { useEffect, useState } from "react";
import GeoMap from "../GeoMap";
import ResultsDisplay from "../ResultsDisplay";
import RasterPreview from "../RasterPreview";

function ResultsTab({ plotsUrl = [], segmentationResult, classificationResult }) {
  // State to manage the currently displayed plot URL
  const [currentPlotUrl, setCurrentPlotUrl] = useState(plotsUrl.length > 0 ? plotsUrl[0] : null);

  // Effect to update the current plot when the plotsUrl prop changes
  useEffect(() => {
    if (plotsUrl && plotsUrl.length > 0) {
      setCurrentPlotUrl(plotsUrl[0]);
    }
  }, [plotsUrl]);
  
  return (
    <div>
      <h2>Results</h2>
      
      {!segmentationResult && !classificationResult && (
        <div style={{ padding: '1rem', backgroundColor: '#fef3c7', color: '#a0522d', borderRadius: '0.375rem' }}>
          <p>Please perform segmentation or classification to view results.</p>
        </div>
      )}

      {plotsUrl && plotsUrl.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Feature Plots</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {plotsUrl.map((url, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log(plotsUrl);
                  setCurrentPlotUrl(url);
                }}
              >
                Plot {index + 1}
              </button>
            ))}
          </div>
          {currentPlotUrl && (
            <div style={{ marginTop: '1rem' }}>
              <RasterPreview imageUrl={currentPlotUrl} alt="Generated Plot" />
            </div>
          )}
        </div>
      )}

      {segmentationResult && !classificationResult && (
        <div>
          <h3>Segmentation Results</h3>
          {/* <GeoMap geojsonData={segmentationResult.segmentation_geojson} /> */}
          {/* <RasterPreview imageUrl={segmentationResult.plot_url} /> */}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#374151' }}>Raw GeoJSON (click to view)</summary>
            <pre style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto', maxHeight: '16rem' }}>
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
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#374151' }}>Raw Classified GeoJSON (click to view)</summary>
            <pre style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto', maxHeight: '16rem' }}>
              {JSON.stringify(classificationResult.classified_geojson, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default ResultsTab;
