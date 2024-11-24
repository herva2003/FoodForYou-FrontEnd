import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialGenerateRecipe: React.ForwardRefRenderFunction<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.startTutorial) {
      startTutorial();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  
  const startTutorial = () => {
    IntroJs().setOptions({
      steps: [
        { title: "Tipo de refeição", element: "#tipeRecipe", intro: "Aqui você selecionar o tipo de receita que voce deseja." },
        { title: "Detalhes da receita", element: "#recipeDetails", intro: "Aqui você pode passar alguma descrição de uma receita desejada." },
        { title: "Finalização da Receita", element: "#makeRecipe", intro: "Aqui gera uma receita." },
        { title: "Escolha a receita", intro: "Após gerar a receita, voce poderá gerar uma receita nova caso desejar ou prosseguir e fazer a receita." },
      ],
      showProgress: true,
      showBullets: false,
      scrollTo: "tooltip",
      scrollToElement: true,
      scrollPadding: 300,
      exitOnOverlayClick: false,
      disableInteraction: true,
      exitOnEsc: false,
    }).start();
  };

  return null;
};

export default forwardRef(TutorialGenerateRecipe);
