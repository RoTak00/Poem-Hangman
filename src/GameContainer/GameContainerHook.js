import {useState, useRef, useEffect} from "react";
import {mapValue} from '../functions';
import {constructPoemLine, markPoemWordOnMatch} from './GameContainerHelper';
import produce from "immer";

const 
READPOEM_MAP_MIN = 20000,
READPOEM_MAP_MAX = 90000,
GUESSPOEM_MAP_MIN = 35000,
GUESSPOEM_MAP_MAX = 120000;

const
POEMWORDS_MAP_MIN = 30,
POEMWORDS_MAP_MAX = 200;

const MIN_SCREEN_WIDTH = 800;

export const useGameContainer = () =>
{
    const [poem, setPoem] = useState(null);
    const [poemLoading, setPoemLoading] = useState(false);
    const poemRef = useRef(null);
    const [gameState, setGameState] = useState("01_BEFOREBEGIN");
    const [userInput, setUserInput] = useState("");
    const [allWordsVisible, setAllWordsVisible] = useState(true);

    const [showSmallScreenAlert, setShowSmallScreenAlert] = useState(false);

    


    const [readPoemTimerValue, setReadPoemTimerValue] = useState(0);
    const [completePoemTimerValue, setCompletePoemTimerValue] = useState(0);

    const [isStartButtonDisappearing, setIsStartButtonDisappearing] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);

    const [isPlayerInputDisappearing, setIsPlayerInputDisappearing] = useState(false);
    const [showPlayerInput, setShowPlayerInput] = useState(false);

    const [showGuessedWords, setShowGuessedWords] = useState(false);

    const [isResultsDivCenterDisappearing, setIsResultsDivCenterDisappearing] = useState(false);
    const [isResultsDivCenter, setIsResultsDivCenter] = useState(true);
    

    function checkScreenSize()
    {
        let screenWidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        setShowSmallScreenAlert(screenWidth < MIN_SCREEN_WIDTH);
        console.log(screenWidth);
    }

    useEffect(checkScreenSize, []);
    useEffect(()=>
    {
        window.addEventListener('resize', checkScreenSize);
    })

   
    
    const calculatePoemReadTime = () =>
    {
        let [poemWordCount] = calculatePoemStatistics();
        let returnValue = Math.floor(mapValue(poemWordCount, POEMWORDS_MAP_MIN, POEMWORDS_MAP_MAX, READPOEM_MAP_MIN, READPOEM_MAP_MAX) / 1000) * 1000;
        if(returnValue < READPOEM_MAP_MIN) returnValue = READPOEM_MAP_MIN;
        if(returnValue > READPOEM_MAP_MAX) returnValue = READPOEM_MAP_MAX;
        //console.log("rt: " + returnValue);
        return returnValue;
    }

    const calculatePoemGuessTime = () =>
    {
        let [poemWordCount] = calculatePoemStatistics();
        let returnValue = Math.floor(mapValue(poemWordCount, POEMWORDS_MAP_MIN, POEMWORDS_MAP_MAX, GUESSPOEM_MAP_MIN, GUESSPOEM_MAP_MAX) / 1000) * 1000;
        if(returnValue < GUESSPOEM_MAP_MIN) returnValue = GUESSPOEM_MAP_MIN;
        if(returnValue > GUESSPOEM_MAP_MAX) returnValue = GUESSPOEM_MAP_MAX;

        //console.log("gt: " + returnValue);
        return returnValue;
    }

    const calculatePoemStatistics = () =>
    {
        let poemWordCount = 0, poemGuessedWordCount = 0;
        for(const line of poemRef.current.lines)
        {
            for(const word of line)
            {
                poemWordCount += 1;
                if(word.matched)
                    poemGuessedWordCount += 1;
            }
        }

        let poemPercentageGuessed = poemGuessedWordCount / poemWordCount * 100;
        return [poemWordCount, poemGuessedWordCount, poemPercentageGuessed];
    }

    const handleBeginClick = () =>
    {
        setPoemLoading(true);

        fetch('https://api.rotak.ro/poems/random')
        .then(response=>response.json())
        .then((data) => 
        {
            setIsStartButtonDisappearing(true);

            let loadedPoem = data;
            loadedPoem.lines = loadedPoem.lines.map(constructPoemLine);
            loadedPoem.guessedWords = [];
            setPoem(loadedPoem);
            poemRef.current = loadedPoem;
            setGameState("02_READPOEM");

            let poemReadTime = calculatePoemReadTime();
            setTimeout(handleGameStart, poemReadTime);
            setReadPoemTimerValue(poemReadTime / 1000);
        })
        .catch((error)=>
        {
            handlePlayAgain();
            alert("An error has occured: " + error);
        })
    }

    const handleGuessedWordClick = (clickedWord) =>
    {
        console.log(clickedWord);
        setPoem(produce((draft)=> 
        {
            draft.lines.map((line)=>
            {
                return line.map((word)=>
                {
                    if(word.alphanum.toLowerCase() === clickedWord.toLowerCase())
                    {
                        word.highlight = true;
                    }
                    else
                    {
                        word.highlight = false;
                    }
                    return word;
                })
            })

            draft.guessedWords = draft.guessedWords.map((el)=>{return {...el, "isClicked": false}});
            draft.guessedWords.find((el)=>el.text.toLowerCase() === clickedWord.toLowerCase()).isClicked = true;

            return draft;
            
        }))

            


    }

    const handleStartButtonAnimationEnd = (event) =>
    {
        if(event.animationName === "animOpacityToTransparent")
        {
            setShowStartButton(false);
            setIsStartButtonDisappearing(false);
            setPoemLoading(false);
        }
    }

    const handlePlayerInputAnimationEnd = (event) =>
    {
        //console.log(event.animationName)
        if(event.animationName === "animOpacityToTransparent")
        {
            setShowPlayerInput(false);
            setIsPlayerInputDisappearing(false);
        }
    }

    const handleResultsAnimationEnd = (event) =>
    {
        if(event.animationName === "animOpacityToTransparent")
        {
            setIsResultsDivCenter(false);
            setIsResultsDivCenterDisappearing(false);
        }
    }

    const handleGameStart = () =>
    {
        setAllWordsVisible(false);
        setGameState("03_GAMERUNNING");
        
        setShowPlayerInput(true);
        setShowGuessedWords(true)

        let poemGuessTime = calculatePoemGuessTime();
        setTimeout(handleGameComplete, poemGuessTime);
        setCompletePoemTimerValue(poemGuessTime / 1000);
    }

    const handleGameComplete = () =>
    {
        setAllWordsVisible(true);
        setGameState("04_GAMECOMPLETE");

        setIsPlayerInputDisappearing(true);

        setPoem(produce((draft)=>
        {
            draft.guessedWords = draft.guessedWords.map((el)=>{return {...el, 'highlight': false, 'isClicked': false}});

            draft.lines = draft.lines.map((line=>line.map((word)=>{return {...word, 'highlight': false}})));
        }))

    }

    const handleUserInput = ({target}) =>
    {
        setUserInput(target.value);

        let inputWords = target.value.replace(/[^a-z0-9' ]/gi, '').split(" ");

        setPoem(
            produce((draft)=>
            {
                let functionResults = {"foundMatch": false, "doResetInput": true, "isNewFound": false, "isOldFound": false};
                draft.lines = draft.lines.map( (line) => line.map( (word) => markPoemWordOnMatch(word, inputWords, functionResults) ) )
                
                if(functionResults.foundMatch && functionResults.doResetInput)
                    setUserInput("");

                if(functionResults.isNewFound !== false)
                {
                    draft.guessedWords.push(
                        {"text": functionResults.isNewFound.toLowerCase(),
                        "time": Date.now(),
                        "highlight": false,
                        "isClicked": false});
                }

                draft.guessedWords = draft.guessedWords.map((el)=>{return {...el, 'highlight': false}});
                if(functionResults.isOldFound !== false)
                {
                    functionResults.isOldFound.forEach((word)=>
                    {
                        if(draft.guessedWords.find((el)=>el.text === word.toLowerCase()) !== undefined)
                            draft.guessedWords.find((el)=>el.text === word.toLowerCase()).highlight = true;
                    });
                    
                    //console.log("ok");
                }
            })
        )
    }

    const handleResultsRead = () =>
    {
        setIsResultsDivCenterDisappearing(true);
    }

    useEffect(()=>{ poemRef.current = poem}, [poem]);

    const handlePlayAgain = () =>
    {
        setGameState("01_BEFOREBEGIN");
        setPoem(null);
        setUserInput("");
        setAllWordsVisible(true);
        setShowPlayerInput(false);
        setShowStartButton(true);
        setIsResultsDivCenterDisappearing(false);
        setIsResultsDivCenter(true);
        setPoemLoading(false);

        setShowGuessedWords(false);
    }

    

    return {
        poem, poemLoading, allWordsVisible, gameState, userInput, readPoemTimerValue, completePoemTimerValue,
        isStartButtonDisappearing, showStartButton,
        isPlayerInputDisappearing, showPlayerInput,
        showGuessedWords, showSmallScreenAlert,
        isResultsDivCenterDisappearing, isResultsDivCenter, 
        calculatePoemStatistics, handleUserInput, handleBeginClick, handlePlayAgain, handleResultsRead, handleGuessedWordClick,
        handleStartButtonAnimationEnd, handlePlayerInputAnimationEnd, handleResultsAnimationEnd
    };
}