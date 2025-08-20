import React from "react";
import GeoMap from "../GeoMap";
import ResultsDisplay from "../ResultsDisplay";
import RasterPreview from "../RasterPreview";

function ResultsTab({ segmentationResult, classificationResult }) {
  return (
    <div>
      {!segmentationResult && !classificationResult && (
        <div>
          <h2>Results</h2>
          <p>Please perform segmentation and classification to view results.</p>
        </div>
      )}
      {segmentationResult && !classificationResult && (
        <div>
          {/* <GeoMap geojsonData={segmentationResult.segmentation_geojson} /> */}
          <RasterPreview imageUrl={segmentationResult.plot_url} />
          <details>
            <summary>Raw GeoJSON (click to view)</summary>
            <pre>{JSON.stringify(segmentationResult, null, 2)}</pre>
          </details>
        </div>
      )}

      {classificationResult && (
        <div className="section">
          <GeoMap geojsonData={classificationResult.classified_geojson} />
          <ResultsDisplay
            areaStats={classificationResult.area_statistics}
            plotUrl={classificationResult.plot_url}
            rasterUrl={classificationResult.raster_url}
          />
          <details>
            <summary>Raw Classified GeoJSON (click to view)</summary>
            <pre>
              {JSON.stringify(classificationResult.classified_geojson, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default ResultsTab;
