import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';
import {cuts} from './cuts';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
    ...cuts,
};

export {diplodoc};
export default {diplodoc};
