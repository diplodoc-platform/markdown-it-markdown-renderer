import type Renderer from 'markdown-it/lib/renderer';

import {notes} from './notes';
import {cuts} from './cuts';
import {gfmTables} from './gfm-tables';
import {sup} from './sup';
import {monospace} from './monospace';
import {checkbox} from './checkbox';
import {imsize} from './imsize';
import {file} from './file';
import {strikethrough} from './strikethrough';

const diplodoc: Renderer.RenderRuleRecord = {
    ...notes,
    ...cuts,
    ...gfmTables,
    ...sup,
    ...monospace,
    ...checkbox,
    ...imsize,
    ...file,
    ...strikethrough,
};

export {diplodoc};
export default {diplodoc};
