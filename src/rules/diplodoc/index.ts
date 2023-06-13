import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';
import {cuts} from './cuts';
import {gfmTables} from './gfm-tables';
import {sup} from './sup';
import {monospace} from './monospace';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
    ...cuts,
    ...gfmTables,
    ...sup,
    ...monospace,
};

export {diplodoc};
export default {diplodoc};
