import {notes} from './notes';
import {cuts} from './cuts';
import {tables} from './tables';
import {sup} from './sup';
import {monospace} from './monospace';
import {checkbox} from './checkbox';
import {anchors} from './anchors';

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
];

export {tests};
export default {tests};
