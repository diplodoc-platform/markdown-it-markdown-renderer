import MarkdownIt from 'markdown-it';
import {mdRenderer} from 'src/plugin';
import {MarkdownRendererEnv} from 'src/renderer';

const md = new MarkdownIt('commonmark', {html: true});
md.use(mdRenderer);

describe('image', () => {
    it('renders image with src and title', () => {
        const markdown = '![](image.png "title")';
        const env: MarkdownRendererEnv = {source: markdown.split('\n')};
        const rendered = md.render(markdown, env);

        expect(rendered).toStrictEqual(markdown);
    });

    it('renders image with \' as title markup if title contains "', () => {
        const markdown = `![](image.png 'title with quote: "Someone said smth"')`;
        const env: MarkdownRendererEnv = {source: markdown.split('\n')};
        const rendered = md.render(markdown, env);

        expect(rendered).toStrictEqual(markdown);
    });

    it('render image with src', () => {
        const markdown = `![](image.png)`;
        const env: MarkdownRendererEnv = {source: markdown.split('\n')};
        const rendered = md.render(markdown, env);

        expect(rendered).toStrictEqual(markdown);
    });

    it('render empty image', () => {
        const markdown = `![]()`;
        const env: MarkdownRendererEnv = {source: markdown.split('\n')};
        const rendered = md.render(markdown, env);

        expect(rendered).toStrictEqual(markdown);
    });

    it('render image with link', () => {
        const markdown = `![[link](file.md)](attention.png "attention")`;
        const env: MarkdownRendererEnv = {source: markdown.split('\n')};
        const rendered = md.render(markdown, env);

        expect(rendered).toStrictEqual(markdown);
    });
});
