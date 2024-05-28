import React, { useState } from "react";
import SidebarPage from "../components/SidebarPage";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";

const steps = ['Selecionar configurações', 'Escolher receita', 'Fazer receita'];

const RecipeIa: React.FC = () => {
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

    return (
        <SidebarPage headerTitle="Geração de Receita">
            <div className="flex flex-col w-full">
                <div className="h-[80vh] flex flex-col w-full pr-[100px] mt-[40px]">
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
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
                                <br/>
                                <br/>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Tipo de refeição</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="breakfast" control={<Radio />} label="Café da manhã" />
                                        <FormControlLabel value="lunch" control={<Radio />} label="Almoço" />
                                        <FormControlLabel value="dinner" control={<Radio />} label="Jantar" />
                                    </RadioGroup>
                                </FormControl>
                                    <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{ mt: 2 }} />
                                    <Typography sx={{ mt: 2, mb: 1 }}>Etapa {activeStep + 1}</Typography>
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
