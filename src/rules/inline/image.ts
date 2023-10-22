import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

const image: Renderer.RenderRuleRecord = {
    image: function () {
        return '';
    },
    image_open: function () {
        return '![';
    },
    image_close: function (tokens: Token[], i: number) {
        const token = tokens[i];
        if (token?.type !== 'image_close') {
            throw new Error('image.ts failed to render image token');
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

export {image};
export default {image};
