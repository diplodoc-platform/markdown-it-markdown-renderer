import {notes} from './notes';
import {cuts} from './cuts';
import {tabs} from './tabs';

export type SpecEntry = {
    markdown: string;
    expectedMarkdown?: string;
    section: string;
    number: number;
    html: string;
};

const tests: SpecEntry[] = [...tabs];

export {tests};
export default {tests};
