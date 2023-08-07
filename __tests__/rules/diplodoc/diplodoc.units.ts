// @ts-ignore
import MarkdownIt from 'markdown-it';
// @ts-ignore
import notes from '@doc-tools/transform/lib/plugins/notes';
// @ts-ignore
import cuts from '@doc-tools/transform/lib/plugins/cut';
// @ts-ignore
import monospace from '@doc-tools/transform/lib/plugins/monospace';
// @ts-ignore
import checkbox from '@doc-tools/transform/lib/plugins/checkbox';
// @ts-ignore
import anchors from '@doc-tools/transform/lib/plugins/anchors';
// @ts-ignore
import imsize from '@doc-tools/transform/lib/plugins/imsize';
// @ts-ignore
import file from '@doc-tools/transform/lib/plugins/file';
// @ts-ignore
import tabs from '@doc-tools/transform/lib/plugins/tabs';
// @ts-ignore
import video from '@doc-tools/transform/lib/plugins/video';
// @ts-ignore
import table from '@doc-tools/transform/lib/plugins/table';
// @ts-ignore
import term from '@doc-tools/transform/lib/plugins/term';

// @ts-ignore
import sup from 'markdown-it-sup';

import {MarkdownRendererEnv} from '../../../src/renderer';
import {mdRenderer} from '../../../src/plugin';
import {tests, SpecEntry} from './__fixtures__';

import {normalizeMD} from '../../__helpers__';

const md = new MarkdownIt({html: true});

md.use(notes, {lang: 'en'});
md.use(cuts, {lang: 'en'});
md.use(sup);
md.use(monospace);
md.use(checkbox);
md.use(file);
md.use(anchors, {});
md.use(imsize);
md.use(tabs);
md.use(video);
md.use(table);
md.use(term, {isLintRun: false});

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
