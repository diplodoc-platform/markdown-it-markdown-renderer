import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {consumeBlockquote} from './blockquote';

import {MarkdownRenderer, MarkdownRendererEnv, Container, isListType} from 'src/renderer';

// export function consumeList(line: string, i: number, blockquote: Container, row: number) {
export function consumeList(line: string, i: number, blockquote: Container) {
    const cursor = i;

    const col = line.indexOf(blockquote.markup, cursor);
    if (col === -1) {
        throw new Error('failed to render list');
    }

    return col;
}

const list: Renderer.RenderRuleRecord = {
    bullet_list_open: listOpen,
    bullet_list_close: listClose,
    ordered_list_open: listOpen,
    ordered_list_close: listClose,
    list_item_open: listItemOpen,
    list_item_close: listItemClose,
};

// eslint-disable-next-line complexity
function listItemOpen(
    this: MarkdownRenderer,
    tokens: Token[],
    i: number,
    options: Options,
    env: MarkdownRendererEnv,
) {
    const {source} = env;
    const {map, markup} = tokens[i];
    if (!source?.length || !map || !markup) {
        throw new Error('failed to render ordered list');
    }

    const [start] = map;
    if (start === null) {
        throw new Error('failed to render ordered list');
    }

    const [line] = source.slice(start, start + 1);
    if (!line?.length) {
        throw new Error('failed to render ordered list');
    }

    let j = 0;

    for (const quote of this.containers) {
        if (quote.type === 'blockquote') {
            j = consumeBlockquote(line, j, quote);
        } else if (quote.type === 'list') {
            if (quote.row === start) {
                // j = consumeList(line, j, quote, start);
                j = consumeList(line, j, quote);
            } else {
                j = quote.col + quote.markup.length + quote.tspaces;
            }
        }
    }

    let lspaces = j;

    for (; line.charAt(j) === ' ' && j < line.length; j++);

    lspaces = lspaces === j ? 0 : j - lspaces;

    const col = line.indexOf(markup, j);
    if (col === -1) {
        throw new Error('failed to render list');
    }

    // scan for the tsapces
    for (j = col + 1; line.charAt(j) === ' ' && j < line.length; j++);

    let tspaces = j - col - 1;

    const listType = this.lists[this.lists.length - 1]?.type;
    if (!listType?.length || !isListType(listType)) {
        throw new Error('failed to render list');
    }

    let empty = line.slice(col).trimEnd().endsWith(markup);

    let k;

    for (k = col + 1; (line.charAt(k) === ' ' || line.charAt(k) === '\n') && k < line.length; k++);

    if (k !== line.length) {
        empty = false;
    }

    if (empty) {
        let [next] = source.slice(start + 1, start + 2);
        if (!next?.length) {
            next = '';
            // throw new Error('failed to render unordered list');
        }

        for (j = 0; next.charAt(j) === ' ' && j < next.length; j++);

        tspaces = j;
    }

    const parsed: Container = {
        rendered: false,
        type: 'list',
        row: start,
        listType,
        col,
        lspaces,
        tspaces,
        markup,
        empty,
    };

    if (listType === 'ordered_list_open') {
        const match = line.match(/(\d+)(?:\.|\)\s+|$)/);
        // eslint-disable-next-line eqeqeq, no-eq-null
        if (!match || match.index == null || match[1] == null) {
            throw new Error('failed to render list');
        }

        const order = parseInt(match[1], 10);

        if (isNaN(order) || match.index >= col) {
            throw new Error('failed to render list');
        }

        parsed.order = order;
    }

    this.containers.push(parsed);

    return '';
}

function listItemClose(this: MarkdownRenderer, tokens: Token[], i: number) {
    let rendered = '';

    const containersLen = this.containers.length;

    if (containersLen && !this.containers[containersLen - 1].rendered) {
        rendered += this.renderContainer(tokens[i]);
    }

    this.containers.pop();

    return rendered;
}

function listOpen(this: MarkdownRenderer, tokens: Token[], i: number) {
    // remember list openping token
    // helps make decisions during list item parsing
    this.lists.push(tokens[i]);

    return '';
}

function listClose(this: MarkdownRenderer) {
    // forget list openping token
    this.lists.pop();

    return '';
}

export {list};
export default {list};