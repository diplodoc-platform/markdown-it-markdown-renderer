import {Options} from 'markdown-it';
import Token from 'markdown-it/lib/token';
import {MarkdownRendererEnv} from 'src/renderer';

const anchors = {
    heading_open: function (
        tokens: Token[],
        i: number,
        options: Options,
        env: MarkdownRendererEnv,
    ) {
        const {source} = env;
        if (!source?.length) {
            throw new Error(
                'failed to render anchors, provide split by new line source as environment',
            );
        }

        const next = tokens[i + 1];
        if (next.type !== 'inline') {
            return '';
        }

        if (!next.children) {
            next.children = [];
        }

        const anchorLinkStartIdx = next.children.findIndex(({type}) => type === 'link_open');
        const anchorLinkEndtIdx = next.children.findIndex(({type}) => type === 'link_close');
        if (anchorLinkEndtIdx !== -1 && anchorLinkStartIdx !== -1) {
            next.children.splice(anchorLinkStartIdx, anchorLinkEndtIdx - anchorLinkStartIdx + 1);
        }

        const [row] = tokens[i].map ?? [];
        // eslint-disable-next-line eqeqeq, no-eq-null
        if (row == null) {
            throw new Error('failed to render anchor, no line mapping on header');
        }

        const line = source[row];
        if (!line?.length) {
            throw new Error('failed to render anchor, incorrect source or line mapping');
        }

        const anchor = source[row].match(/\{#([^{]+)\}/gimu);
        if (!anchor?.length) {
            return '';
        }

        const anchorToken = new Token('text', '', 0);
        anchorToken.content = ` ${anchor[anchor.length - 1]}`;

        next.children.push(anchorToken);

        return '';
    },
};

export {anchors};
export default {anchors};
