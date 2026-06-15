import React, { useState, useRef, useEffect } from 'react';
import { FaComment, FaXmark, FaPaperPlane, FaRobot } from 'react-icons/fa6';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am CineBot 🤖. How can I help you today?' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getBotResponse = (text) => {
    const lower = text.toLowerCase();
    
    if (lower.includes('book') || lower.includes('ticket') || lower.includes('buy')) {
      return 'To book a ticket, simply browse movies on the Home or Explore page, click on a movie, and hit "Book tickets". You can then select your theatre, date, time, and seats!';
    }
    if (lower.includes('where') || lower.includes('find') || lower.includes('history') || lower.includes('my bookings')) {
      return 'You can view all your purchased tickets by navigating to your Profile and clicking on "My Bookings". You can even download them as PDFs or add them to your calendar!';
    }
    if (lower.includes('cancel') || lower.includes('refund') || lower.includes('money')) {
      return 'You can cancel any upcoming booking in the "My Bookings" section. Once cancelled, your money will be automatically refunded via the original payment method.';
    }
    if (lower.includes('coin') || lower.includes('loyalty') || lower.includes('discount')) {
      return 'CineCoins are our loyalty rewards! You earn 5% back on every booking. You can use your CineCoins on the payment page for an instant discount on future tickets.';
    }
    if (lower.includes('food') || lower.includes('popcorn') || lower.includes('beverage')) {
      return 'Yes! We offer a variety of Food & Beverage options. You can add popcorn, nachos, and drinks to your order during the booking process.';
    }
    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
      return 'Hello there! Enjoying Book My Show? Let me know if you need help finding a movie or managing your tickets.';
    }

    return "I'm still learning! For complex issues, please reach out to our human support team at support@bookmyshow.com.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <FaRobot />
            </div>
            <div className="chatbot-title">
              <h4>CineBot Support</h4>
              <span>Online</span>
            </div>
            <button className="btn btn-ghost" style={{ padding: 5 }} onClick={() => setIsOpen(false)}>
              <FaXmark size={20} color="#fff" />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble ${m.sender}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              <FaPaperPlane size={18} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <FaComment size={28} />
        </button>
      )}
    </div>
  );
}
