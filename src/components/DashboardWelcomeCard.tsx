import { Card } from "@mui/material";
import { GiHand } from "react-icons/gi";
import { UserProps } from "../interfaces/UserProps";
import Button from "./Button";

export default function DashboardWelcomeCard(props: UserProps) {

    return (
        <>
            <Card variant="outlined" className="w-[97.5%] p-8 mt-9">
                <div className="flex items-center mb-0">
                    <h1 className="font-semibold text-5xl text-title">Olá {props.fullName}!</h1>
                    <GiHand className="text-6xl text-title ml-4"/>
                </div>
                <h2 className="text-3xl text-black/50 font-semibold mb-6">Você está no seu Dashboard.</h2>
                <div className="text-title mb-6">
                    <p className="text-3xl font-semibold mb-2">Seus dados atuais são:</p>
                    <ul className="text-3xl">
                        <li>Email: <span className="font-semibold">{props.login}</span></li>
                        <li>Altura: <span className="font-semibold">{props.height}cm</span></li>
                        <li>Peso atual: <span className="font-semibold">{props.height}kg</span></li>
                    </ul>
                </div>
                <Button title="Alterar dados" type="button" width="w-1/4"></Button>
            </Card>
        </>
    )
}