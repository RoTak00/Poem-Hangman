import { useEffect, useState } from "react"
import { VerifyScrolledToBottom } from "./PoemContainerHelper";

export const usePoemContainer = (divRef, poem) =>
{
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [showScrollPointer, setShowScrollPointer] = useState(false);


    const handlePoemScroll = () =>
    {
        VerifyScrolledToBottom(divRef.current, setIsScrolledToBottom);
        setShowScrollPointer(true);
    }

    useEffect(()=>
    {
        if(!poem)
        {
            setShowScrollPointer(false);
        }
    }, [poem])

    return {isScrolledToBottom, showScrollPointer, handlePoemScroll};
}