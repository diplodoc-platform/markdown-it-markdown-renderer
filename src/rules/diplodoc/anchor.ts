import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';

const anchor: Renderer.RenderRuleRecord = {
    anchor: anchorRule,
};

function anchorRule(tokens: Token[], i: number) {
    const {content} = tokens[i];

    return ` {${content}}`;
}

export {anchor};
export default {anchor};
