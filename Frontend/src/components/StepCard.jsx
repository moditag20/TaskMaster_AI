import AgentBadge from './AgentBadge';
import './StepCard.css';

const StepCard = ({ step, stepNumber, isLast }) => {
  const formatContent = (content) => {
    if (!content) return '';
    // Truncate very long content
    if (content.length > 500) {
      return content.substring(0, 500) + '...';
    }
    return content;
  };

  const formatToolArgs = (args) => {
    try {
      if (typeof args === 'string') {
        return JSON.parse(args);
      }
      return args;
    } catch {
      return args;
    }
  };

  return (
    <div className={`step-card ${isLast ? 'last-step' : ''}`}>
      <div className="step-header">
        <div className="step-number">Step {stepNumber}</div>
        <AgentBadge agentName={step.agent} />
        <div className="step-type">{step.type.replace('_', ' ')}</div>
      </div>

      {step.content && (
        <div className="step-content">
          <div className="content-label">Content:</div>
          <div className="content-text">{formatContent(step.content)}</div>
        </div>
      )}

      {step.assistantResponse && (
        <div className="step-assistant-response">
          <div className="content-label">Assistant Response:</div>
          <div className="content-text">{formatContent(step.assistantResponse)}</div>
        </div>
      )}

      {step.toolCalls && step.toolCalls.length > 0 && (
        <div className="step-tool-calls">
          <div className="content-label">Tool Calls:</div>
          {step.toolCalls.map((toolCall, idx) => (
            <div key={idx} className="tool-call-item">
              <div className="tool-name">
                <span className="tool-icon">🔧</span>
                {toolCall.name || 'Unknown Tool'}
              </div>
              {toolCall.arguments && Object.keys(toolCall.arguments).length > 0 && (
                <div className="tool-args">
                  <pre>{JSON.stringify(formatToolArgs(toolCall.arguments), null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {step.toolResults && step.toolResults.length > 0 && (
        <div className="step-tool-results">
          <div className="content-label">Tool Results:</div>
          {step.toolResults.map((result, idx) => (
            <div key={idx} className="tool-result-item">
              <div className="tool-name">
                <span className="tool-icon">✅</span>
                {result.toolName}
              </div>
              <div className="tool-result-content">
                {formatContent(result.result)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLast && <div className="step-connector"></div>}
    </div>
  );
};

export default StepCard;

