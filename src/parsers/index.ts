import Token from 'markdown-it/lib/token';

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

function hide(token: Token) {
    token.hidden = true;

    token.children?.forEach((child) => {
        child.hidden = true;
    });
}

export {skipChars, hide};
export default {skipChars, hide};
