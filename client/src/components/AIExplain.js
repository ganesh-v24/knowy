import { useState } from 'react';
import { askAI } from '../api';
import './AIExplain.css'; // Create this CSS file

export default function AIExplain() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const res = await askAI(question); // ✅ Only send the question text
      setAnswer(res.data.answer);
    } catch (error) {
      setAnswer("Sorry, I couldn't process your question. Please try again.");
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  const formatAnswer = (text) => {
    return text.split('\n').map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
    ));
  };

  return (
    <div className="ai-explain-container">
      <h2 className="ai-title">Ask AI Assistant</h2>

      <div className="ai-input-group">
        <input
          className="ai-question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a deep question like 'Explain OOP'..."
          disabled={isLoading}
        />
        <button
          className="ai-ask-button"
          onClick={handleAsk}
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {answer && (
        <div className="ai-answer-container">
          <h3 className="ai-answer-title">Answer:</h3>
          <div className="ai-answer-content">
            {formatAnswer(answer)}
          </div>
        </div>
      )}
    </div>
  );
}
