import assert from 'node:assert';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';

export type TabsState = {
    tabs: {
        map: Array<[number, number]>;
    };
};

const initState = () => ({
    tabs: {
        map: new Array<[number, number]>(),
    },
});

const tabs: Renderer.RenderRuleRecord = {
    tabs_open: function (this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        let rendered = '';

        if (i) {
            rendered += this.EOL.repeat(2);
        }

        const [start] = tokens[i + 1].map ?? [1, 1];
        const map: [number, number] = [start - 1, start];
        // eslint-disable-next-line no-param-reassign
        tokens[i].map = map;

        this.state.tabs.map.push(map);

        rendered += this.renderContainer(tokens[i]);

        rendered += '{% list tabs';

        const group = tokens[i].attrGet('data-diplodoc-group');
        if (!group?.length) {
            throw new Error('fatal: tab has no group');
        }

        if (!group.startsWith('defaultTabsGroup')) {
            const [name] = group.split('-');
            if (!name?.length) {
                throw new Error("fatal: couldn't parse group name");
            }

            rendered += ` group=${name}`;
        }

        rendered += ' %}' + this.EOL;

        return rendered;
    },
    // tab content open
    'tab-panel_open': function () {
        return '\n';
    },
    // tab content close
    'tab-panel_close': function () {
        return '';
    },
    tabs_close: function (this: MarkdownRenderer<TabsState>, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.EOL.repeat(2);

        const map = this.state.tabs.map.pop();
        assert(map?.length);
        // eslint-disable-next-line no-param-reassign
        tokens[i].map = map;

        rendered += this.renderContainer(tokens[i]);

        rendered += '{% endlist %}';

        rendered += this.EOL;

        return rendered;
    },
};

export {tabs, initState};
export default {tabs, initState};
