import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {isFst, isTail, isEmpty, Container, ContainerBase} from 'src/rules/block/containers';
import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';
import {normalizeSource} from 'src/processors';
import {consumeList, isList} from './list';
import {skipChars} from 'src/parsers';
import {getMap} from 'src/token';

export type ContainerBlockquote = ContainerBase & {type: 'blockquote_open'};

const blockquote: Renderer.RenderRuleRecord = {
    blockquote_open: function (
        this: MarkdownRenderer,
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        const {source} = env;
        const {markup} = tokens[i];

        if (!source?.length || !markup) {
            throw new Error('failed to render blockquote');
        }

        const [start] = getMap(tokens[i]);
        const [line] = normalizeSource(source).slice(start, start + 1);
        if (!line?.length) {
            throw new Error('failed to render blockquote');
        }

        // consume parsed containers constructs from this line
        let j = 0;
        for (const container of this.containers) {
            if (isList(container) && container.row === start) {
                j = consumeList(line, j, container);

                continue;
            }

            if (isBlockquote(container) && container.row === start) {
                j = consumeBlockquote(line, j, container);
            }
        }

        if (this.containers.length === 1) {
            j = 0;
        }

        const col = line.indexOf(markup, j);
        if (col === -1) {
            throw new Error('failed to render blockquote');
        }

        // scan for the tsapces
        j = skipChars(line, [' '], col + 1);

        this.containers.push({
            type: tokens[i].type,
            lspaces: 0,
            tspaces: j - col - 1,
            row: start,
            col,
            markup,
            rendered: false,
        });

        // prevent containers from sticking to each other
        return i && isBlockquoteClose(tokens[i - 1]) ? this.EOL : '';
    },
    blockquote_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        const containersLen = this.containers.length;

        if (containersLen && !this.containers[containersLen - 1].rendered) {
            rendered += this.renderContainer(tokens[i]);
        }

        this.containers.pop();

        return rendered;
    },
};

function consumeBlockquote(line: string, i: number, container: Container<ContainerBase>) {
    let cursor = i ?? 0;

    const index = line.indexOf(container.markup, cursor);
    if (index === -1) {
        throw new Error('failed to spin');
    }

    cursor = index + 1;

    return cursor;
}

function isBlockquote(token: Token | Container<ContainerBase>) {
    return token.type === 'blockquote_open';
}

function isBlockquoteClose(token: Token | Container<ContainerBase>) {
    return token.type === 'blockquote_close';
}

function renderEmptyBlockquote<CT extends ContainerBase>(
    this: MarkdownRenderer,
    containers: Container<CT>[],
    i: number,
    caller: Token,
) {
    const container = containers[i];
    let rendered = '';

    if (isBlockquoteClose(caller) && !container.rendered) {
        rendered += this.EOL;
        rendered += container.markup;
    }

    return rendered;
}

function renderBlockquote<CT extends ContainerBase>(
    this: MarkdownRenderer,
    containers: Container<CT>[],
    i: number,
    caller: Token,
) {
    const container = containers[i];
    let rendered = '';

    const empty = isBlockquoteClose(caller) && !container.rendered;

    if (isBlockquote(container) && !empty) {
        if (isFst(container, caller)) {
            // console.info('blockquote fst');
            rendered += container.markup;
            rendered += this.SPACE.repeat(container.tspaces);
        } else if (isTail(container, caller)) {
            // console.info('blockquote tail');
            rendered += container.markup;
            rendered += this.SPACE.repeat(container.tspaces);
            // first line empty blockquote
        } else if (isEmpty(container) && !container.rendered) {
            rendered += container.markup;
            rendered += this.EOL;
        } else {
            throw new Error('blockquote not fast not tail - undefined behaviour');
        }
    }

    return rendered;
}

export {
    blockquote,
    consumeBlockquote,
    isBlockquote,
    isBlockquoteClose,
    renderEmptyBlockquote,
    renderBlockquote,
};
export default {
    blockquote,
    consumeBlockquote,
    isBlockquote,
    isBlockquoteClose,
    renderEmptyBlockquote,
    renderBlockquote,
};
