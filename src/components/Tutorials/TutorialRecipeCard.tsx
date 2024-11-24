import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialRecipeCard: React.ForwardRefRenderFunction<any> = () => {
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
            title: "Bem-vindo à sua receita!",
            intro: "Aqui você pode ver as informações da sua receita.",
          },
          {
            element: ".remove_recipe",
            title: "Excluir Receita",
            intro: "Clique aqui para excluir a receita selecionada.",
          },
          {
            element: ".valor_nutricional",
            title: "Valores Nutricionais",
            intro:
              "Clique aqui para mostrar ou ocultar os valores nutricionais.",
          },
          {
            element: ".add_avaliacao",
            title: "Adicionar Avaliação",
            intro: "Clique aqui para adicionar uma avaliação à receita.",
          },
          {
            element: ".see_avaliacao",
            title: "Ver Avaliações",
            intro: "Clique aqui para ver todas as avaliações da receita.",
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

export default forwardRef(TutorialRecipeCard);
