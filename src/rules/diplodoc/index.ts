import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';
import {cuts} from './cuts';
import {tabs} from './tabs';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
    ...cuts,
    ...tabs,
};

export {diplodoc};
export default {diplodoc};
