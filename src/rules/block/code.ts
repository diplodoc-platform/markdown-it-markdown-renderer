import {Options} from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

import {MarkdownRenderer, MarkdownRendererEnv} from 'src/renderer';
import {getMap} from 'src/token';

const separate = new Set(['html_block', 'paragraph_close', 'bullet_list_close']);

const code: Renderer.RenderRuleRecord = {
    code_block: function (
        this: MarkdownRenderer,
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        let rendered = '';

        // vertical separation
        if (i) {
            const previous = tokens[i - 1];
            const height = separate.has(previous?.type) ? 2 : 1;
            // previous?.type === 'html_block' ? 2 : 1;

            rendered += this.EOL.repeat(height);
        }

        let indentation = 0;

        // determine indentation
        const [start, end] = getMap(tokens[i]);
        const {source} = env;
        if (source) {
            const [first] = source.slice(start, end);

            const spaces = first.length - first.trimStart().length;

            indentation += spaces > 4 ? 4 : spaces;
        } else {
            indentation += 4;
        }

        const contentLines = tokens[i].content.split('\n');

        if (this.containers.length) {
            for (const line of contentLines) {
                if (line.length) {
                    rendered += this.renderContainer(tokens[i]);
                }

                rendered += line;
                rendered += this.EOL;
            }
        } else {
            for (const line of contentLines) {
                if (line.length) {
                    rendered += this.SPACE.repeat(indentation);
                }

                rendered += line;
                rendered += this.EOL;
            }
        }

        rendered = rendered.trimEnd();

        return rendered;
    },
};

function isCode(token: Token) {
    return token.type === 'code_block';
}

export {code, isCode};
export default {code, isCode};
