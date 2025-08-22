import { useRef, useState } from "react";
import { clearSession } from "./usecases/ClearSession";

import "./App.css";
import ProcessTab from "./components/Widgets/ProcessWidget";
import LayerManagerTab from "./components/Widgets/LayerManagerWidget";
import ResultsTab from "./components/Widgets/ResultsWidget";
import FileUploader from "./components/FileUploader";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [segmentationResult, setSegmentationResult] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [refreshLayers, setRefreshLayers] = useState(0);
  const [plotsUrl, setPlotsUrl] = useState([]);

  /**
   * Handles the file selection from the user's computer or a sample data load.
   * @param {File | null} file The file object selected by the user, or null for sample data.
   * @param {string} newSessionId The new session ID returned from the API.
   */
  const handleRasterLoad = (file, newSessionId) => {
    setSelectedFile(file);
    setSessionId(newSessionId);
    setLoading(false);
    setError(null);
    setSegmentationResult(null);
    setClassificationResult(null);
  };

  /**
   * Clears the current session by calling the backend API.
   */
  const handleClearSession = async () => {
    if (sessionId) {
      setLoading(true);
      setError(null);
      try {
        await clearSession(sessionId);
        setSessionId(null);
        setSelectedFile(null);
        setSegmentationResult(null);
        setClassificationResult(null);
        console.log("Session cleared successfully!");
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const childRef = useRef();

  // The FAB's click handler calls a method on the child component
  const handleFabClick = () => {
    if (childRef.current) {
      childRef.current.handleAddProcess();
    }
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: "0px", color: "#fff" }}>
        NickySpatial + React
      </h1>
      <FileUploader
        handleRasterLoad={handleRasterLoad}
        setLoading={setLoading}
        setError={setError}
        selectedFile={selectedFile}
        sessionId={sessionId}
        onClearSession={handleClearSession}
        loading={loading}
      />

      <div className="window-content">
        <section style={{ width: "65%" }}>
          <ResultsTab
            plotsUrl={plotsUrl}
            segmentationResult={segmentationResult}
            classificationResult={classificationResult}
          />
        </section>
        <div style={{ display: "flex", flexDirection: "column", width: "35%" }}>
          <section
            style={{
              position: "relative",
              height: "50%",
              overflowY: "auto",
            }}
          >
            <ProcessTab
              selectedFile={selectedFile}
              sessionId={sessionId}
              segmentationResult={segmentationResult}
              setSegmentationResult={setSegmentationResult}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
              error={error}
              classificationResult={classificationResult}
              setClassificationResult={setClassificationResult}
              onClearSession={handleClearSession}
              refreshLayers={refreshLayers}
              setRefreshLayers={setRefreshLayers}
              plotsUrl={plotsUrl}
              setPlotsUrl={setPlotsUrl}
              ref={childRef}
            />
            <Fab
              color="primary"
              aria-label="add"
              onClick={handleFabClick}
              disabled={loading || !selectedFile || !sessionId}
              style={{
                position: "sticky",
                top: "85%",
                left: "85%",
              }}
            >
              <Add />
            </Fab>
          </section>
          <section style={{ height: "50%", overflowY: "auto" }}>
            <LayerManagerTab sessionId={sessionId} loading={loading} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
