import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialIngredients: React.ForwardRefRenderFunction<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.startTutorial) {
      startTutorial();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const startTutorial = () => {
    IntroJs()
      .setOptions({
        steps: [
          {
            title: "Bem-vindo à página de Ingredientes!",
            intro: "Nesta página ocorrera a gestão dos seus ingredientes.",
          },
          {
            title: "Alterne entre seus ingredientes e sua lista de compras",
            element: "#tabs",
            intro: "Clique aqui para alternar entre as paginas",
          },
          {
            title: "Pesquise seus ingredientes disponíveis",
            element: ".search",
            intro: "Aqui você pode pesquisar os ingredientes que voce tem!",
          },
          {
            title: "Seus ingredientes",
            element: ".IngredientCard",
            intro: "Seus ingredientes apareceram aqui",
          },
          {
            title: "Adicione seus ingredientes",
            element: "#add-button",
            intro: "Clique aqui para adicionar novos ingredientes.",
          },
        ],
        showProgress: true,
        showBullets: false,
        scrollTo: "tooltip",
        exitOnOverlayClick: false,
        disableInteraction: true,
        exitOnEsc: false,
      })
      .start();
  };

  return null;
};

export default forwardRef(TutorialIngredients);
