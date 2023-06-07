import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import fs from 'node:fs';

import {MarkdownRenderer} from 'src/renderer';
import {isTail} from '../block/containers';
import {hide} from 'src/parsers';

export type TabsState = {
    tabs: {
        tabInProgress: number;
        titles: string[];
        content: string[];
        debug: number[];
        pending: number | null;
    };
};

const initState = (): TabsState => ({
    tabs: {
        tabInProgress: -1,
        titles: [],
        content: [],
        debug: [],
        pending: null,
    },
});

const TABS_START = '{% list tabs %}';
const TABS_END = '{% endlist %}';

const tabs: Renderer.RenderRuleRecord = {
    tabs_open(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        return TABS_START;
    },
    'tab-list_open'(this: MarkdownRenderer<TabsState>, tokens: Token[]) {
        this.state.tabs.tabInProgress = 0;

        return '';
    },
    tab_open(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        if (i !== tokens.length - 1) {
            hide(tokens[i + 1]);
        }
        this.state.tabs.pending = i;

        return '';
    },
    tab_close(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        if (this.state.tabs.pending === null) {
            return '';
        }

        const openIndex = this.state.tabs.pending;
        const text = tokens
            .slice(openIndex, i)
            .flatMap((token) => {
                return token.content?.length ? token : token.children;
            })
            .map((t) => t?.content)
            .filter((v) => v?.length)
            .join(this.EOL);

        this.state.tabs.content.push(text);

        return '';
    },
    'tab-list_close'(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        this.state.tabs.tabInProgress = -1;

        return '';
    },
    'tab-panel_open'(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        let rendered = this.EOL.repeat(2);

        rendered += '- ' + this.state.tabs.content.shift();
        rendered += this.EOL;

        return rendered;
    },
    'tab-panel_close'(this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        return '';
    },
    tabs_close(this: MarkdownRenderer<TabsState>) {
        let rendered = this.EOL.repeat(2);

        rendered += TABS_END;

        return rendered;
    },
};

export {tabs, initState};
export default {tabs, initState};
