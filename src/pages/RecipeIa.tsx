import React, { useState, useEffect } from "react";
import SidebarPage from "../components/SidebarPage";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Card, CardContent, CardActions, Alert } from "@mui/material";
import { useAuth } from "../context/authContext";
import api from "../services/api"

import Swal from "sweetalert2"
import { RecipeInfoDTO } from "../interfaces/RecipeInfoDTO";
import { RecipeIADTO } from "../interfaces/RecipeIADTO";

import RecipeCardTrue from "../components/RecipeCardTrue";

const steps = ['Selecionar configurações', 'Escolher receita', 'Fazer receita'];

const RecipeIa: React.FC = () => {
    const { getToken } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
    const [mealType, setMealType] = useState<string>('');
    const [observation, setObservation] = useState<string>('');
    const [recipeGeneratedIa, setRecipeGeneratedIA] = useState<RecipeIADTO | null>(null);
    const generatedRecipeIa = async () => {
        Swal.fire({
          title: "Aguarde...",
          text: "Gerando receita...",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      
        try {
          const recipeInfo = getData();
          const token = await getToken();
          const response = await api.post<RecipeIADTO>("/api/v1/recipe/generate", recipeInfo, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          console.log(response);
          if (response.data) {
            Swal.close();
            setRecipeGeneratedIA(response.data);
            setActiveStep(1);
          }
        } catch (error) {
          console.error(error);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível gerar a receita. Tente novamente mais tarde.',
          });
        }
      };
      

      const saveRecipe = async () => {
        if (!recipeGeneratedIa) {
          return;
        }
      
        const confirmResult = await Swal.fire({
          title: 'Confirmar',
          text: 'Tem certeza que deseja salvar esta receita?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Cancelar'
        });
      
        if (confirmResult.isConfirmed) {
          Swal.fire({
            title: "Aguarde...",
            text: "Salvando a receita...",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
      
          try {
            const token = await getToken();
            await api.post("/api/v1/user/recipe", recipeGeneratedIa, {
              headers: { Authorization: `Bearer ${token}` },
            });
            clearFields();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Receita salva com sucesso!',
            });
            setActiveStep(0);
          } catch (error) {
            console.error(error);
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Não foi possível salvar a receita. Tente novamente mais tarde.',
            });
          }
        }
      };
      

    const getData = (): RecipeInfoDTO => {
        return {
            type: mealType,
            observation: observation
        };
    };

    const clearFields = () => {
       setObservation('');
       setMealType('');
    };


    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        if(activeStep === 0) {
           await generatedRecipeIa();
        } else if(activeStep === 2) {
            await saveRecipe();
        }
        else {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }
    
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };
    

    // const handleNext = () => {
    //     let newSkipped = skipped;
    //     if (isStepSkipped(activeStep)) {
    //         newSkipped = new Set(newSkipped.values());
    //         newSkipped.delete(activeStep);
    //     }

    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     setSkipped(newSkipped);
    // };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl>
                        <FormLabel id="meal-type-label">Tipo de refeição</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="meal-type-label"
                            name="meal-type"
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                        >
                            <FormControlLabel value="breakfast" control={<Radio />} label="Café da manhã" />
                            <FormControlLabel value="lunch" control={<Radio />} label="Almoço" />
                            <FormControlLabel value="dinner" control={<Radio />} label="Jantar" />
                        </RadioGroup>
                    </FormControl>
                    <Alert severity="warning" className="mt-2">Observação: Caso você tenha alguma intolerância ou não goste de algum ingrediente.</Alert>
                    <TextField
                        id="meal-observation"
                        label="Observações"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        className="w-[35%]"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />
                </Box>
                );
            case 1:
                return (
                    <Box>
                        {recipeGeneratedIa ? (
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Receita Gerada
                                    </Typography>
                                    <RecipeCardTrue recipe={recipeGeneratedIa}></RecipeCardTrue>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => generatedRecipeIa()}>Gerar Novamente</Button>
                                </CardActions>
                            </Card>
                        ) : (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Não foi possível gerar a receita. Por favor, tente novamente mais tarde.
                            </Typography>
                        )}
                    </Box>
                );
            case 2:
                return <>
                {recipeGeneratedIa && ( 
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Receita Final
                            </Typography>
                            <RecipeCardTrue recipe={recipeGeneratedIa}></RecipeCardTrue>
                        </CardContent>
                    </Card>
                )}
            </>
            default:
                return 'Desconhecido';
        }
    };

    return (
        <SidebarPage headerTitle="Geração de Receita">
            <div className="flex justify-center w-full">
                <div className="h-[80vh] w-[75%] flex flex-col pr-[100px] mt-[40px]">
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: { optional?: React.ReactNode } = {};
                                if (isStepOptional(index)) {
                                    labelProps.optional = (
                                        <Typography variant="caption"></Typography>
                                    );
                                }
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    Todas as etapas concluídas - você terminou
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Resetar</Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Box sx={{ mt: 2, mb: 1 }}>
                                    {renderStepContent(activeStep)}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Voltar
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleNext}>
                                        {activeStep === steps.length - 1 ? 'Salvar' : 'Próximo'}
                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </div>
            </div>
        </SidebarPage>
    );
};

export default RecipeIa;
