import {
    CustomRenderer,
    CustomRendererHanlders,
    CustomRendererHooks,
    CustomRendererParams,
} from '@diplodoc/markdown-it-custom-renderer';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {inline} from 'src/rules/inline';
import {block} from 'src/rules/block';
import {diplodoc as diplodocRules} from 'src/rules/diplodoc';
import {diplodoc as diplodocHandlers} from 'src/handlers/diplodoc';
import {hooks as diplodocHooks} from 'src/hooks';
import {initState as tabsInitState} from 'src/rules/diplodoc/tabs';
import {renderBlockquote, renderEmptyBlockquote} from 'src/rules/block/blockquote';
import list, {
    renderEmptyListItem,
    renderOrderedList,
    renderUnorderedList,
} from 'src/rules/block/list';
import {
    Container,
    ContainerBase,
    ContainerRenderer,
    aligned,
    sameRow,
} from 'src/rules/block/containers';

import heading, {HeadingState} from 'src/rules/block/heading';
import link, {LinkState} from 'src/rules/inline/link';

// plugins
import GFMTable, {GFMTableState} from 'src/rules/diplodoc/gfm-tables';

import {NEW_LINE, ONE_SPACE} from './constants';
import term, {TermState} from 'src/rules/diplodoc/term';

export type MarkdownRendererParams<
    T = {},
    CT extends ContainerBase = ContainerBase,
> = CustomRendererParams<T> & {
    constants?: {
        EOL?: string;
        SPACE?: string;
    };
    containerRenderers?: ContainerRenderer<CT>[];
};

// Renderer Environment
// passed to every rule handling tokens render
export type MarkdownRendererEnv = {
    // array of original markdown string split by new lines
    // some rules are using it to achive more accurate rendering
    source?: string[];
    terms?: Record<string, string>;
};

export type MarkdownRendererState = HeadingState & LinkState & GFMTableState & TermState;

const initRulesState = () => ({
    ...heading.initState(),
    ...link.initState(),
    ...list.initState(),
    ...GFMTable.initState(),
    ...term.initState(),
    ...tabsInitState(),
});

class MarkdownRenderer<T = {}, CT extends ContainerBase = ContainerBase> extends CustomRenderer<T> {
    static defaultRules: Renderer.RenderRuleRecord = {...inline, ...block, ...diplodocRules};
    static defaultHandlers: CustomRendererHanlders = {...diplodocHandlers};
    static defaultHooks: CustomRendererHooks = {...diplodocHooks};
    static defaultContainerRenderers: Array<ContainerRenderer<ContainerBase>> = [
        renderEmptyBlockquote,
        renderEmptyListItem,
        renderOrderedList,
        renderUnorderedList,
        renderBlockquote,
    ];

    // constants
    // end of line used by renderer
    protected EOL: string;
    // space used by renderer
    protected SPACE: string;

    // containers
    protected containers: Array<Container<CT>>;
    protected containerRenderers: Array<ContainerRenderer<CT>>;

    constructor(params: MarkdownRendererParams<T, CT> = {}) {
        const {
            constants: {EOL = NEW_LINE, SPACE = ONE_SPACE} = {},
            containerRenderers = [],
            initState = () => ({}),
            rules,
            handlers,
            hooks,
        } = params;

        super({
            ...params,
            handlers: {...MarkdownRenderer.defaultHandlers, ...handlers},
            rules: {...MarkdownRenderer.defaultRules, ...rules},
            initState: () => ({...(initState() as T), ...initRulesState()}),
            hooks: {...MarkdownRenderer.defaultHooks, ...hooks},
        });

        this.EOL = EOL;
        this.SPACE = SPACE;

        this.containers = new Array<Container<CT>>();

        this.containerRenderers = [
            ...MarkdownRenderer.defaultContainerRenderers,
            ...containerRenderers,
        ].map((rfn: ContainerRenderer<CT>) => rfn.bind(this));
    }

    renderContainer(caller: Token): string {
        let rendered = '';

        if (!caller) {
            throw new Error('provide caller token');
        }

        if (!this.containers.length) {
            return rendered;
        }

        for (let i = 0; i < this.containers.length; i++) {
            const container = this.containers[i];
            const previous = this.containers[i - 1];

            // common behaviour between containers
            // merge left trailling spaces and right leading spaces
            if (i && sameRow(previous, container) && aligned(previous, container)) {
                const lspaces = Math.max(container.lspaces - previous.tspaces, 0);

                this.containers[i].lspaces = lspaces;
            }

            const lspaces = this.containers[i].lspaces;

            // common behaviour render leading spaces
            rendered += this.SPACE.repeat(lspaces);

            for (const renderer of this.containerRenderers) {
                const rv = renderer(this.containers, i, caller);

                if (rv?.length) {
                    rendered += rv;
                    break;
                }
            }

            // common behaviour between containers
            // mark container as rendered
            this.containers[i].rendered = true;
        }

        // returns result of running one of the handlers
        return rendered;
    }
}

export {
    CustomRendererLifeCycle as MarkdownRendererLifeCycle,
    CustomRendererMode as MarkdownRendererMode,
} from '@diplodoc/markdown-it-custom-renderer';

export {MarkdownRenderer};
export default {MarkdownRenderer};
