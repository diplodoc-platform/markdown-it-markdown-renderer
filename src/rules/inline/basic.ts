import Token from 'markdown-it/lib/token';

const rules = new Set([
    'em_open',
    'em_close',
    'strong_open',
    'strong_close',
    'sup_open',
    'sup_close',
    'monospace_open',
    'monospace_close',
]);

function basic(tokens: Token[], i: number) {
    const {type, markup} = tokens[i];

    if (rules.has(type)) {
        return markup;
    }

    throw new Error('failed to render emphasis');
}

export {basic};
export default {basic};
