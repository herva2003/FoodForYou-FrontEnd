import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import SidebarPage from "./SidebarPage";
import api from "../services/api";
import { UserProps } from "../interfaces/UserProps";

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
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<UserProps | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setUserData(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTopic = async () => {
    try {
      const response = await api.get(`/api/v1/topics/${id}`);
      setTopic(response.data);
    } catch (error) {
      console.error("Error fetching topic:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/v1/topics/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const createMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    try {
      await api.post(`/api/v1/topics/${id}/messages`, {
        content: newMessage,
        createdBy: userData!.fullName,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  useEffect(() => {
    fetchTopic();
    fetchMessages();
    fetchUserData();
  }, [id]);

  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarPage headerTitle={topic.title}>
      <Box sx={{ height: '100vh', pr: 12, overflowY: 'auto' }}>
        <Paper elevation={3} sx={{ mb: 4, p: 4, backgroundColor: 'white' }}>
          <Typography variant="body1" color="textPrimary">
            {topic.description}
          </Typography>
        </Paper>
        <Box display="flex" mb={4}>
          <TextField
            label="Nova Mensagem"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createMessage}
            disabled={!newMessage.trim()}
            sx={{ alignSelf: 'flex-start', mt: 4 }}
          >
            Enviar Mensagem
          </Button>
        </Box>
        <List>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem>
                <ListItemText
                  primary={message.content}
                  secondary={`${message.createdBy} em ${new Date(
                    message.createdAt
                  ).toLocaleDateString()}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </SidebarPage>
  );
};

export default Discussion;