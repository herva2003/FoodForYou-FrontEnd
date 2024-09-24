import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../services/api';
import { useAuth } from "../context/authContext";

interface Message {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
}

const Discussion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { getToken } = useAuth();



  const fetchTopic = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/api/v1/topics/${id}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopic(response.data);
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/api/v1/topics/${id}/messages`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createMessage = async () => {
    try {
      const token = await getToken();
      await api.post(
        `/api/v1/topics/${id}/messages`,
        { content: newMessage, createdBy: 'Usuário Atual' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  useEffect(() => {
    fetchTopic();
    fetchMessages();
  }, [id]);

  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <p className="mb-4">{topic.description}</p>
      <div className="mb-4">
        <TextField
          label="Nova Mensagem"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={createMessage}
        >
          Enviar Mensagem
        </Button>
      </div>
      <List>
        {messages.map(message => (
          <React.Fragment key={message.id}>
            <ListItem>
              <ListItemText
                primary={message.content}
                secondary={`${message.createdBy} em ${new Date(message.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default Discussion;