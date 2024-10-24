import React, { useEffect, useState, useRef } from "react";
import SidebarPage from "../components/SidebarPage";
import { useParams, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import { RecipeProps } from "../interfaces/RecipeProps";
import {
  Card,
  CardContent,
  Typography,
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
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Review {
  id: string;
  title: string;
  description: string;
  rating: number;
  createdAt: string;
}

const Reviews: React.FC = () => {
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
  const reviewsRef = useRef<HTMLDivElement>(null);

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

  const calculateAverageRating = (reviews: Review[]) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
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

  const nutritionalValueTranslation: { [key: string]: string } = {
    calcium_mg: "Cálcio",
    saturated_fats_g: "Gorduras Saturadas",
    carb_g: "Carboidratos",
    copper_mcg: "Cobre",
    energy_kcal: "Energia",
    fat_g: "Gordura",
    fiber_g: "Fibra",
    folate_mcg: "Folato",
    iron_mg: "Ferro",
    magnesium_mg: "Magnésio",
    manganese_mg: "Manganês",
    niacin_mg: "Niacina",
    phosphorus_mg: "Fósforo",
    potassium_mg: "Potássio",
    protein_g: "Proteína",
    riboflavin_mg: "Riboflavina",
    selenium_mcg: "Selênio",
    sodium_mg: "Sódio",
    sugar_g: "Açúcar",
    thiamin_mg: "Tiamina",
    vitA_mcg: "Vitamina A",
    vitB12_mcg: "Vitamina B12",
    vitB6_mg: "Vitamina B6",
    vitC_mg: "Vitamina C",
    vitD2_mcg: "Vitamina D2",
    vitE_mg: "Vitamina E",
    zinc_mg: "Zinco",
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
        <Box mb={3}>
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
                  ? ((ratingCounts[stars - 1] / reviews.length) * 100).toFixed(
                      1
                    )
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
              <Typography variant="body2" ml={1}>
                ({reviews.length})
              </Typography>
            </Box>
          </Stack>
        </Box>
        <div ref={reviewsRef} style={{ marginTop: "64px" }}>
          {" "}
          {/* Adiciona espaço superior */}
          {filteredReviews.length === 0 ? (
            <Typography variant="body1">Nenhuma review encontrada.</Typography>
          ) : (
            <>
              <Stack spacing={3}>
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating value={review.rating} readOnly />
                        <Typography variant="h5" component="div" ml={2}>
                          {review.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        {formatDate(review.createdAt)}
                      </Typography>
                      <Typography variant="body2">
                        {review.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              <Box height={150} />
            </>
          )}
        </div>
      </Box>
    </SidebarPage>
  );
};

export default Reviews;
