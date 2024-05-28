import { MdSpaceDashboard } from "react-icons/md";
import { FiBook, FiBookmark } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

export const SidebarData = [
  {
    name: "Dashboard",
    icon: MdSpaceDashboard,
    link: "/dashboard",
  },
  {
    name: "Ingredientes",
    icon: FiBook,
    link: "/ingredients",
  },
  {
    name: "Minhas Receitas",
    icon: FiBookmark,
    link: "/myRecipes",
  },
  {
    name: "Gerar Receita",
    icon: FaRobot,
    link: "/recipeIa",
  },
  {
    name: "Identificar Receita",
    icon: FiBookmark,
    link: "/IdentifyIA",
  }
];
