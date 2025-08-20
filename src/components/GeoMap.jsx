import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This fix is crucial for Leaflet icons to work correctly
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: icon,
    shadowUrl: iconShadow
});

/**
 * A helper component that uses the useMap hook to programmatically zoom the map
 * to fit the bounds of the GeoJSON data.
 * @param {object} geojsonData The GeoJSON object to fit the map to.
 */
function MapZoomToGeoJSON({ geojsonData }) {
    const map = useMap();

    useEffect(() => {
        if (geojsonData) {
            // Create a temporary GeoJSON layer to calculate the bounds
            const geoJsonLayer = L.geoJSON(geojsonData);
            const bounds = geoJsonLayer.getBounds();

            if (bounds.isValid()) {
                // Fly to the new bounds with some padding
                map.flyToBounds(bounds, { padding: L.point(10, 10) });
            }
        }
    }, [map, geojsonData]);

    return null; // This component doesn't render anything, it just handles the map logic
}


/**
 * A component to display GeoJSON data on a Leaflet map.
 * @param {object} props The component props.
 * @param {object} props.geojsonData The GeoJSON object to display on the map.
 */
function GeoMap({ geojsonData }) {
    // If no data is available, show a placeholder message
    if (!geojsonData) {
        return <p>Upload an image and perform segmentation to see results on map.</p>;
    }

    // Function to set GeoJSON style based on properties (e.g., classification)
    const geoJsonStyle = (feature) => {
        // You can use a more sophisticated color mapping here
        const colorMap = {
            'Vegetation': 'green',
            'Water': 'blue',
            'Urban': 'grey',
            'Bare Earth': 'brown',
            'Other': 'red', // Fallback for unclassified areas
        };
        const defaultColor = '#3388ff'; // Leaflet's default blue

        const classification = feature.properties.classification || feature.properties.class;

        return {
            color: 'black',
            weight: 1,
            opacity: 0.7,
            fillColor: colorMap[classification] || defaultColor,
            fillOpacity: 0.5
        };
    };

    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%', marginTop: '20px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* The new helper component that handles the zooming */}
            <MapZoomToGeoJSON geojsonData={geojsonData} />

            {/* The GeoJSON layer itself */}
            {geojsonData && (
                <GeoJSON
                    key={JSON.stringify(geojsonData)} // Force re-render when data changes
                    data={geojsonData}
                    style={geoJsonStyle}
                    onEachFeature={(feature, layer) => {
                        if (feature.properties) {
                            let popupContent = ``;
                            for (const key in feature.properties) {
                                popupContent += `<b>${key}:</b> ${feature.properties[key]}<br/>`;
                            }
                            layer.bindPopup(popupContent);
                        }
                    }}
                />
            )}
        </MapContainer>
    );
}

export default GeoMap;
