import {notes} from './notes';
import {cuts} from './cuts';
import {tables} from './tables';
import {sup} from './sup';
import {monospace} from './monospace';
import {checkbox} from './checkbox';
import {anchors} from './anchors';
import {imsize} from './imsize';
import {file} from './file';
import {strikethrough} from './strikethrough';
import {tabs} from './tabs';
import {video} from './video';
import {multilineTables} from './multiline-tables';
import {term} from './term';
import {hardTabs} from './hard-tabs';

export type SpecEntry = {
    markdown: string;
    expectedMarkdown?: string;
    section: string;
    number: number;
    html: string;
};

const tests: SpecEntry[] = [
    ...notes,
    ...cuts,
    ...tables,
    ...sup,
    ...monospace,
    ...checkbox,
    ...anchors,
    ...imsize,
    ...file,
    ...strikethrough,
    ...tabs,
    ...video,
    ...multilineTables,
    ...term,
    ...hardTabs,
];

export {tests};
export default {tests};
