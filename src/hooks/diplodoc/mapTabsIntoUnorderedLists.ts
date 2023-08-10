import Token from 'markdown-it/lib/token';
import {CustomRendererHookParameters} from '@diplodoc/markdown-it-custom-renderer';

function mapTabsIntoUnorderedLists(parameters: CustomRendererHookParameters) {
    for (let i = 0; i < parameters.tokens.length; i++) {
        const token = parameters.tokens[i];

        if (token.type === 'tab-list_open') {
            parameters.tokens[i].type = 'bullet_list_open';
            parameters.tokens[i].markup = '-';

            continue;
        }

        if (token.type === 'tab-list_close') {
            parameters.tokens[i].type = 'bullet_list_close';

            continue;
        }

        if (token.type === 'tab_open') {
            parameters.tokens[i].type = 'list_item_open';

            const paragraphOpen = new Token('paragraph_open', '', 0);
            const paragraphClose = new Token('paragraph_close', '', 0);
            paragraphOpen.map = parameters.tokens[i].map;

            const wrappedInline = [paragraphOpen, parameters.tokens[i + 1], paragraphClose];

            parameters.tokens.splice(i + 1, 1, ...wrappedInline);
            continue;
        }

        if (token.type === 'tab_close') {
            parameters.tokens[i].type = 'list_item_close';
            continue;
        }
    }

    return '';
}

export {mapTabsIntoUnorderedLists};
export default {mapTabsIntoUnorderedLists};
