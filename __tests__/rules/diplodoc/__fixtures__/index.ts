import {notes} from './notes';
import {cuts} from './cuts';
import {tables} from './tables';
import {sup} from './sup';

export type SpecEntry = {
    markdown: string;
    expectedMarkdown?: string;
    section: string;
    number: number;
    html: string;
};

const tests: SpecEntry[] = [...notes, ...cuts, ...tables, ...sup];

export {tests};
export default {tests};
