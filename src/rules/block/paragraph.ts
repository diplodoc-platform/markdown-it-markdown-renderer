import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';

const interrupters = new Set(['hr', 'heading_close', 'code_block', 'fence']);

// todo: refactor into DI in the rule factory/renderer itself
const separate = new Set([
    'paragraph_close',
    'bullet_list_close',
    'ordered_list_close',
    'html_block',
    'yfm_note_close',
]);

const diplodocBlocks = new Set(['yfm_note_close']);

const paragraph: Renderer.RenderRuleRecord = {
    paragraph_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        const current = tokens[i];
        if (!current) {
            throw new Error('failed to rendrer paragraph');
        }

        let rendered = '';

        if (!i) {
            return rendered;
        }

        // receive previous token
        // in case of being inside blockquote we want to examine
        // token that comes right before blockquote_open token
        const previous = tokens[i - 1];
        if (!previous) {
            throw new Error('failed to rendrer paragraphi');
        }

        if (!previous.block && !diplodocBlocks.has(previous.type)) {
            return '';
        }

        // vertical gap rendering
        if (interrupters.has(previous.type)) {
            rendered += this.EOL;
        } else {
            if (previous.type === 'blockquote_close') {
                rendered += this.EOL;
            }

            if (separate.has(previous.type)) {
                rendered += this.EOL;
                rendered += this.renderContainer(current);
            }

            rendered += this.EOL;
        }

        rendered += this.renderContainer(current);

        return rendered;
    },
    paragraph_close: function (this: MarkdownRenderer) {
        return '';
    },
};

export {paragraph};
export default {paragraph};
