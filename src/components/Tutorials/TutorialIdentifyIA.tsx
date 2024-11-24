import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialIdentifyIA: React.ForwardRefRenderFunction<any> = () => {
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
        { title: "Adicione a receita aqui", element: "#addRecipe", intro: "Escreva aqui a receita ou alimento consumido." },
        { title: "Adicione quantidade", intro: "Após passar a receita ou ingredientes, passe a quantidade dos ingredientes e pronto!" },
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

export default forwardRef(TutorialIdentifyIA);
