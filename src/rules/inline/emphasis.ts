import Renderer from 'markdown-it/lib/renderer';

import {basic} from 'src/rules/inline/basic';

const emphasis: Renderer.RenderRuleRecord = {
    em_open: basic,
    em_close: basic,
    strong_open: basic,
    strong_close: basic,
};

export {emphasis};
export default {emphasis};
