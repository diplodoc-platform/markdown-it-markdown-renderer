import Renderer from 'markdown-it/lib/renderer';
import {MarkdownRenderer} from 'src/renderer';
import Token from 'markdown-it/lib/token';

export type ImageState = {
    image: {
        pending: Array<Token>;
    };
};

const initState = () => ({
    image: {
        pending: new Array<Token>(),
    },
});

const image: Renderer.RenderRuleRecord = {
    image: function (this: MarkdownRenderer<ImageState>, tokens: Token[], i: number, options, env) {
        const img = tokens[i];

        this.state.image.pending.push(img);

        const open = new Token('image_open', '', 0);

        const close = new Token('image_close', '', 0);

        const children = img.children ?? [];

        return this.renderInline([open, ...children, close], options, env);
    },
    image_open: function (this: MarkdownRenderer) {
        return '![';
    },
    image_close: function (this: MarkdownRenderer<ImageState>) {
        const token = this.state.image.pending.pop();
        if (token?.type !== 'image') {
            throw new Error('failed to render image token');
        }

        let rendered = '](';

        const src = token.attrGet('src');
        if (src?.length) {
            rendered += src;
        }

        const title = token.attrGet('title');
        if (title?.length) {
            if (src?.length) {
                rendered += ' ';
            }

            const markup = title.indexOf('"') === -1 ? '"' : "'";

            rendered += `${markup}${title}${markup}`;
        }

        rendered += ')';

        return rendered;
    },
};

export {image, initState};
export default {image, initState};
