import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

export type TermState = {
    term: {
        pending: Array<string>;
    };
};

const initState = (): TermState => ({
    term: {
        pending: [],
    },
});

const term: Renderer.RenderRuleRecord = {
    term_open: function (this: MarkdownRenderer<TermState>, tokens: Token[], i: number) {
        const key = tokens[i].attrGet('term-key')?.slice(1);

        if (!key) {
            throw new Error('Unable to parse terms: key is not defined');
        }

        this.state.term.pending.push(key);

        return '[';
    },
    term_close: function (this: MarkdownRenderer<TermState>) {
        let rendered = ']';
        const key = this.state.term.pending.pop();

        rendered += `(*${key})`;

        return rendered;
    },
    template_open: function (this: MarkdownRenderer<TermState>, tokens: Token[], i: number) {
        const key = tokens[i].attrGet('label');
        const rendered = this.EOL.repeat(2) + `[*${key}]: `;

        return rendered;
    },
    template_close: function (this: MarkdownRenderer<TermState>) {
        return this.EOL;
    },
};

export {term, initState};
export default {term, initState};
