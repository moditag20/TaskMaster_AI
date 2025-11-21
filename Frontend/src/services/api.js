const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000';

/**
 * Call the supervisor endpoint with content and optional file
 */
export const callSupervisor = async (content, file = null) => {
  const formData = new FormData();
  formData.append('content', content);
  
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(`${API_BASE_URL}/supervisor`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Call the review endpoint for sentiment analysis
 */
export const callReview = async (userInput) => {
  const response = await fetch(`${API_BASE_URL}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_input: userInput }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return await response.json();
};

