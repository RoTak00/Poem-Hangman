export function GameButton({onClick, isDisabled, disabledText, text})
{
    return <button onClick = {onClick} disabled = {isDisabled === true ? true : false}>
        {isDisabled ? disabledText : text}</button>
}
