import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

const PREFIX = '{% file ';

const ATTRS_MAPPING = new Map<string, string>([
    ['href', 'src'],
    ['download', 'name'],
    ['hreflang', 'lang'],
    ['type', 'type'],
    ['target', 'target'],
    ['rel', 'rel'],
    ['referrerpolicy', 'referrerpolicy'],
]);

function yfmFile(this: MarkdownRenderer, tokens: Token[], i: number) {
    let rendered = '';
    const attrs = tokens[i].attrs || [];

    rendered += PREFIX;

    for (const [key, value] of attrs) {
        if (ATTRS_MAPPING.has(key)) {
            const attr = ATTRS_MAPPING.get(key);

            rendered += `${attr}="${value}" `;
        }
    }

    rendered += '%}';

    return rendered;
}

const file: Renderer.RenderRuleRecord = {
    yfm_file: yfmFile,
};

export {file};
export default {file};
