import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
};

export {diplodoc};
export default {diplodoc};
