import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import { UserProps } from "../interfaces/UserProps";
import SearchBar from "../components/SearchBar";
import { TopicProps } from "../interfaces/TopicProps";

interface Topic {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface TopicDTO {
  title: string;
  description: string;
  createdBy: string;
}

const Forum: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<UserProps | null>(null);
  const [open, setOpen] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<TopicProps[]>([]);

  const { getToken } = useAuth();

  const fetchTopics = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/v1/topics/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");
      const userDataFromApi: UserProps = response.data;
      setCreatedBy(userDataFromApi);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const createTopic = async () => {
    try {
      const token = await getToken();
      const data = {
        title,
        description,
        createdBy: createdBy?.fullName,
      } as TopicDTO;

      const response = await api.post("/api/v1/topics/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(data);
      console.log(response);

      if (response) {
        setTitle("");
        setDescription("");
        setCreatedBy(null);

        await fetchTopics();
        handleClose();
      }
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchUserData();
  }, []);

  useEffect(() => {
    setFilteredTopics(
      topics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, topics]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="h-[100vh] pr-[100px] overflow-y-auto">
      <div id="search" className="mt-6">
        <SearchBar filterText={searchQuery} setFilterText={setSearchQuery} />
      </div>
      <ul>
        {filteredTopics.map((topic) => (
          <React.Fragment key={topic.id}>
            <li className="border-b border-gray-300 relative p-4 hover:bg-gray-100">
              <Link to={`/discussion/${topic.id}`} className="block">
                <h2 className="text-xl font-semibold">
                  {topic.title || "Título não disponível"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {topic.description || "Descrição não disponível"}
                </p>
                <p className="text-gray-500 text-sm absolute top-2 right-4">
                  Criado dia {new Date(topic.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm absolute bottom-2 right-4">
                  Criado por {topic.createdBy || "Anônimo"}
                </p>
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ul>
      {open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Criar Novo Tópico</h2>
            </div>
            <div className="p-4">
              <p className="mb-4">
                Por favor, preencha os campos abaixo para criar um novo tópico.
              </p>
              <input
                type="text"
                placeholder="Título do Tópico"
                className="border border-gray-300 rounded p-2 w-full mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Descrição"
                className="border border-gray-300 rounded p-2 w-full mb-4"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className="bg-gray-500 text-white rounded px-4 py-2 mr-2"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2"
                onClick={createTopic}
                disabled={!title || !description}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="fixed bottom-16 right-16 bg-blue-500 text-white rounded-full p-4 shadow-lg"
        onClick={handleClickOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Forum;
