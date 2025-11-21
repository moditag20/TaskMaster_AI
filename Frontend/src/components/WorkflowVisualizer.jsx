import { useState, useEffect, useRef } from 'react';
import StepCard from './StepCard';
import AgentBadge from './AgentBadge';
import './WorkflowVisualizer.css';

/**
 * Parses the workflow state and extracts steps from messages
 */
const parseWorkflowSteps = (result) => {
  if (!result || !result.messages) return [];
  
  const steps = [];
  const messages = result.messages;
  
  let currentStep = null;
  let stepIndex = 0;
  let currentAgent = 'supervisor';

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    // Handle different message formats (dict or object)
    const role = msg.role || msg.get?.('role') || 'unknown';
    const content = msg.content || msg.get?.('content') || '';
    const name = msg.name || msg.get?.('name');
    const toolCalls = msg.tool_calls || msg.tool_calls || [];
    const toolCallId = msg.tool_call_id || msg.tool_call_id;
    
    if (role === 'user') {
      // Start a new step with user input
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        id: stepIndex++,
        type: 'user_input',
        agent: 'user',
        content: content,
        timestamp: new Date(),
        toolCalls: [],
        toolResults: [],
      };
      currentAgent = 'supervisor';
    } else if (role === 'assistant') {
      // Assistant response - could be planning or final response
      if (currentStep) {
        currentStep.assistantResponse = content;
        currentStep.agent = name || currentAgent;
        currentAgent = name || currentAgent;
        
        // Extract tool calls from assistant message
        if (toolCalls && toolCalls.length > 0) {
          toolCalls.forEach(toolCall => {
            let toolName = toolCall.name || toolCall.function?.name || 'unknown_tool';
            let toolArgs = {};
            
            try {
              if (toolCall.function?.arguments) {
                toolArgs = typeof toolCall.function.arguments === 'string' 
                  ? JSON.parse(toolCall.function.arguments)
                  : toolCall.function.arguments;
              }
            } catch (e) {
              toolArgs = { raw: toolCall.function?.arguments || '' };
            }
            
            currentStep.toolCalls.push({
              id: toolCall.id || `tool-${i}`,
              name: toolName,
              arguments: toolArgs,
            });
          });
        }
      } else {
        currentStep = {
          id: stepIndex++,
          type: 'assistant_response',
          agent: name || currentAgent,
          content: content,
          timestamp: new Date(),
          toolCalls: [],
          toolResults: [],
        };
        currentAgent = name || currentAgent;
      }
    } else if (role === 'tool') {
      // Tool call result
      if (currentStep) {
        const toolName = name || 'unknown_tool';
        // Update current agent if it's a transfer tool
        if (toolName.startsWith('transfer_to_')) {
          currentAgent = toolName.replace('transfer_to_', '');
          currentStep.agent = currentAgent;
        }
        
        currentStep.toolResults.push({
          toolName: toolName,
          result: content,
          toolCallId: toolCallId,
        });
      }
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
};

/**
 * Extracts agent transitions from messages
 */
const extractAgentTransitions = (messages) => {
  const transitions = [];
  let currentAgent = 'supervisor';
  
  messages.forEach((msg, index) => {
    if (msg.role === 'tool' && msg.name) {
      const toolName = msg.name;
      // Check if it's a transfer tool
      if (toolName.startsWith('transfer_to_')) {
        const targetAgent = toolName.replace('transfer_to_', '');
        transitions.push({
          from: currentAgent,
          to: targetAgent,
          step: index,
        });
        currentAgent = targetAgent;
      }
    }
  });

  return transitions;
};

const WorkflowVisualizer = ({ workflowData, isLoading }) => {
  const [steps, setSteps] = useState([]);
  const [finalResponse, setFinalResponse] = useState(null);
  const scrollContainerRef = useRef(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (workflowData) {
      try {
        // Handle different response formats
        const state = workflowData.result || workflowData;
        const parsedSteps = parseWorkflowSteps(state);
        setSteps(parsedSteps);
        
        // Extract final response (last assistant message)
        const messages = state?.messages || [];
        const lastAssistantMsg = messages
          .filter(m => {
            const role = m.role || m.get?.('role');
            return role === 'assistant';
          })
          .pop();
        
        if (lastAssistantMsg) {
          const content = lastAssistantMsg.content || lastAssistantMsg.get?.('content') || '';
          setFinalResponse(content);
        } else {
          setFinalResponse(null);
        }
      } catch (error) {
        console.error('Error parsing workflow data:', error);
        setSteps([]);
        setFinalResponse(null);
      }
    } else {
      setSteps([]);
      setFinalResponse(null);
    }
  }, [workflowData]);

  // Auto-scroll to bottom when new steps are added
  useEffect(() => {
    if (scrollContainerRef.current && steps.length > 0) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [steps]);

  // Scroll to response when it appears
  useEffect(() => {
    if (responseRef.current && finalResponse) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [finalResponse]);

  if (isLoading) {
    return (
      <div className="workflow-visualizer loading">
        <div className="loading-spinner"></div>
        <p>Processing your request...</p>
      </div>
    );
  }

  if (!workflowData || steps.length === 0) {
    return (
      <div className="workflow-visualizer empty">
        <p>No workflow data to display. Submit a request to see the agent workflow.</p>
      </div>
    );
  }

  return (
    <div className="workflow-visualizer">
      <div className="workflow-header">
        <h2>Agent Workflow</h2>
        <span className="step-count">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="workflow-steps-container" ref={scrollContainerRef}>
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            stepNumber={index + 1}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {finalResponse && (
        <div className="final-response-container" ref={responseRef}>
          <div className="final-response-header">
            <h3>Final Response</h3>
          </div>
          <div className="final-response-content">
            <div className="response-text">{finalResponse}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowVisualizer;

