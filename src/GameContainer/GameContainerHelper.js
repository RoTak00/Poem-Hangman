
function constructPoemWord(word)
{
    let wordSeparated = {};

    wordSeparated.alphanum = word.replace(/[^a-z0-9ăĂîÎâÂșȘțȚşŞţŢ\-']/gi, '');
    wordSeparated.others = word.match(/[.,;-?!'"]+$/)??"";
    wordSeparated.matched = false;
    wordSeparated.timeMatched = 0;
    wordSeparated.highlight = false;

    return wordSeparated;
}

function simplifyWordForMatch(word)
{
    let poemWord = word.replace(/['"-]/g, '').toLowerCase();
    poemWord = poemWord.replace(/[ăâ]/g, 'a');
    poemWord = poemWord.replace(/[îÎ]/g, "i");
    poemWord = poemWord.replace(/[șȘşŞ]/g, "s");
    poemWord = poemWord.replace(/[țȚţŢ]/g, "t");

    return poemWord;
}

export function constructPoemLine(line)
{
    return line.split(" ").map(constructPoemWord).filter((el)=>el.alphanum!=="");
}

export function markPoemWordOnMatch(word, inputWords, outputs)
{
    
    let poemWord = simplifyWordForMatch(word.alphanum);

    inputWords.forEach((inputWord)=>
    {
        let userWord = simplifyWordForMatch(inputWord);
        if(userWord === poemWord)
        {
            if(word.matched === false)
            {
                word.matched = true;
                word.timeMatched = Date.now();
                outputs.foundMatch = true;
                outputs.isNewFound = word.alphanum;
            }
            else
            {
                if(outputs.isOldFound === false)
                    outputs.isOldFound = [];
                outputs.isOldFound.push(word.alphanum);
            }
        }
        else if (poemWord.indexOf(userWord) === 0)
        {
            outputs.doResetInput = false;
        }
    });

    return word;
}

export function calculateNewGuessedWords(poem)
{
    if(poem === null) return [];

    let newGuessedWords = [];
    poem.lines.forEach((line)=>
    {
        line.forEach((word)=>
        {
            if(word.matched && !newGuessedWords.find((el)=>el.text.toLowerCase() === word.alphanum.toLowerCase()))
                newGuessedWords.push({'text': word.alphanum.toLowerCase(), 'time': word.timeMatched, 'highlight': false});
        })
    })

    return newGuessedWords.sort((a, b)=>a.time-b.time);
}