import { useEffect, useState } from "react"


export function DownTimer({initialValue})
{
    const [timerValue, setTimerValue] = useState(initialValue)
    
    const handleTimerUpdate = () =>
    {
        setTimerValue(tv=>tv-1);
    }

    useEffect(()=>
    {
        let intervalID = setInterval(handleTimerUpdate, 1000);

        return () => {clearInterval(intervalID);}
    }, []);

    return <div className = "fixedcontainer__bottomright counter"><p>{timerValue}</p></div>
}