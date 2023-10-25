import type MarkdownIt from 'markdown-it';

import {MarkdownRenderer, MarkdownRendererParams} from 'src/renderer';

// helpers
// always evaluate to provided value <v>
const always = (v: boolean) => () => v;
// always return input value <a> as a result
const id = (a: string) => a;

function mdRenderer(parser: MarkdownIt, parameters?: MarkdownRendererParams) {
    // disable escape rule
    parser.inline.ruler.at('escape', always(false));
    // disable entity rule
    parser.inline.ruler.at('entity', always(false));
    // disable links normalization
    // eslint-disable-next-line no-param-reassign
    parser.normalizeLink = id;

    const options = {
        ...parameters,
    };

    const renderer = new MarkdownRenderer(options);

    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    parser.renderer = renderer;
}

export {mdRenderer};
export default {mdRenderer};
