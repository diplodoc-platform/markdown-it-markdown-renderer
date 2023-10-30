import MarkdownIt from 'markdown-it';
import {MarkdownRendererEnv} from 'src/renderer';
import {tests} from 'commonmark-spec';

import {mdRenderer} from 'src/plugin';
import {CommonMarkSpecEntry, sections, semantics} from './__fixtures__';
import {normalizeMD} from '__tests__/__helpers__';

const md = new MarkdownIt('commonmark', {html: true});

md.use(mdRenderer);

const units = tests.filter(({section, number}) => {
    if (semantics.has(number)) {
        return false;
    }

    if (!sections.has(section)) {
        return false;
    }

    if (sections.has(number)) {
        return false;
    }

    return true;
});

describe('markdown zero diff', () => {
    units.forEach((entry: CommonMarkSpecEntry) => {
        const {section, number, markdown} = entry;

        const name = `${section} ${number}`;

        test(name, () => {
            // passing array of original markdown string split by new lines
            const env: MarkdownRendererEnv = {source: markdown.split('\n')};
            const rendered = md.render(markdown, env);

            expect(normalizeMD(rendered)).toStrictEqual(normalizeMD(markdown));
        });
    });
});
