export async function loadPoem()
{
    return new Promise(resolve => {
        resolve({
        "lines": ["Hello, is it me you're looking for?", "I can see it in your eyes...", "I can see it in your smile..."],
        "count": 3
        });
    });
}

export function mapValue (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}