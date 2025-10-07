import { useState } from 'react';
import { ChatKitProvider, Thread } from '@openai/chatkit-react';
import './App.css';

const API_URL = 'http://localhost:3000/api/chatkit';

function App() {
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleSubmit = async (message: string, options: any) => {
    if (!threadId) {
      // Create new thread
      const response = await fetch(`${API_URL}/threads/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            content: [{ type: 'input_text', text: message }],
            attachments: [],
            inference_options: options?.inference_options || {},
          },
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.slice(6));
            
            if (event.type === 'thread.created') {
              setThreadId(event.thread.id);
            }
            
            // Handle other events via ChatKit
            options?.onEvent?.(event);
          }
        }
      }
    } else {
      // Add message to existing thread
      const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            content: [{ type: 'input_text', text: message }],
            attachments: [],
            inference_options: options?.inference_options || {},
          },
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.slice(6));
            options?.onEvent?.(event);
          }
        }
      }
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 AI Lesson Generator</h1>
        <p>Create comprehensive lesson plans with AI assistance</p>
      </header>
      
      <main className="app-main">
        <ChatKitProvider>
          <Thread
            threadId={threadId}
            onSubmit={handleSubmit}
            placeholder="Start by describing your lesson (e.g., Subject: Mathematics, Lesson: Introduction to Fractions, Class: 5)"
            emptyStateContent={
              <div className="empty-state">
                <h2>Welcome to AI Lesson Generator!</h2>
                <p>To create a new lesson, provide:</p>
                <ul>
                  <li><strong>Subject:</strong> The subject area (e.g., Mathematics, Science)</li>
                  <li><strong>Lesson:</strong> The lesson title</li>
                  <li><strong>Class:</strong> The class/grade number</li>
                  <li><strong>Domain:</strong> (Optional) Specific domain within the subject</li>
                  <li><strong>Area:</strong> (Optional) Real-life application area</li>
                  <li><strong>Previous lesson:</strong> (Optional) Previous related lesson</li>
                </ul>
                <div className="example-box">
                  <p><strong>Example:</strong></p>
                  <pre>
Subject: Mathematics
Lesson: Introduction to Fractions
Class: 5
Domain: Arithmetic
Area: Daily life measurements
Previous lesson: Basic division
                  </pre>
                </div>
                <p className="instruction">
                  I'll guide you through each step of the lesson plan. You can approve, reject, or request changes at each step!
                </p>
              </div>
            }
          />
        </ChatKitProvider>
      </main>
    </div>
  );
}

export default App;