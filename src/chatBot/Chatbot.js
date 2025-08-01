import React, { useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // ✅ Get email and role from user object in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const email = storedUser?.email || 'unknown';
      const role = storedUser?.role || 'guest';

      const response = await axios.post('http://localhost:8000/auth/ask_llm', {
        query: input,
        email,
        role,
      });

      const botMsg = { sender: 'bot', text: response.data.answer || 'No reply' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Under Development.' }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#1976d2',
            color: 'white',
            boxShadow: 3,
            '&:hover': { bgcolor: '#1565c0' },
          }}
          onClick={toggleChat}
        >
          <ChatIcon />
        </IconButton>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 320,
            height: 440,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#1e1e1e',
            color: 'white',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#111',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #333',
            }}
          >
            <Typography variant="subtitle1">Ask Assistant</Typography>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.sender === 'user' ? '#1976d2' : '#333',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', color: '#aaa' }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box
            sx={{
              display: 'flex',
              borderTop: '1px solid #333',
              p: 1,
              bgcolor: '#121212',
            }}
          >
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              size="small"
              fullWidth
              sx={{
                input: { color: 'white' },
                bgcolor: '#1e1e1e',
                borderRadius: 1,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <IconButton onClick={handleSend} disabled={loading} sx={{ ml: 1, color: '#90caf9' }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatBot;
