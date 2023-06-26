import Renderer from 'markdown-it/lib/renderer';
import {basic} from 'src/rules/inline/basic';

const strikethrough: Renderer.RenderRuleRecord = {
    s_open: basic,
    s_close: basic,
};

export {strikethrough};
export default {strikethrough};
