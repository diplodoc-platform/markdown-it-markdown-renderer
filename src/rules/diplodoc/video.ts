import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {MarkdownRenderer} from 'src/renderer';

type VideoToken = Token & {
    service: string;
    videoID: string;
};

const video: Renderer.RenderRuleRecord = {
    video: function (this: MarkdownRenderer, tokens: Token[], i: number) {
        const {service, videoID} = tokens[i] as VideoToken;

        let rendered = `@[${service}](${videoID})`;

        if (i + 1 === tokens.length) {
            return rendered;
        }

        const next = tokens[i + 1];
        if (next.type === 'text') {
            rendered += this.SPACE;
        }

        return rendered;
    },
};

export {video};
export default {video};
