import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
  const [open, setOpen] = useState(false);

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
      await api.post('/api/v1/topics', newTopic);
      setNewTopic({ title: '', description: '', createdBy: 'Usuário Atual' });
      fetchTopics();
      handleClose();
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Criar Novo Tópico</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, preencha os campos abaixo para criar um novo tópico.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Título do Tópico"
            type="text"
            fullWidth
            value={newTopic.title}
            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newTopic.description}
            onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={createTopic} color="primary" disabled={!newTopic.title || !newTopic.description}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default Forum;