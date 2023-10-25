import {MarkdownRenderer} from 'src/renderer';
import Token from 'markdown-it/lib/token';

import {initState, link} from 'src/rules/inline/link';

describe('link_open', () => {
    it('is named link_open', () => {
        const handler = link.link_open;

        expect(handler).toBeTruthy();
    });

    it('returns [ for link_open tag', () => {
        const renderer = new MarkdownRenderer({rules: {...link}, initState});

        let handler = link.link_open;
        if (!handler) {
            throw new Error('link_open rule is not implemented');
        }

        handler = handler.bind(renderer);

        const open = new Token('link_open', '', 0);
        const tokens = [open] as Token[];

        const expected = `[`;
        const actual = handler(tokens, 0, {}, {}, renderer);

        expect(actual).toStrictEqual(expected);
    });

    it('puts link_open token onto pending stack', () => {
        const renderer = new MarkdownRenderer({rules: {...link}, initState});

        let handler = link.link_open;
        if (!handler) {
            throw new Error('link_open rule is not implemented');
        }

        handler = handler.bind(renderer);

        const open = new Token('link_open', '', 0);
        const tokens = [open] as Token[];

        handler(tokens, 0, {}, {}, renderer);

        const pending = renderer['state']['link']['pending'].pop();
        expect(pending).toStrictEqual(open);
    });

    it('takes link_open token from pending stack when handling link_close', () => {
        const renderer = new MarkdownRenderer({rules: {...link}, initState});

        let handler = link.link_close;
        if (!handler) {
            throw new Error('link_open rule is not implemented');
        }

        handler = handler.bind(renderer);

        const open = new Token('link_open', '', 0);

        renderer['state']['link']['pending'].push(open);

        const close = new Token('link_close', '', 0);
        const tokens = [close] as Token[];

        handler(tokens, 0, {}, {}, renderer);

        expect(renderer['state']['link']['pending']).toHaveLength(0);
    });
});

describe('link_close', () => {
    it('is named link_close', () => {
        const handler = link.link_close;

        expect(handler).toBeTruthy();
    });

    it('returns ] and (url[ "title"]) for link_close tag', () => {
        const renderer = new MarkdownRenderer({rules: {...link}, initState});

        let handler = link.link_close;
        if (!handler) {
            throw new Error('link_close rule is not implemented');
        }

        handler = handler.bind(renderer);

        const href = 'folder/file.md';
        const title = 'cool file';
        const open = new Token('link_open', '', 0);

        open.attrSet('href', href);
        open.attrSet('title', title);

        const expected = `](${href} "${title}")`;

        renderer['state']['link']['pending'].push(open);

        const close = new Token('link_close', '', 0);
        const tokens = [close] as Token[];
        const actual = handler(tokens, 0, {}, {}, renderer);

        expect(actual).toStrictEqual(expected);
    });
});

describe('link', () => {
    it('renders link with href and title', () => {
        const href = 'folder/file.md';
        const title = 'cool page';
        const open = new Token('link_open', '', 0);
        open.attrSet('href', href);
        open.attrSet('title', title);

        const close = new Token('link_close', '', 0);
        const tokens = [open, close];

        const renderer = new MarkdownRenderer({rules: {...link}, initState});
        const expected = `[](${href} "${title}")`;
        const actual = renderer.render(tokens, {}, {});

        expect(actual).toStrictEqual(expected);
    });

    it('renders link with \' as title markup if title contains "', () => {
        const href = 'folder/file.md';
        const title = 'he said: "quote inside"';
        const open = new Token('link_open', '', 0);
        open.attrSet('href', href);
        open.attrSet('title', title);

        const close = new Token('link_close', '', 0);
        const tokens = [open, close];

        const renderer = new MarkdownRenderer({rules: {...link}, initState});

        const expected = `[](${href} '${title}')`;
        const actual = renderer.render(tokens, {}, {});

        expect(actual).toStrictEqual(expected);
    });

    it('renders link with href', () => {
        const href = 'folder/file.md';
        const open = new Token('link_open', '', 0);
        open.attrSet('href', href);

        const close = new Token('link_close', '', 0);
        const tokens = [open, close];

        const renderer = new MarkdownRenderer({rules: {...link}, initState});
        const expected = `[](${href})`;
        const actual = renderer.render(tokens, {}, {});

        expect(actual).toStrictEqual(expected);
    });

    it('renders empty link', () => {
        const open = new Token('link_open', '', 0);
        const close = new Token('link_close', '', 0);
        const tokens = [open, close];

        const renderer = new MarkdownRenderer({rules: {...link}, initState});
        const expected = `[]()`;
        const actual = renderer.render(tokens, {}, {});

        expect(actual).toStrictEqual(expected);
    });
});
