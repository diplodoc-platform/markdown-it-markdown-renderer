import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {
    CustomRenderer,
    CustomRendererParams,
    CustomRendererMode,
} from '@diplodoc/markdown-it-custom-renderer';

import {inline} from 'src/rules/inline';
import {block} from 'src/rules/block';
import {renderEmptyBlockquote, renderBlockquote} from 'src/rules/block/blockquote';
import {renderEmptyListItem, renderOrderedList, renderUnorderedList} from 'src/rules/block/list';
import {
    sameRow,
    aligned,
    ContainerRenderer,
    Container,
    ContainerBase,
} from 'src/rules/block/containers';

import heading, {HeadingState} from 'src/rules/block/heading';
import image, {ImageState} from 'src/rules/inline/image';
import link, {LinkState} from 'src/rules/inline/link';

import {NEW_LINE, ONE_SPACE} from './constants';

export const MarkdownRendererMode = CustomRendererMode;

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
};

export type MarkdownRendererState = HeadingState & ImageState & LinkState;

const initRulesState = () => ({
    ...heading.initState(),
    ...image.initState(),
    ...link.initState(),
});

class MarkdownRenderer<T = {}, CT extends ContainerBase = ContainerBase> extends CustomRenderer<T> {
    static defaultRules: Renderer.RenderRuleRecord = {...inline, ...block};
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
            initState = () => ({}),
            handlers,
            rules,
            containerRenderers = [],
            mode,
            constants: {EOL = NEW_LINE, SPACE = ONE_SPACE} = {},
        } = params;

        super({
            rules: {...MarkdownRenderer.defaultRules, ...rules},
            handlers,
            initState: () => ({...(initState() as T), ...initRulesState()}),
            mode,
        });

        this.EOL = EOL;
        this.SPACE = SPACE;

        this.containers = new Array<Container<CT>>();

        this.containerRenderers = [
            ...MarkdownRenderer.defaultContainerRenderers,
            ...containerRenderers,
        ].map((rfn: ContainerRenderer<CT>) => rfn.bind(this));
    }

    // eslint-disable-next-line complexity
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

export {MarkdownRenderer};
export default {MarkdownRenderer};
