export function generateWordOutput(word, index, allWordsVisible)
{
    let wordLength = word.alphanum.length;
    
    let wordOutput = "x".repeat(wordLength);
    
    if(word.matched || allWordsVisible === true)
        wordOutput = <>{word.alphanum}{word.others}</>;

    return (
    <span key = {"word_"+index.toString()}>
        <span className = {"game__poem__word " + (word.matched ? "game__poem__word--matched " : "") + (word.matched && word.highlight ? "game__poem__word--highlight " : "")}>
            {wordOutput}
            {(word.matched && word.highlight) && (<span className = "game__poem__word__overlay">{wordOutput}</span>)}
        </span>
        &nbsp;
    </span>
    );
}

export function VerifyScrolledToBottom(element, callbackSetter)
{
    if(element.scrollTop >= (element.scrollHeight - element.offsetHeight))
    {
        callbackSetter(true);
    }
    else
    {
        callbackSetter(false);
    }
    return;
} 
