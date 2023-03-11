export const PlayerGuessedWords = ({words, onClick}) =>
{
    if(words === [])
        return <></>;

    return (<>{words.map((word)=><p key = {word.text} onClick = {()=>{onClick(word.text)}}
    className = {(word.highlight ? "--highlight " : "") + (word.isClicked ? "--isClicked " : "")}>
        {word.text}</p>)}</>);
}