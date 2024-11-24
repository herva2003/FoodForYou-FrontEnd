import React, { useEffect, useState } from "react";
import SidebarPage from "../components/SidebarPage";
import { useParams, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import { RecipeProps } from "../interfaces/RecipeProps";
import {
  Card,
  CardContent,
  CircularProgress,
  Box,
  Rating,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  TextField,
  Button,
  Modal,
  Typography,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import nutritionalValueTranslation from "../components/NutritionalValueTranslation";
import Swal from "sweetalert2";
import { FaStar, FaRegStar } from 'react-icons/fa';

interface Review {
  id: string;
  title: string;
  description: string;
  rating: number;
  createdAt: string;
}

interface ReviewProps {
  fetchRecipes: () => void;
}

const Reviews: React.FC<ReviewProps> = ({ fetchRecipes }) => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const location = useLocation();
  const recipeProps: RecipeProps = location.state?.recipeProps;
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [ratingCounts, setRatingCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchReviews();
    }
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/v1/review/recipeId?recipeId=${recipeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setReviews(response.data);
        calculateAverageRating(response.data);
        setFilteredReviews(response.data);
        calculateRatingCounts(response.data);
      }
      console.log("Reviews:", response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    try {
      const token = await getToken();
      console.log(`Adding review with token: ${token}`);

      const response = await api.post(
        `/api/v1/review/?recipeId=${recipeProps.id}`,
        {
          title: newReviewTitle,
          description: newReview,
          rating: rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const result = await Swal.fire({
          title: "Review adicionada",
          text: "Sua review foi adicionada com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
          fetchRecipes();
          fetchReviews();
          setNewReviewTitle("");
          setNewReview("");
          setRating(0);
          setOpenModal(false); // Fechar o modal
        }
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Swal.fire("Erro!", "Houve um erro ao adicionar a review.", "error");
    }
  };

  const calculateAverageRating = (reviews: Review[]) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    console.log("recipeProps:", recipeProps);
    setAverageRating(average);
  };

  const calculateRatingCounts = (reviews: Review[]) => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      counts[review.rating - 1]++;
    });
    setRatingCounts(counts);
  };

  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating);
    if (rating === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === rating));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SidebarPage headerTitle="Avaliações">
      <Box padding={3} height="100vh" overflow="auto">
        <Typography variant="h4" gutterBottom>
          {recipeProps?.name || recipeId}
        </Typography>
        {averageRating !== null && (
          <Box display="flex" alignItems="center" mb={3}>
            <Rating value={averageRating} readOnly precision={0.1} />
            <Typography variant="body2" ml={1}>
              ({averageRating.toFixed(1)} estrelas)
            </Typography>
          </Box>
        )}
        {recipeProps && (
          <Box mb={3}>
            <Typography variant="body1">
              <strong>Tempo de Preparo:</strong> {recipeProps.preparationTime}{" "}
              minutos
            </Typography>
            <Typography variant="body1">
              <strong>Criado em:</strong> {recipeProps.createdAt}
            </Typography>
            <Typography variant="h6" mt={2}>
              <strong>Ingredientes</strong>
            </Typography>
            <ul>
              {recipeProps.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name}: {ingredient.quantity}
                </li>
              ))}
            </ul>
            <Typography variant="h6" mt={2}>
              <strong>Modo de Preparo</strong>
            </Typography>
            <ol>
              {recipeProps.preparationMethod.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            {recipeProps.nutritionalValues && (
              <Box mt={2}>
                <Typography variant="h6">
                  {" "}
                  <strong>Valores Nutricionais</strong>
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader aria-label="nutritional values table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nutrientes</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(recipeProps.nutritionalValues)
                        .filter(([key]) => key !== "id")
                        .map(([key, value], index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {nutritionalValueTranslation[key]}
                            </TableCell>
                            <TableCell align="right">{value}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          mb={3}
          mt={8}
        >
          <Box flex={1} mr={{ md: 3 }} mb={{ xs: 3, md: 0 }}>
            <Typography variant="h6" mb={2}>
              <strong>Avaliações dos usuários ({reviews.length})</strong>
            </Typography>
            <Stack
              spacing={1}
              direction="column"
              alignItems="flex-start"
              width="100%"
            >
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage =
                  reviews.length > 0
                    ? (
                        (ratingCounts[stars - 1] / reviews.length) *
                        100
                      ).toFixed(1)
                    : "0.0";
                return (
                  <Box
                    key={stars}
                    display="flex"
                    alignItems="center"
                    width="100%"
                  >
                    <IconButton
                      color={filterRating === stars ? "primary" : "default"}
                      onClick={() => handleFilterChange(stars)}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" mr={1}>
                          {stars} estrela{stars > 1 ? "s" : ""}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(percentage)}
                          style={{ width: "100px", marginRight: "10px" }}
                        />
                        <Typography variant="body2">{percentage}%</Typography>
                      </Box>
                    </IconButton>
                  </Box>
                );
              })}
              <Box display="flex" alignItems="center" width="100%">
                <IconButton
                  color={filterRating === null ? "primary" : "default"}
                  onClick={() => handleFilterChange(null)}
                >
                  <Typography variant="body2">Todas</Typography>
                </IconButton>
                <Typography variant="body2">({reviews.length})</Typography>
              </Box>
            </Stack>
            <Box mb={3}>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="h6" mt={1}>
                <strong>Avalie este produto</strong>
              </Typography>
              <Typography variant="body1" mt={1} mb={2}>
                Compartilhe seus pensamentos com outros clientes
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                className="bg-green-100 text-white rounded-md px-4 py-2"
              >
                Adicionar Avaliação
              </Button>
            </Box>
          </Box>
          <Box flex={3.5} ml={6} mb={6}>
            <Stack spacing={3}>
              {filteredReviews.map((review) => (
                <Card key={review.id} sx={{ backgroundColor: "#fafafa" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Rating value={review.rating} readOnly />
                      <Typography variant="h6" ml={1}>
                        {review.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                    <Typography variant="body1">
                      {review.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
            <Typography variant="h6" id="modal-modal-title" gutterBottom>
              Adicionar Review
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              label="Título da review"
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
              className="mb-4"
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Escreva seu comentário..."
              multiline
              rows={4}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="mb-4"
            />
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                  }
                >
                  {star <= rating ? <FaStar /> : <FaRegStar />}
                </IconButton>
              ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddReview}
              className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
              Adicionar Review
            </Button>
          </div>
        </div>
      </Modal>
    </SidebarPage>
  );
};

export default Reviews;
