import {useRef} from 'react';
import {generateWordOutput} from "./PoemContainerHelper";
import {usePoemContainer} from "./PoemContainerHook";

//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
//import {faCaretSquareDown} from '@fortawesome/free-solid-svg-icons';

export const PoemContainer = ({poem, allWordsVisible}) =>
{
    const divRef = useRef();
    const {isScrolledToBottom, showScrollPointer, handlePoemScroll} = usePoemContainer(divRef, poem);
    
    let poemLines = [];
    if(poem)
    {
        poem.lines.forEach((line)=>
        {
            let poemLine = (<>
                {line.map((word, index) => generateWordOutput(word, index, allWordsVisible))}
                </>)
            poemLines.push(poemLine);
        });
    }

    return (<>
        {poem && (<section className = "fixedcontainer__bottomleft poeminfo">
        <div><h2>{poem.title}</h2>
        {poem.author !== "" && (<h3>de {poem.author}</h3>)}
        </div>
        </section>)}

        {poem && (<div className = "game__poem" onScroll = {handlePoemScroll} onAnimationEnd = {handlePoemScroll} ref = {divRef}>
            {poemLines.map((line, index)=><p key = {"line_"+index.toString()}>{line}</p>)}
            </div>)}
        
        <div className = "game__hidescrollbar"></div>
        {(showScrollPointer && !isScrolledToBottom) && (<div className = "game__scrollpointer"><span>&darr;</span></div>)}
        </>);
}
