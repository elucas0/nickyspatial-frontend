import { useState } from 'react';
import { classifyLayer } from '../../usecases/ClassifyLayer';

function ClassificationForm({ sessionId, segmentationResult, setError, setLoading, setClassificationResult, loading }) {

    /**
   * Handles the classification process.
   * @param {Array} rules The classification rules defined by the user.
   */
  const handleClassification = async (rules) => {
    if (!sessionId || !segmentationResult) {
      setError("Please perform segmentation first.");
      return;
    }
    setLoading(true);
    setError(null);
    setClassificationResult(null);

    const rulesetData = {
      rules: rules,
      layer_name: "Land_Cover_Classification",
      result_field: "classification",
      base_layer_name: "Base_Segmentation",
    };

    try {
      const data = await classifyLayer(sessionId, rulesetData);
      setClassificationResult(data);
      console.log("Classification Plot URL:", data.plot_url);
      console.log("Classification Raster URL:", data.raster_url);
      console.log("Area Statistics:", data.area_statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


    const [rules, setRules] = useState([
        { id: 1, name: 'Vegetation', condition: 'NDVI > 0.2' },
        { id: 2, name: 'Other', condition: 'NDVI <= 0.2' },
    ]);
    const [nextId, setNextId] = useState(3);

    const addRule = () => {
        setRules([...rules, { id: nextId, name: '', condition: '' }]);
        setNextId(nextId + 1);
    };

    const updateRule = (id, field, value) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, [field]: value } : rule
        ));
    };

    const removeRule = (id) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedRules = rules.map(({ id, ...rest }) => rest); // Remove 'id' before sending
        handleClassification(formattedRules);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Define Classification Rules</h3>
            {rules.map(rule => (
                <div key={rule.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <label>
                        Class Name:
                        <input
                            type="text"
                            value={rule.name}
                            onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                        />
                    </label>
                    <label>
                        Condition (e.g., "NDVI {">"} 0.6"):
                        <input
                            type="text"
                            value={rule.condition}
                            onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
                            style={{ width: '300px' }}
                        />
                    </label>
                    <button type="button" onClick={() => removeRule(rule.id)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addRule}>Add Rule</button>
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Apply Classification"}</button>
        </form>
    );
}

export default ClassificationForm;