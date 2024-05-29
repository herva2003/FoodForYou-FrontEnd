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

const steps = ['Selecionar configurações', 'Escolher receita', 'Fazer receita'];

const RecipeIa: React.FC = () => {
    const { getToken } = useAuth();
    const [recipeGeneratedIa, setRecipeGeneratedIA] = useState<RecipeIADTO | null>(null);
    const generatedRecipeIa = async (recipeInfo: RecipeInfoDTO) => {
        try {
            const token = await getToken();
            const response = await api.post<RecipeIADTO>("/api/v1/recipe/generate", recipeInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(response);
            if (response.data) {
                setRecipeGeneratedIA(response.data);
                handleNext();
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível gerar a receita. Tente novamente mais tarde.',
            });
        }
    };
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

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
                                <Alert severity="warning">Tipo de refeição: Escolha entre Café da manhã, Almoço ou Jantar.</Alert>
                        <FormControl>
                            <FormLabel id="meal-type-label">Tipo de refeição</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="meal-type-label"
                                name="meal-type"
                            >
                                <FormControlLabel value="breakfast" control={<Radio />} label="Café da manhã" />
                                <FormControlLabel value="lunch" control={<Radio />} label="Almoço" />
                                <FormControlLabel value="dinner" control={<Radio />} label="Jantar" />
                            </RadioGroup>
                        </FormControl>
                        <TextField id="meal-name" label="Observações" variant="outlined" sx={{ mt: 2 }} />
                    </Box>
                );
            case 1:
                return (
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Receita Gerada
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Aqui está a receita gerada para você.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => alert('Gerar novamente')}>Gerar Novamente</Button>
                        </CardActions>
                    </Card>
                );
            case 2:
                return (
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Receita Final
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Aqui está a receita final.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            default:
                return 'Desconhecido';
        }
    };

    return (
        <SidebarPage headerTitle="Geração de Receita">
            <div className="flex flex-col w-full">
                <div className="h-[80vh] flex flex-col w-full pr-[100px] mt-[40px]">
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
                                    {isStepOptional(activeStep) && (
                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                            Pular
                                        </Button>
                                    )}
                                    <Button onClick={handleNext}>
                                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
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
