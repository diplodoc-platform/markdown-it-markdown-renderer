import Renderer from 'markdown-it/lib/renderer';

import {basic} from 'src/rules/inline/basic';

const sup: Renderer.RenderRuleRecord = {
    sup_open: basic,
    sup_close: basic,
};

export {sup};
export default {sup};
