import { State } from "../variables"
import Apple from "./Apple";

const Main = ({ changeState, high_score, score }) => {
    return <div class="main">
        <div class="mainScreen">
            <Apple />
            <div>Score :  {score} </div>
            <div>Highest Score : {high_score}</div>
            <button class="start_button" onClick={() => changeState(State.GAME)}> Game Start</button>
        </div>
    </div>
}

export default Main
