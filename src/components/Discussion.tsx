import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import Sidebar from './Sidebar'; // Importe o componente Sidebar
import api from '../services/api';

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
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/api/v1/topics/${id}`);
      setTopic(response.data);
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/v1/topics/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    try {
      await api.post(`/api/v1/topics/${id}/messages`, { content: newMessage, createdBy: 'Usuário Atual' });
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
    <div className="flex h-screen bg-dark-white">
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
      <div className={`flex-1 p-4 flex flex-col ${sidebarVisible ? 'ml-[300px]' : 'ml-[56px]'}`}>
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
            disabled={!newMessage.trim()} // Desabilita o botão se a mensagem estiver vazia ou apenas com espaços
          >
            Enviar Mensagem
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default Discussion;