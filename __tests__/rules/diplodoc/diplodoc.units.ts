// @ts-ignore
import MarkdownIt from 'markdown-it';
// @ts-ignore
import notes from '@doc-tools/transform/lib/plugins/notes';

import {MarkdownRendererEnv} from '../../../src/renderer';
import {mdRenderer} from '../../../src/plugin';
import {tests, SpecEntry} from './__fixtures__';

import {normalizeMD} from '../../__helpers__';

const md = new MarkdownIt('commonmark', {html: true});

md.use(notes, {lang: 'en'});
md.use(mdRenderer);

describe('diplodoc', () => {
    tests.forEach(({section, number, markdown, expectedMarkdown}: SpecEntry) => {
        const name = `${section} ${number}`;

        test(name, () => {
            const env: MarkdownRendererEnv = {source: markdown.split('\n')};
            const rendered = normalizeMD(md.render(markdown, env));
            // expected render is the original markdown
            // fallbacks to specified expectedMarkdown fixture
            const expected = normalizeMD(expectedMarkdown ?? markdown);

            expect(rendered).toStrictEqual(expected);
        });
    });
});
