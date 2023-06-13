import Renderer from 'markdown-it/lib/renderer';
import {basic} from 'src/rules/inline/basic';

const monospace: Renderer.RenderRuleRecord = {
    monospace_open: basic,
    monospace_close: basic,
};

export {monospace};
export default {monospace};
