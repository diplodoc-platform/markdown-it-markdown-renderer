import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';

const text: Renderer.RenderRuleRecord = {
    text: function (
        this: MarkdownRenderer,
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        let rendered = '';

        if (env.terms) {
            for (const [term, value] of Object.entries(env.terms)) {
                const key = term.slice(1);

                rendered += `[*${key}]: ${value}`;
                rendered += this.EOL.repeat(2);
            }

            delete env.terms;
        }

        rendered += tokens[i].content;

        return rendered;
    },
};

export {text};
export default {text};
