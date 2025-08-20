function ResultsDisplay({ areaStats, plotUrl, rasterUrl }) {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Analysis Results</h3>
            {areaStats && (
                <div>
                    <h4>Area Statistics by Class:</h4>
                    {areaStats.class_areas && Object.keys(areaStats.class_areas).length > 0 ? (
                        <ul>
                            {Object.entries(areaStats.class_areas).map(([className, area]) => (
                                <li key={className}>
                                    {className}: {area.toFixed(2)} sq. units ({areaStats.class_percentages[className].toFixed(1)}%)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No area statistics available.</p>
                    )}
                </div>
            )}

            {plotUrl && (
                <div>
                    <h4>Classification Plot:</h4>
                    <a href={plotUrl} target="_blank" rel="noopener noreferrer">
                        <img src={plotUrl} alt="Classification Plot" style={{ maxWidth: '100%', height: 'auto' }} />
                    </a>
                    <p><a href={plotUrl} target="_blank" rel="noopener noreferrer">View Full Plot</a></p>
                </div>
            )}

            {rasterUrl && (
                <div>
                    <h4>Download Classified Raster:</h4>
                    <p><a href={rasterUrl} download>Download Classified GeoTIFF</a></p>
                </div>
            )}
        </div>
    );
}

export default ResultsDisplay;