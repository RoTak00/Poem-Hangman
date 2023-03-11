import {PoemContainer} from "../PoemContainer";
import {useGameContainer} from "./GameContainerHook";
import {DownTimer} from "../DownTimer";
import { GameButton } from "../GameButton";
import {PlayerGuessedWords} from "../PlayerGuessedWords";
import {SmallScreenAlert} from "../SmallScreenAlert";

function GameContainer()
{
    const {poem, poemLoading, allWordsVisible, gameState, userInput, readPoemTimerValue, completePoemTimerValue,
        isStartButtonDisappearing, showStartButton,
        isPlayerInputDisappearing, showPlayerInput,
        showGuessedWords, showSmallScreenAlert,
        isResultsDivCenterDisappearing, isResultsDivCenter,
        calculatePoemStatistics, handleUserInput, handleBeginClick, handlePlayAgain, handleResultsRead, handleGuessedWordClick,
        handleStartButtonAnimationEnd, handlePlayerInputAnimationEnd, handleResultsAnimationEnd} = useGameContainer();

    let gameContent = <></>;

    let startButtonContainer = showStartButton && (
    <div className = {"fixedcontainer__bottom game__startbutton " + (isStartButtonDisappearing === true && "game__startbutton--dissapearing")}
    onAnimationEnd = {handleStartButtonAnimationEnd}>
    <GameButton
    onClick = {handleBeginClick}
    isDisabled = {poemLoading}
    disabledText = "Se încarcă..."
    text = "Începe!" />
    </div>);

    let playerInputContainer = showPlayerInput && (
        <div className = {"fixedcontainer__bottom game__input " + (isPlayerInputDisappearing ? "game__input--dissapearing" : "")}
        onAnimationEnd = {handlePlayerInputAnimationEnd}>
            <PlayerInput onInput = {handleUserInput} value = {userInput} isDisabled = {isPlayerInputDisappearing}/>
        </div>
    );

    let guessedWordsContainer = showGuessedWords && (
        <>
        
        <div className = "fixedcontainer__topright game__guessedwords">
            <h3 className = "game__guessedwords__title">Cuvinte Ghicite</h3>
            <PlayerGuessedWords words = {poem.guessedWords} onClick = {handleGuessedWordClick}/>
        </div></>
    );
    
    switch(gameState)
    {
        case "01_BEFOREBEGIN":
            gameContent = <></>;
            break;

        case "02_READPOEM":
            gameContent = (<DownTimer key = "READPOEMTIMER" initialValue = {readPoemTimerValue}/>);
            break;

        case "03_GAMERUNNING":
            gameContent = (<DownTimer key = "GUESSPOEMTIMER" initialValue = {completePoemTimerValue}/>);
            break;

        case "04_GAMECOMPLETE":
            let [poemWordCount, poemGuessedWordCount, poemPercentageGuessed] = calculatePoemStatistics();
            gameContent = (<>
            
            <div className = {"fixedcontainer__bottom game__playagainbutton"}>
            <GameButton
            onClick = {handlePlayAgain}
            isDisabled = {false}
            disabledText = "Again!"
            text= "Again!"/>
            </div>

                <div className = {(isResultsDivCenter ? "fixedcontainer__center game__results--center " : "fixedcontainer__bottomright game__results--bottomright ") + (isResultsDivCenterDisappearing ? "game__results--disappearing " : "")}
                     onAnimationEnd = {handleResultsAnimationEnd}>
                    <p>Ai ghicit {poemGuessedWordCount} {poemGuessedWordCount === 1 ? "cuvânt" : "cuvinte"} din totalul de {poemWordCount} de cuvinte!<br/>
                    Ai ghicit un procent de {poemPercentageGuessed.toLocaleString('en-US', {maximumFractionDigits:2})}% din cuvinte!</p>

                    {(isResultsDivCenter && 
                    <GameButton
                    onClick = {handleResultsRead}
                    isDisabled = {isResultsDivCenterDisappearing}
                    disabledText = "Ok!"
                    text = "Ok!" /> )}
                </div>
            </>);
            break;
            
        default:
            break;
    }
    if(showSmallScreenAlert)
    {
        return <SmallScreenAlert/>;
    }

    return (<section className = "game ">
        {startButtonContainer}
        <PoemContainer poem = {poem} allWordsVisible = {allWordsVisible}/>
        {playerInputContainer}
        {gameContent}
        {guessedWordsContainer}
    </section>)
}

function PlayerInput({value, onInput, isDisabled})
{
    return <input type = "text" value = {value} onInput = {onInput} placeholder = "Ghicește..." disabled = {isDisabled === true ? true : false}></input>
}



export default GameContainer;