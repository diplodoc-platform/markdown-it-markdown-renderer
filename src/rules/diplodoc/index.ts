import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';
import {cuts} from './cuts';
import {gfmTables} from './gfm-tables';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
    ...cuts,
    ...gfmTables,
};

export {diplodoc};
export default {diplodoc};
