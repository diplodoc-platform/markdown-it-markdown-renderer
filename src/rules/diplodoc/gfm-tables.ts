import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';

const always =
    <T>(a: T) =>
    () =>
        a;

const alwaysEmptyStr = always('');

export type GFMTableState = {
    gfmTables: {
        pending: Token[];
    };
};

const initState = () => ({
    gfmTables: {
        pending: new Array<Token>(),
    },
});

const gfmTables: Renderer.RenderRuleRecord = {
    table_open: function (this: MarkdownRenderer<GFMTableState>, tokens: Token[], i: number) {
        let rendered = '';

        if (i) {
            rendered += this.EOL;
        }

        return rendered;
    },
    thead_open: function (this: MarkdownRenderer<GFMTableState>, tokens: Token[], i: number) {
        const rendered = '';

        this.state.gfmTables.pending.push(tokens[i]);

        return rendered;
    },
    tr_open: alwaysEmptyStr,
    tr_close: function (this: MarkdownRenderer) {
        return this.EOL;
    },
    th_open: always('|'),
    th_close: function (tokens: Token[], i: number) {
        let rendered = '';

        if (i + 1 === tokens.length || tokens[i + 1].type !== 'th_open') {
            rendered += '|';
        }

        return rendered;
    },
    thead_close: function (
        this: MarkdownRenderer<GFMTableState>,
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        let rendered = '';

        const theader = this.state.gfmTables.pending.pop();
        if (!theader?.map) {
            throw new Error('failed to render GFM Table, no map found for the table open');
        }

        const {source} = env;
        if (!source?.length) {
            throw new Error('failed to render GFM Table, pass markdown source as an environment');
        }

        const [_, end] = theader.map;

        const format = source[end];
        if (!format.length) {
            throw new Error('failed to render GFM Table, header formatting not found');
        }

        rendered += format;

        rendered += this.EOL;

        return rendered;
    },
    tbody_open: alwaysEmptyStr,
    tbody_close: alwaysEmptyStr,
    td_open: always('|'),
    td_close: function (tokens: Token[], i: number) {
        let rendered = '';

        if (i + 1 === tokens.length || tokens[i + 1].type !== 'td_open') {
            rendered += '|';
        }

        return rendered;
    },
    table_close: alwaysEmptyStr,
};

export {gfmTables, initState};
export default {gfmTables, initState};
