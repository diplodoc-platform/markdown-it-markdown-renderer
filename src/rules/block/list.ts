import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {isFst, isTail, isEmpty, Container, ContainerBase} from 'src/rules/block/containers';
import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';
import {consumeBlockquote, isBlockquote} from './blockquote';
import {isCode} from 'src/rules/block/code';
import {getMap} from 'src/token';

export type ContainerOrderedList = ContainerBase & {type: 'ordered_list_open'; order: number};

export type ContainerUnorderedList = ContainerBase & {type: 'bullet_list_open'};

const list: Renderer.RenderRuleRecord = {
    bullet_list_open: () => '',
    bullet_list_close: () => '',
    ordered_list_open: () => '',
    ordered_list_close: () => '',
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
    const {markup} = tokens[i];
    if (!source?.length || !markup) {
        throw new Error('failed to render ordered list');
    }

    const [start] = getMap(tokens[i]);
    const [line] = source.slice(start, start + 1);
    if (!line?.length) {
        throw new Error('failed to render ordered list');
    }

    let j = 0;

    for (const container of this.containers) {
        if (isBlockquote(container)) {
            j = consumeBlockquote(line, j, container);
        } else if (isList(container)) {
            if (container.row === start) {
                j = consumeList(line, j, container);
            } else {
                j = container.col + container.markup.length + container.tspaces;
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

    const listType = parseListType(tokens, i);

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
        }

        for (j = 0; next.charAt(j) === ' ' && j < next.length; j++);

        tspaces = j;
    }

    const parsed = {
        rendered: false,
        type: listType,
        row: start,
        col,
        lspaces,
        tspaces,
        markup,
        empty,
    };

    if (isOrderedList(parsed)) {
        const match = line.match(/(\d+)(?:\.|\)\s+|$)/);
        // eslint-disable-next-line eqeqeq, no-eq-null
        if (!match || match.index == null || match[1] == null) {
            throw new Error('failed to render list');
        }

        const order = parseInt(match[1], 10);

        if (isNaN(order) || match.index >= col) {
            throw new Error('failed to render list');
        }

        (parsed as ContainerOrderedList).order = order;
    }

    this.containers.push(parsed);

    return '';
}

function consumeList(line: string, i: number, container: Container<ContainerBase>) {
    const cursor = i;

    const col = line.indexOf(container.markup, cursor);
    if (col === -1) {
        throw new Error('failed to render list');
    }

    return col;
}

function parseListType(tokens: Token[], i: number) {
    let cursor = i;

    while (cursor-- >= 0) {
        if (isList(tokens[cursor])) {
            return tokens[cursor].type as
                | ContainerOrderedList['type']
                | ContainerUnorderedList['type'];
        }
    }

    throw new Error('failed to parse list type');
}

function isList(token: Token | Container<ContainerBase>) {
    return isOrderedList(token) || isUnorderedList(token);
}

function isOrderedList(token: Token | Container<ContainerBase>) {
    return token?.type === 'ordered_list_open';
}

function isUnorderedList(token: Token | Container<ContainerBase>) {
    return token?.type === 'bullet_list_open';
}

