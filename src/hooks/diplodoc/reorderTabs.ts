import Token from 'markdown-it/lib/token';
import {CustomRendererHookParameters} from '@diplodoc/markdown-it-custom-renderer';

function reorderTabs(parameters: CustomRendererHookParameters) {
    const bounds = findTabsContentBounds(parameters.tokens);
    moveTabContentIntoTab(parameters.tokens, bounds);

    return '';
}

function findTabsContentBounds(tokens: Token[]): Array<[number, number]> {
    const startIndecies: number[] = [];
    const endIndecies: number[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'tab-panel_open') {
            startIndecies.push(i);
        }
    }

    for (let i = startIndecies.length - 1; i >= 0; i--) {
        const start = startIndecies[i];

        for (let j = start; j < tokens.length; j++) {
            const token = tokens[j];

            if (token.type === 'tab-panel_close' && !endIndecies.includes(j)) {
                endIndecies.unshift(j);
                break;
            }
        }
    }

    return startIndecies.map((start: number, i: number) => [start, endIndecies[i]]);
}

function moveTabContentIntoTab(tokens: Token[], bounds: Array<[number, number]>) {
    if (!tokens.some(isOutOfOrder)) {
        return;
    }

    const [left, right] = bounds.pop() ?? [];
    if (!(left && right)) {
        throw new Error('failed to receive tab content bounds');
    }
    const id = tokens[left].attrGet('id');

    const tabIndex = tokens.findIndex((token: Token) => {
        const ariaControls = token.attrGet('aria-controls');
        return ariaControls === id;
    });

    const len = right - left + 1;
    const content = tokens.splice(left, len);
    tokens.splice(tabIndex + 2, 0, ...content);

    // eslint-disable-next-line no-param-reassign
    bounds = bounds.map(([l, r]) => (tabIndex < l ? [l + len, r + len] : [l, r]));

    moveTabContentIntoTab(tokens, bounds);
}

function isOutOfOrder(token: Token, i: number, tokens: Token[]) {
    return token.type === 'tab_open' && tokens[i + 2]?.type !== 'tab-panel_open';
}

export {reorderTabs};
export default {reorderTabs};
