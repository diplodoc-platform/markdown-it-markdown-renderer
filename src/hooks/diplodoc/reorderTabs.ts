import Token from 'markdown-it/lib/token';
import {CustomRendererHookParameters} from '@diplodoc/markdown-it-custom-renderer';

function reorderTabs(parameters: CustomRendererHookParameters) {
    let start;
    let end;
    let shift = 0;

    const contents: Array<Array<Token>> = [];
    const indexes: Array<number> = [];
    const shifts: Array<number> = [];

    for (let i = 0; i < parameters.tokens.length; i++) {
        const {type} = parameters.tokens[i];
        if (type === 'tab_close') {
            indexes.push(i);
            continue;
        }

        if (type === 'tab-panel_open') {
            start = i;
            continue;
        }

        if (type === 'tab-panel_close') {
            end = i;
        }

        // eslint-disable-next-line no-eq-null, eqeqeq
        if (start == null || end == null) {
            continue;
        }

        const content: Array<Token> = [];
        for (let j = start; j < end + 1; j++) {
            content.push(parameters.tokens[j]);

            parameters.tokens[j] = new Token('markdown-renderer-trash', '', 0);
            parameters.tokens[j].content = '';
        }

        start = null;
        end = null;

        contents.push(content);
        shift += content.length;
        shifts.push(shift);
    }

    for (let i = 0; i < contents.length; i++) {
        const index = indexes[i] + (shifts[i - 1] ?? 0);

        parameters.tokens.splice(index, 0, ...contents[i]);
    }

    for (let i = 0; i < parameters.tokens.length; i++) {
        const token = parameters.tokens[i];
        if (token.type === 'tab-list_close') {
            start = i + 1;
            continue;
        }

        if (token.type === 'tabs_close') {
            end = i;
        }

        // eslint-disable-next-line no-eq-null, eqeqeq
        if (start == null || end == null) {
            continue;
        }

        parameters.tokens.splice(start, end - start);

        i = i - (end - start);
        start = end = null;
    }

    return '';
}

export {reorderTabs};
export default {reorderTabs};
