import { useState } from 'react';
import './InputForm.css';

const InputForm = ({ onSubmit, isLoading, mode = 'supervisor' }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !file) {
      alert('Please enter content or upload a file');
      return;
    }
    onSubmit(content, file);
  };

  const handleClear = () => {
    setContent('');
    setFile(null);
    setFileName('');
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{mode === 'supervisor' ? 'Agentic AI Assistant' : 'Review & Sentiment Analysis'}</h2>
      </div>

      <div className="form-content">
        <div className="input-group">
          <label htmlFor="content">
            {mode === 'supervisor' ? 'Enter your request:' : 'Enter your review:'}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              mode === 'supervisor'
                ? 'e.g., "Summarize this PDF and email it to user@example.com" or "Get latest news about AI"'
                : 'Enter your feedback or review...'
            }
            rows={4}
            disabled={isLoading}
          />
        </div>

        {mode === 'supervisor' && (
          <div className="input-group">
            <label htmlFor="file">Upload File (Optional):</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".pdf,.mp3,.wav,.m4a"
                disabled={isLoading}
              />
              {fileName && (
                <div className="file-name-display">
                  <span>📎 {fileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                      document.getElementById('file').value = '';
                    }}
                    className="remove-file-btn"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <small>Supported: PDF, Audio files (MP3, WAV, M4A)</small>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || (!content.trim() && !file)}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="clear-btn"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputForm;

