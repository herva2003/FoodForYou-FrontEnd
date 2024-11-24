import React, { useEffect, forwardRef } from "react";
import IntroJs from "intro.js";
import "intro.js/introjs.css";
import { useNavigate, useLocation } from "react-router-dom";

const TutorialDashboard: React.ForwardRefRenderFunction<any> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.startTutorial) {
      startTutorial();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const startTutorial = () => {
    if (location.state.tutorialType === "TutorialDashboard") {
    console.log("Starting TutorialDashboard");
    } else {
      IntroJs().setOptions({
        steps: [
          { title: "Bem-vindo ao Food For You!", intro: "Vamos começar o tutorial." },
          { title: "Suas informações", element: "#dashboardWelcomeCard", intro: "Aqui você pode ver e alterar suas informações." },
          { title: "Gráficos", element: "#charts", intro: "Aqui você pode encontrar alguns gráficos nutricionais." },
          { title: "Gráficos mais detalhados", element: ".chart-button", intro: "Clique em um gráfico para vê-lo em tamanho maior." },
          { title: "Baixar PDF", element: ".pdf-button", intro: "Clique aqui para baixar um PDF com os valores nutricionais consumidos." },
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
    }
  };
  
  return null;
};

export default forwardRef(TutorialDashboard);
