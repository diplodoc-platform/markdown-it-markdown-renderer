import Token from 'markdown-it/lib/token';

function getMap(token: Token) {
    const [start, end] = token.map ?? [null, null];
    // eslint-disable-next-line eqeqeq, no-eq-null
    if (start == null || end == null) {
        throw new Error("token doesn't have row map, unable to render");
    }

    return [start, end];
}

export {getMap};
export default {getMap};
