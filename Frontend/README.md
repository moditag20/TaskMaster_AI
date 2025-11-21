# Agentic AI Workflow Visualizer - Frontend

A modern React frontend application that visualizes the complete agentic AI workflow, including all planning steps, intermediate actions, tool calls, and final responses.

## Features

- **Complete Workflow Visualization**: See every step of the agent's decision-making process
- **Step-by-Step Display**: Similar to Cursor's step-by-step display in a scrollable container
- **Agent Transitions**: Visual badges showing which agent is handling each step
- **Tool Calls & Results**: Detailed view of all tool invocations and their results
- **Final Response Display**: Clean presentation of the final agent response
- **Dual Mode Support**: 
  - Supervisor Agent mode (multi-agent orchestration)
  - Review & Sentiment mode (single agent)
- **File Upload Support**: Upload PDFs and audio files for processing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (default: http://localhost:9000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create a `.env` file in the Frontend directory:
```env
VITE_API_BASE_URL=http://localhost:9000
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── WorkflowVisualizer.jsx    # Main workflow display component
│   │   ├── StepCard.jsx              # Individual step card component
│   │   ├── AgentBadge.jsx            # Agent name badge component
│   │   ├── InputForm.jsx             # User input form component
│   │   └── *.css                     # Component styles
│   ├── services/
│   │   └── api.js                    # API service layer
│   ├── App.jsx                       # Main application component
│   ├── App.css                       # Application styles
│   └── index.css                     # Global styles
├── package.json
└── README.md
```

## Usage

### Supervisor Agent Mode

1. Select "🎯 Supervisor Agent" mode
2. Enter your request in the text area (e.g., "Summarize this PDF and email it to user@example.com")
3. Optionally upload a PDF or audio file
4. Click "Submit"
5. Watch the workflow visualization as the supervisor orchestrates multiple agents

### Review & Sentiment Mode

1. Select "💭 Review & Sentiment" mode
2. Enter your review or feedback
3. Click "Submit"
4. See the sentiment analysis workflow

## API Integration

The frontend integrates with two backend endpoints:

- `POST /supervisor` - Main supervisor agent endpoint
  - Accepts: `content` (string) and optional `file` (File)
  - Returns: Workflow state with messages array

- `POST /review` - Review and sentiment analysis endpoint
  - Accepts: `{ user_input: string }`
  - Returns: Response with session info

## Component Details

### WorkflowVisualizer

The main component that:
- Parses workflow state from backend
- Extracts steps, tool calls, and agent transitions
- Displays steps in a scrollable container
- Shows final response in a separate section

### StepCard

Displays individual workflow steps with:
- Step number and agent badge
- User input or assistant response
- Tool calls with arguments
- Tool results
- Visual connectors between steps

### AgentBadge

Color-coded badges for different agents:
- Supervisor (🎯)
- PDF Summarizer (📄)
- Audio Summarizer (🎵)
- News Fetcher (📰)
- Emailer (📧)
- Meeting Scheduler (📅)
- Sentiment Agent (💭)

## Styling

The application uses:
- Modern gradient backgrounds
- Card-based layouts
- Smooth animations and transitions
- Responsive breakpoints for mobile devices
- Custom scrollbars for better UX

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be served by any static file server.

## Troubleshooting

### API Connection Issues

- Ensure the backend is running on the configured port
- Check CORS settings in the backend
- Verify the `VITE_API_BASE_URL` in `.env` matches your backend URL

### Workflow Not Displaying

- Check browser console for errors
- Verify the backend response format matches expected structure
- Ensure messages array exists in the response

## License

This project is part of the Agentic AI system.
