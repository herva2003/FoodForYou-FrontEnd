import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialCommunity: React.ForwardRefRenderFunction<any> = () => {
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
        {
            title: "Bem-vindo à página da comunidade!",
            intro: "Nesta página voce pode encontrar receitas feitas por todos os usuários.",
          },
          {
            title: "Alterne entre a comunidade e o fórum",
            element: "#tabs",
            intro: "Clique aqui para alternar entre as paginas",
          },
          {
            title: "Pesquise receitas de outros usuários",
            element: "#search",
            intro: "Aqui você pode pesquisar as receitas que voce deseja fazer!",
          },
          {
            title: "Receitas da comunidade",
            element: "#recipesCard",
            intro: "As receitas apareceram aqui",
          },
        ],
      showProgress: true,
      showBullets: false,
      scrollPadding: 300,
      exitOnOverlayClick: false,
      disableInteraction: true,
      exitOnEsc: false,
    }).start();
  };

  return null;
};

export default forwardRef(TutorialCommunity);
