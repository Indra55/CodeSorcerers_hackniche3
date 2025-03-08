import { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true, // Important for session management
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
});

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m Optimus, your AI shopping assistant. I can help you find products, compare prices, and make recommendations. How can I assist you today?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat history
  const clearHistory = async () => {
    try {
      await api.post('/clear-history');
      setMessages([{ 
        type: 'bot', 
        text: 'Hello! I\'m Optimus, your AI shopping assistant. I can help you find products, compare prices, and make recommendations. How can I assist you today?' 
      }]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    
    // Show loading state
    setIsLoading(true);

    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('msg', userMessage);

      // Call the chatbot API
      const response = await api.post('/get', formData);

      // Add bot response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: response.data || 'Sorry, I could not process your request.'
      }]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to the server. Please check if the server is running.';
      } else if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        errorMessage = 'The server returned an error. Please try again.';
      } else if (error.request) {
        errorMessage = 'No response from the server. Please check your connection.';
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 z-50 backdrop-blur-sm"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full h-4 sm:h-5 w-4 sm:w-5 flex items-center justify-center shadow-lg"
        >
          1
        </motion.span>
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:w-[400px] md:w-[450px] h-[85vh] sm:h-auto max-h-[600px] bg-white/95 backdrop-blur-xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 p-3 sm:p-4 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDEwMCBIIDAgTCAwIDAgTCA1NiAwIEwgNTYgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/20">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Optimus</h3>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium">AI Shopping Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearHistory}
                    className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-white/20"
                  >
                    Clear Chat
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-xl">
              {messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center mr-2 shadow-lg">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 text-sm sm:text-base ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-br-none shadow-lg shadow-blue-500/25'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-lg shadow-gray-100/50 rounded-bl-none border border-white/50'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center mr-2 shadow-lg">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg shadow-gray-100/50 rounded-bl-none border border-white/50">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-100/20 p-3 sm:p-4 bg-white/80 backdrop-blur-xl shrink-0">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Optimus about products..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-50/50 border border-gray-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-gray-600 text-sm sm:text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-2 sm:p-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 