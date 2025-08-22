import React, { useState } from 'react';
import { importJSONData, sampleJSONStructure } from '../utils/dataImporter';
import './AdminPage.css';

const AdminPage = () => {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [jsonData, setJsonData] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(JSON.stringify(data, null, 2));
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(JSON.stringify(data, null, 2));
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleImport = async () => {
    if (!jsonData.trim()) {
      alert('Please upload a JSON file or paste JSON data');
      return;
    }

    try {
      setImporting(true);
      setResult(null);
      
      const data = JSON.parse(jsonData);
      
      if (!Array.isArray(data)) {
        alert('JSON data must be an array of companies');
        return;
      }

      const importResult = await importJSONData(data);
      setResult(importResult);
      
    } catch (error) {
      alert('Error parsing JSON: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const loadSampleData = () => {
    setJsonData(JSON.stringify(sampleJSONStructure, null, 2));
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>🔧 Admin Panel</h1>
        <p>Import ESG company data into Firebase</p>
      </header>

      <div className="admin-container">
        {/* File Upload Section */}
        <div className="upload-section">
          <h2>📁 Upload JSON Data</h2>
          
          <div 
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="upload-content">
              <p>📄 Drag and drop your JSON file here</p>
              <p>or</p>
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileUpload}
                className="file-input"
              />
              <button onClick={() => document.querySelector('.file-input').click()}>
                Choose File
              </button>
            </div>
          </div>

          <div className="sample-actions">
            <button onClick={loadSampleData} className="sample-btn">
              📋 Load Sample Data
            </button>
          </div>
        </div>

        {/* JSON Editor */}
        <div className="json-editor-section">
          <h2>📝 JSON Data</h2>
          <textarea
            className="json-editor"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste your JSON data here or upload a file..."
            rows={15}
          />
          
          <div className="editor-actions">
            <button 
              onClick={handleImport}
              disabled={importing || !jsonData.trim()}
              className="import-btn"
            >
              {importing ? '⏳ Importing...' : '🚀 Import to Firebase'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <h2>📊 Import Results</h2>
            <div className={`result-summary ${result.success ? 'success' : 'error'}`}>
              {result.success ? (
                <div>
                  <p>✅ <strong>Import Successful!</strong></p>
                  <p>Total: {result.total} companies</p>
                  <p>Successful: {result.successful}</p>
                  <p>Failed: {result.failed}</p>
                </div>
              ) : (
                <div>
                  <p>❌ <strong>Import Failed</strong></p>
                  <p>Error: {result.error}</p>
                </div>
              )}
            </div>

            {result.results && (
              <div className="detailed-results">
                <h3>Detailed Results:</h3>
                <div className="results-list">
                  {result.results.map((res, index) => (
                    <div key={index} className={`result-item ${res.success ? 'success' : 'error'}`}>
                      <span className="status">{res.success ? '✅' : '❌'}</span>
                      <span className="company">{res.company}</span>
                      {res.error && <span className="error-msg">({res.error})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-section">
          <h2>📖 Instructions</h2>
          <div className="instructions">
            <h3>Expected JSON Format:</h3>
            <pre>{`[
  {
    "companyName": "Samsung C&T",
    "overallScore": 85,
    "e_score": 88,
    "s_score": 90,
    "g_score": 80,
    "sapaViolations": 0
  },
  {
    "companyName": "Hyundai E&C",
    "overallScore": 78,
    "e_score": 82,
    "s_score": 75,
    "g_score": 79,
    "sapaViolations": 1
  }
]`}</pre>
            
            <h3>Steps:</h3>
            <ol>
              <li>Prepare your JSON file with the above format</li>
              <li>Upload the file or paste the JSON data</li>
              <li>Click "Import to Firebase" to upload to Firestore</li>
              <li>Check the results to ensure successful import</li>
              <li>Go to the main app to see your data!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;