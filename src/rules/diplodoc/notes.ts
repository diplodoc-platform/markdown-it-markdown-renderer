import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer} from 'src/renderer';

const notes: Renderer.RenderRuleRecord = {
    yfm_note_open: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        const token = tokens[i];

        let rendered = '';

        if (i) {
            rendered += this.EOL;
        }

        rendered += this.EOL;

        rendered += this.renderContainer(token);

        const type = token.attrGet('note-type');
        if (!type?.length) {
            throw new Error("failed to render note, reason: couldn't find note type");
        }

        rendered += `{% note ${type} `;

        return rendered;
    },
    yfm_note_title_open: function (this: MarkdownRenderer) {
        return '"';
    },
    yfm_note_title_close: function (this: MarkdownRenderer) {
        let rendered = '" %}';

        rendered += this.EOL;

        return rendered;
    },
    yfm_note_close: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        let rendered = '';

        rendered += this.EOL.repeat(2);

        const token = tokens[i];

        rendered += this.renderContainer(token);

        rendered += '{% endnote %}';

        return rendered;
    },
};

export {notes};
export default {notes};
