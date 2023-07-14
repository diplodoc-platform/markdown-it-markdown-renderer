import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

const always =
    <T>(a: T) =>
    () =>
        a;

const alwaysEmptyStr = always('');

const cellOpenInterrupters = new Set(['yfm_td_close', 'bullet_list_open', 'ordered_list_open']);

const multilineTables: Renderer.RenderRuleRecord = {
    yfm_tbody_open: alwaysEmptyStr,
    yfm_tbody_close: alwaysEmptyStr,
    yfm_table_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (i && tokens[i - 1].type !== 'yfm_td_open') {
            rendered += this.EOL.repeat(2);
        }

        rendered += this.renderContainer(tokens[i]);

        rendered += '#|';

        return rendered;
    },
    yfm_table_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.renderContainer(tokens[i]);

        rendered += '|#';

        const next: Token | undefined = tokens[i + 1];
        const nextnext: Token | undefined = tokens[i + 2];
        const shouldntSeparate =
            nextnext?.type === 'bullet_list_close' ||
            nextnext?.type === 'ordered_list_close' ||
            next?.type === 'yfm_td_close';

        if (!shouldntSeparate) {
            rendered += this.EOL;
        }

        return rendered;
    },
    yfm_tr_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (tokens[i - 1].type !== 'yfm_tr_close') {
            rendered += '\n';
        }

        rendered += this.renderContainer(tokens[i]);

        rendered += '|';

        return rendered;
    },
    yfm_tr_close: function () {
        return '|\n';
    },
    yfm_td_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '|';

        const next = tokens[i + 1];
        if (!next) {
            return rendered;
        }

        if (!cellOpenInterrupters.has(next.type)) {
            rendered += '\n';
        }

        return rendered;
    },
    yfm_td_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (tokens[i - 1].type !== 'yfm_td_open') {
            rendered += '\n';
        }

        rendered += this.renderContainer(tokens[i]);

        if (i + 1 !== tokens.length && tokens[i + 1].type !== 'yfm_td_open') {
            rendered += '|';
        }

        return rendered;
    },
};

export {multilineTables};
export default {multilineTables};
