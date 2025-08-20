/**
 * Component to display a raster image plot.
 * @param {object} props The component props.
 * @param {string} props.imageUrl The URL of the image to display.
 */
function RasterPreview({ imageUrl }) {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/v1";

  return (
    <div className="image-container">
      <img src={`${API_BASE_URL}${imageUrl}`} alt="" className="image-style" />
    </div>
  );
}

export default RasterPreview;
