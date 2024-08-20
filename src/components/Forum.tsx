import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Topic {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

const Forum: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopic, setNewTopic] = useState({ title: '', description: '', createdBy: 'Usuário Atual' });

  const fetchTopics = async () => {
    try {
      const response = await api.get('/api/v1/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const createTopic = async () => {
    try {
      const response = await api.post('/api/v1/topics', newTopic);
      setNewTopic({ title: '', description: '', createdBy: 'Usuário Atual' });
      fetchTopics();
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fórum</h1>
      <div className="mb-4">
        <TextField
          label="Pesquisar Tópicos"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <TextField
          label="Título do Tópico"
          variant="outlined"
          fullWidth
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={newTopic.description}
          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
          className="mt-2"
        />
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={createTopic}
          disabled={!newTopic.title || !newTopic.description} // Ensure title and description are not empty
        >
          Criar Tópico
        </Button>
      </div>
      <List>
        {filteredTopics.map(topic => (
          <React.Fragment key={topic.id}>
            <ListItem component={Link} to={`/discussion/${topic.id}`} button>
              <ListItemText
                primary={topic.title || "Título não disponível"}
                secondary={`${topic.description || "Descrição não disponível"} - Criado por ${topic.createdBy || "Anônimo"} em ${new Date(topic.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default Forum;