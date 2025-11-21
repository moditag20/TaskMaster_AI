import { useState } from 'react';
import InputForm from './components/InputForm';
import WorkflowVisualizer from './components/WorkflowVisualizer';
import { callSupervisor, callReview } from './services/api';
import './App.css';

function App() {
  const [workflowData, setWorkflowData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('supervisor'); // 'supervisor' or 'review'

  const handleSupervisorSubmit = async (content, file) => {
    setIsLoading(true);
    setError(null);
    setWorkflowData(null);

    try {
      const result = await callSupervisor(content, file);
      setWorkflowData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (content) => {
    setIsLoading(true);
    setError(null);
    setWorkflowData(null);

    try {
      const result = await callReview(content);
      // Transform review response to match workflow format
      setWorkflowData({
        result: {
          messages: [
            { role: 'user', content: content },
            { role: 'assistant', content: result.response, name: 'sentiment_agent' },
          ],
        },
      });
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (content, file) => {
    if (mode === 'supervisor') {
      handleSupervisorSubmit(content, file);
    } else {
      handleReviewSubmit(content);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agentic AI Workflow Visualizer</h1>
        <p>Visualize the complete agent workflow, planning steps, tool calls, and responses</p>
      </header>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'supervisor' ? 'active' : ''}`}
          onClick={() => {
            setMode('supervisor');
            setWorkflowData(null);
            setError(null);
          }}
        >
          🎯 Supervisor Agent
        </button>
        <button
          className={`mode-btn ${mode === 'review' ? 'active' : ''}`}
          onClick={() => {
            setMode('review');
            setWorkflowData(null);
            setError(null);
          }}
        >
          💭 Review & Sentiment
        </button>
      </div>

      <main className="app-main">
        <div className="input-section">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} mode={mode} />
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="visualization-section">
          <WorkflowVisualizer workflowData={workflowData} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;