function isListItemClose(token: Token) {
    return token?.type === 'list_item_close';
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

function renderEmptyListItem<CT extends ContainerBase>(
    this: MarkdownRenderer,
    containers: Container<CT>[],
    i: number,
    caller: Token,
) {
    const container = containers[i];
    let rendered = '';

    if (isListItemClose(caller) && !container.rendered) {
        if (isOrderedList(container) && isContainerOrderedList(container)) {
            rendered += this.EOL;
            rendered += container.order;
            rendered += container.markup;
        } else if (isUnorderedList(container)) {
            rendered += this.EOL;
            rendered += container.markup;
        } else {
            throw new Error('empty list not ordered and not unordered');
        }
    }

    return rendered;
}

function renderOrderedList<CT extends ContainerBase>(
    this: MarkdownRenderer,
    containers: Container<CT>[],
    i: number,
    caller: Token,
) {
    const container = containers[i];

    let rendered = '';

    const empty = isListItemClose(caller) && !container.rendered;

    if (isOrderedList(container) && !empty && isContainerOrderedList(container)) {
        if (isFst(container, caller) && !isEmpty(container)) {
            // console.info('ordered fst');

            let codeIndent = 0;
            if (isCode(caller) && !isEmpty(container)) {
                const codeFstLine = caller.content.split('\n')[0] ?? '';

                codeIndent = codeFstLine.length - codeFstLine.trim().length;
            }

            rendered += container.order;
            rendered += container.markup;
            rendered += this.SPACE.repeat(container.tspaces - codeIndent);

            if (isCode(caller) && !isEmpty(container)) {
                // console.info('ordered fst code_block not empty');

                this.containers[i].tspaces = this.containers[i].tspaces - 4 - codeIndent;
            }
        } else if (isTail(container, caller)) {
            // console.info('ordered tail');
            let indentation = 0;

            const orderLen = `${container.order}`.length;

            // indent with spaces of length of the markup and order string
            // but only in the case of the content going on the new line
            // after list open
            if (!isEmpty(container)) {
                indentation += orderLen;
                indentation += container.markup.length;
            }

            indentation += container.tspaces;

            if (isCode(caller)) {
                indentation += 4;
            }

            rendered += this.SPACE.repeat(indentation);
            // first line was empty
            // render empty open markup new line and indentation
        } else if (isEmpty(container) && !container.rendered) {
            // console.info('ordered empty fst');
            rendered += container.order;
            rendered += container.markup;
            rendered += this.EOL;

            let indentation = 0;

            indentation += container.tspaces;

            rendered += this.SPACE.repeat(indentation);
        } else {
            throw new Error('ordered list not fst not tail - undefined behaviour');
        }
    }

    return rendered;
}

function renderUnorderedList<CT extends ContainerBase>(
    this: MarkdownRenderer,
    containers: Container<CT>[],
    i: number,
    caller: Token,
) {
    const container = containers[i];
    let rendered = '';

    const empty = isListItemClose(caller) && !container.rendered;

    if (isUnorderedList(container) && !empty) {
        if (isFst(container, caller) && !isEmpty(container)) {
            // console.info('unordered fst not empty');
            rendered += container.markup;
            rendered += this.SPACE.repeat(container.tspaces);
        } else if (isTail(container, caller)) {
            // console.info('unordered tail');
            let indentation = 0;

            // indent with spaces of length of the markup
            // but only in the case of the content going on the new line
            // after list open
            if (!isEmpty(container)) {
                indentation += container.markup.length;
            }

            if (isCode(caller)) {
                indentation += 4;
            }

            indentation += container.tspaces;

            rendered += this.SPACE.repeat(indentation);

            // first line was empty
            // render empty open markup new line and indentation
        } else if (isEmpty(container) && !container.rendered) {
            // console.info('empty fst');
            rendered += container.markup;
            rendered += this.EOL;

            let indentation = 0;

            indentation += container.tspaces;

            rendered += this.SPACE.repeat(indentation);
        } else {
            throw new Error('unordered list not fst not tail - undefined behaviour');
        }
    }

    return rendered;
}

function isContainerOrderedList(
    container: ContainerBase & Record<string, unknown>,
): container is ContainerOrderedList {
    return container.order !== undefined;
}

export {
    list,
    consumeList,
    isList,
    isOrderedList,
    isUnorderedList,
    isListItemClose,
    isContainerOrderedList,
    renderEmptyListItem,
    renderUnorderedList,
    renderOrderedList,
};

export default {
    list,
    consumeList,
    isList,
    isOrderedList,
    isUnorderedList,
    isListItemClose,
    isContainerOrderedList,
    renderEmptyListItem,
    renderUnorderedList,
    renderOrderedList,
};
