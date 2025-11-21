import './AgentBadge.css';

const agentConfig = {
  supervisor: { name: 'Supervisor', color: '#6366f1', icon: '🎯' },
  pdf_summarizer_agent: { name: 'PDF Summarizer', color: '#8b5cf6', icon: '📄' },
  audio_summarizer_agent: { name: 'Audio Summarizer', color: '#ec4899', icon: '🎵' },
  news_agent: { name: 'News Fetcher', color: '#10b981', icon: '📰' },
  email_agent: { name: 'Emailer', color: '#f59e0b', icon: '📧' },
  meeting_scheduler_agent: { name: 'Meeting Scheduler', color: '#3b82f6', icon: '📅' },
  sentiment_agent: { name: 'Sentiment Agent', color: '#14b8a6', icon: '💭' },
  user: { name: 'User', color: '#6b7280', icon: '👤' },
};

const AgentBadge = ({ agentName }) => {
  const config = agentConfig[agentName] || {
    name: agentName || 'Unknown',
    color: '#9ca3af',
    icon: '🤖',
  };

  return (
    <div
      className="agent-badge"
      style={{ '--agent-color': config.color }}
    >
      <span className="agent-icon">{config.icon}</span>
      <span className="agent-name">{config.name}</span>
    </div>
  );
};

export default AgentBadge;

