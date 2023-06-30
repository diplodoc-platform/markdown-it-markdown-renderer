import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';

const tabs: Renderer.RenderRuleRecord = {
    tabs_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (i) {
            rendered += this.EOL.repeat(2);
        }

        rendered += '{% list tabs %}' + this.EOL;

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
    tabs_close: function (this: MarkdownRenderer) {
        let rendered = '';

        rendered += this.EOL.repeat(2);

        rendered += '{% endlist %}';

        rendered += this.EOL;

        return rendered;
    },
};

export {tabs};
export default {tabs};
