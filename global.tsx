import { MdSpaceDashboard } from "react-icons/md";
import { FiBook, FiBookmark } from "react-icons/fi";

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
];
