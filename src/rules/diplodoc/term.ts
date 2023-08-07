import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

export type TermState = {
    term: {
        pending: Array<string>;
        didRenderEOL: boolean;
    };
};

const initState = (): TermState => ({
    term: {
        pending: [],
        didRenderEOL: false,
    },
});

const always =
    <T>(value: T) =>
    (): T =>
        value;

const term: Renderer.RenderRuleRecord = {
    term_open: function (this: MarkdownRenderer<TermState>, tokens: Token[], i: number) {
        const key = tokens[i].attrGet('term-key')?.slice(1);

        if (!key) {
            throw new Error('Unable to parse terms: key is not defined');
        }

        this.state.term.pending.push(key);
        this.state.term.didRenderEOL = false;

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
        const rendered = this.EOL.repeat(i ? 2 : 1) + `[*${key}]: `;

        return rendered;
    },
    template_close: function (this: MarkdownRenderer<TermState>, tokens: Token[], i: number) {
        const next = tokens[i + 1];
        const isLast = i === tokens.length - 1;

        if (!isLast && (!this.state.term.didRenderEOL || shouldSeparate(next))) {
            return this.EOL;
        }

        return '';
    },
    dfn_close: function (this: MarkdownRenderer<TermState>, tokens: Token[], i: number) {
        const previous = tokens[i - 1];
        const isLast = i === tokens.length - 2;

        if (!isLast && shouldSeparate(previous)) {
            this.state.term.didRenderEOL = true;
            return this.EOL;
        }

        return '';
    },
    dfn_open: always(''),
};

const SEPARATED_TOKENS = new Set([
    /** last token in term definition */
    'bullet_list_close',
    'ordered_list_close',
    /** token after term definition */
    'bullet_list_open',
    'ordered_list_open',
    'blockquote_open',
]);

function shouldSeparate(token: Token | undefined): boolean {
    if (!token) {
        return true;
    }

    if (SEPARATED_TOKENS.has(token.type)) {
        return false;
    }

    return true;
}

export {term, initState};
export default {term, initState};
