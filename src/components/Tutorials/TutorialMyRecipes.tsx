import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialMyRecipes: React.ForwardRefRenderFunction<any> = ({}, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.startTutorial) {
      startTutorial();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const startTutorial = () => {
    console.log("Starting tutorial");
    IntroJs()
      .setOptions({
        steps: [
          {
            title: "Bem-vindo à página de receitas!",
            intro: "Nesta pagina você pode ver suas receitas e adicionar novas",
          },
          {
            element: ".search",
            title: "Pesquise suas receitas",
            intro: "Aqui você pode pesquisar as receitas que você tem salvas!",
          },
          {
            element: ".RecipeCard",
            title: "Suas receitas",
            intro: "Suas receitas aparecem aqui!",
          },
          {
            element: "#add-button",
            title: "Adicione suas receitas",
            intro: "Clique aqui para adicionar novas receitas.",
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

  const startTutorialAddRecipeHandler = () => {
    console.log("Starting tutorial");
    setTimeout(() => {
      IntroJs()
        .setOptions({
          steps: [
            {
              title: "Vamos adicionar a sua primeira receita!",
              intro: "após preencher todos os campos, clique em salvar",
            },
            {
              element: "#recipe_name",
              title: "Nome da Receita",
              intro: "Insira o nome da sua receita aqui",
            },
            {
              element: "#add_ingredient",
              title: "Adicionar Ingredientes",
              intro: "Adicione os ingredientes necessários para sua receita",
            },
            {
              element: "#calculate_nutritional_values",
              title: "Calcular Valores Nutricionais",
              intro: "Calcule os valores nutricionais da sua receita",
            },
            {
              element: "#preparation_step",
              title: "Passos de Preparo",
              intro: "Adicione os passos de preparo da sua receita",
            },
            {
              element: "#preparation_time",
              title: "Tempo de Preparo",
              intro: "Adicione o tempo de preparo da sua receita",
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
    }, 500);
  };

  useImperativeHandle(ref, () => ({
    startTutorialAddRecipeHandler,
  }));

  return null;
};

export default forwardRef(TutorialMyRecipes);
