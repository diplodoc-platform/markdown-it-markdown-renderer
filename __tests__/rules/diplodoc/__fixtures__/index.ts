import {notes} from './notes';
import {cuts} from './cuts';

export type SpecEntry = {
    markdown: string;
    expectedMarkdown?: string;
    section: string;
    number: number;
    html: string;
};

const tests: SpecEntry[] = [...notes, ...cuts];

export {tests};
export default {tests};
