import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

const imsize: Renderer.RenderRuleRecord = {
    image_close: function (tokens: Token[], i: number) {
        const token = tokens[i];
        if (token?.type !== 'image_close') {
            throw new Error('imsize.ts failed to render image token');
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

        const width = token.attrGet('width');
        const height = token.attrGet('height');
        if ((width?.length || height?.length) && (src?.length || title?.length)) {
            rendered += this.SPACE;
        }

        if (width?.length || height?.length) {
            rendered += '=';
        }

        if (width?.length) {
            rendered += width;
        }

        if (width?.length || height?.length) {
            rendered += 'x';
        }

        if (height?.length) {
            rendered += height;
        }

        rendered += ')';

        return rendered;
    },
};

export {imsize};
export default {imsize};
