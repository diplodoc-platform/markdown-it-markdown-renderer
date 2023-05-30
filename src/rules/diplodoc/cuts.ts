import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';

const cuts: Renderer.RenderRuleRecord = {
    yfm_cut_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (i) {
            rendered += this.EOL;
        }

        if (!this.containers.length) {
            rendered += this.EOL;
        }

        if (this.containers.length && i && tokens[i - 1].type !== 'list_item_open') {
            rendered += this.EOL;
        }

        rendered += this.renderContainer(tokens[i]);

        rendered += '{% cut ';

        return rendered;
    },
    yfm_cut_title_open: function () {
        return '"';
    },
    yfm_cut_title_close: function () {
        let rendered = '" %}';

        rendered += this.EOL;

        return rendered;
    },
    yfm_cut_content_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.EOL;

        rendered += this.renderContainer(tokens[i]);

        return rendered;
    },
    yfm_cut_content_close: function (this: MarkdownRenderer) {
        return this.EOL;
    },
    yfm_cut_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.EOL;

        rendered += this.renderContainer(tokens[i]);

        rendered += '{% endcut %}';

        return rendered;
    },
};

export {cuts};
export default {cuts};
