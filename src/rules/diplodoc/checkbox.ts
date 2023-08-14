import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {Options} from 'markdown-it';

import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';
import {isListItemClose, isOrderedListClose, isUnorderedListClose} from 'src/rules/block/list';
import {normalizeSource} from 'src/processors';

const always =
    <T>(v: T) =>
    () =>
        v;

const alwaysEmpty = always('');

const checkbox: Renderer.RenderRuleRecord = {
    checkbox_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (i > 2 && tokens[i - 3].type !== 'checkbox_close') {
            rendered += this.EOL;
        }

        rendered += this.renderContainer(tokens[i]);

        rendered += '[';

        return rendered;
    },
    checkbox_input: function (
        this: MarkdownRenderer,
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        const current = tokens[i];

        let rendered = '';

        const [row] = current.map ?? [];
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (row == null) {
            throw new Error('missing line mapping on token');
        }

        let fallback = false;
        let syntax;

        if (env.source) {
            ({syntax, fallback} = parseCheckboxSyntax(env.source, row));
        }

        if (!env.source || fallback) {
            const checked = current.attrGet('checked');

            syntax = checked === 'true' ? 'x' : this.SPACE;
        }

        rendered += `${syntax}] `;

        return rendered;
    },
    checkbox_label_open: alwaysEmpty,
    checkbox_label_close: alwaysEmpty,
    checkbox_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (isLastCheckboxInList(this.containers, tokens, i)) {
            return rendered;
        }

        rendered += this.EOL;

        return rendered;
    },
};

function parseCheckboxSyntax(source: string[], row: number) {
    const line = normalizeSource(source)[row];
    const match = line.match(/\[(x|\s|_|-)\]/i);

    if (match?.index) {
        const syntax = line.slice(match.index + 1, match.index + 2);

        return {syntax, fallback: false};
    }

    return {syntax: '', fallback: true};
}

function isLastCheckboxInList(
    containers: MarkdownRenderer['containers'],
    tokens: Token[],
    i: number,
) {
    const listClose = tokens[i + 2];
    const listItemClose = tokens[i + 1];

    return (
        containers.length &&
        listItemClose &&
        isListItemClose(listItemClose) &&
        listClose &&
        (isUnorderedListClose(listClose) || isOrderedListClose(listClose))
    );
}

export {checkbox};
export default {checkbox};
