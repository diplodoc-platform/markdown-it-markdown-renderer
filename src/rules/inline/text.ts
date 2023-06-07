import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

const text: Renderer.RenderRuleRecord = {
    text: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        if (tokens[i].hidden) {
            return '';
        }

        return tokens[i].content;
    },
};

export {text};
export default {text};
