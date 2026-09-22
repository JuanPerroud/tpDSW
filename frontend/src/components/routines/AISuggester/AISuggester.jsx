// AISuggester.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './AISuggester.css';

const AISuggester = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! Soy tu preparador físico de IA. Cuéntame qué tipo de rutina necesitas (objetivo, deporte, nivel, días disponibles, etc.) y te armaré algo a medida.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const textToSend = userInput;
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Enviamos el "prompt" al backend 
      const response = await axios.post('http://localhost:3000/api/ai/generate', {
        prompt: textToSend
      });

      setMessages((prev) => [...prev, { role: 'ai', content: response.data.generatedRoutine }]);
    } catch (error) {
      console.error("Error al generar rutina:", error);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Lo siento, hubo un error al procesar tu solicitud.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-suggester-container">
      <div className="ai-header">
        <h3>Asistente IA ✨</h3>
        {onClose && (
          <button type="button" className="close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        )}
      </div>

      <div className="ai-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message ${msg.role}`}>
            <div className="message-bubble">
              {msg.role === 'ai' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message ai">
            <div className="message-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-input-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Ej: Rutina para ganar fuerza..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary send-btn" disabled={isLoading || !userInput.trim()}>
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AISuggester;