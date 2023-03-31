function skipChars(str: string, chars: string[], start = 0) {
    const checkCharsInLine = charsCheck(str);
    const len = str.length;
    let i = start;
    let checker = checkCharsInLine(i);

    while (chars.some(checker) && i < len) {
        i++;
        checker = checkCharsInLine(i);
    }

    return i;
}

function charsCheck(str: string) {
    return (i: number) => (ch: string) => str.charAt(i) === ch;
}

export {skipChars};
export default {skipChars};
