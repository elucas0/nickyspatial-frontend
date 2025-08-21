import { useState, useEffect, useCallback } from "react";
import { getLayerInfo, getLayers } from "../../usecases/LayerManager";
import { calculateFeatures } from "../../usecases/CalculateFeatures";

export default function CalculateFeaturesForm({
  sessionId,
  error,
  setError,
  setLoading,
  loading,
  plotsUrl,
  setPlotsUrl,
}) {
  const [layers, setLayers] = useState([]);
  const [layerListLoading, setLayerListLoading] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("");
  const [bandAttributes, setBandAttributes] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [ndviNirCol, setNdviNirCol] = useState(bandAttributes[3]);
  const [ndviRedCol, setNdviRedCol] = useState(bandAttributes[2]);
  const [ndviOutputName, setNdviOutputName] = useState("NDVI");
  const [message, setMessage] = useState(null);

  const fetchLayers = useCallback(async () => {
    if (!sessionId) return;
    setLayerListLoading(true);
    setError(null);
    try {
      const response = await getLayers(sessionId);
      setLayers(response.layers);
      if (response.layers.length > 0) {
        setSelectedLayer(response.layers[0]);
      }
    } catch (err) {
      setError("Failed to fetch layers. Please try again.");
      console.error(err);
    } finally {
      setLayerListLoading(false);
    }
  }, [sessionId, setError]);

  const fetchLayerAttributes = useCallback(async () => {
    if (!sessionId || !selectedLayer) {
      setBandAttributes([]);
      setNdviNirCol("");
      setNdviRedCol("");
      return;
    }
    try {
      const layerInfo = await getLayerInfo(sessionId, selectedLayer);
      const filteredBandAttributes = layerInfo.attributes.filter(
        (attr) => attr.startsWith("band_") && attr.endsWith("_mean")
      );
      setBandAttributes(filteredBandAttributes);

      // Set initial values based on the available attributes
      const defaultNir = "band_4_mean";
      const defaultRed = "band_3_mean";

      const initialNir = filteredBandAttributes.includes(defaultNir)
        ? defaultNir
        : filteredBandAttributes[0] || "";
      const initialRed = filteredBandAttributes.includes(defaultRed)
        ? defaultRed
        : filteredBandAttributes[1] || filteredBandAttributes[0] || "";

      setNdviNirCol(initialNir);
      setNdviRedCol(initialRed);
    } catch (err) {
      setError(`Failed to fetch attributes for layer: ${selectedLayer}`);
      console.error(err);
    }
  }, [sessionId, selectedLayer, setError]);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  useEffect(() => {
    fetchLayerAttributes();
  }, [selectedLayer, setSelectedLayer, fetchLayerAttributes]);

  const handleFeatureOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFeatureOptions([...featureOptions, value]);
    } else {
      setFeatureOptions(featureOptions.filter((option) => option !== value));
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const data = await calculateFeatures(
        sessionId,
        selectedLayer,
        featureOptions,
        {
          nir_column: ndviNirCol,
          red_column: ndviRedCol,
          ndvi_output: ndviOutputName,
        }
      );
      setMessage({
        type: "success",
        text: "Features calculated successfully!",
      });
      console.log(data.plot_url);
      setPlotsUrl((prev) => [...prev, data.plot_url]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label>Calculate Features</label>
      {layerListLoading && <p>Loading layers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!layerListLoading && layers.length === 0 ? (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
          No segmentation layers available. Run segmentation first.
        </div>
      ) : (
        <div>
          <div className="flex flex-col">
            <p>Select segmentation layer:</p>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
            >
              {layers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>Select features to calculate:</p>
            {["NDVI", "Spectral Indices", "Shape Metrics"].map((option) => (
              <div
                key={option}
                style={{ display: "flex", alignItems: "baseline" }}
              >
                <input
                  type="checkbox"
                  id={option}
                  name="feature-options"
                  value={option}
                  checked={featureOptions.includes(option)}
                  onChange={handleFeatureOptionChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label>{option}</label>
              </div>
            ))}
          </div>

          {featureOptions.includes("NDVI") && (
            <div>
              <p>NDVI Configuration:</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label>NIR column:</label>
                  <select
                    value={ndviNirCol}
                    onChange={(e) => setNdviNirCol(e.target.value)}
                  >
                    {bandAttributes.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>RED column:</label>
                  <select
                    value={ndviRedCol}
                    onChange={(e) => setNdviRedCol(e.target.value)}
                  >
                    {bandAttributes.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p>Output column name:</p>
              <input
                type="text"
                value={ndviOutputName}
                onChange={(e) => setNdviOutputName(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate Selected Features"}
          </button>
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
