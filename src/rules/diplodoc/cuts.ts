import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';
// import {isList} from 'src/rules/block/list';

const cuts: Renderer.RenderRuleRecord = {
    yfm_cut_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        if (i) {
            rendered += this.EOL;
        }

        rendered += this.EOL;

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
    yfm_cut_content_open: function (this: MarkdownRenderer) {
        return this.EOL;
    },
    yfm_cut_content_close: function (this: MarkdownRenderer) {
        return this.EOL;
    },
    yfm_cut_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.EOL;

        rendered += '{% endcut %}';

        rendered += this.EOL;

        if (i + 1 !== tokens.length) {
            rendered += this.EOL;
        }

        return rendered;
    },
};

export {cuts};
export default {cuts};
