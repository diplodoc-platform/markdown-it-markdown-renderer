# markdown-it-markdown-renderer

This is custom [markdown-it](https://github.com/markdown-it/markdown-it) renderer that aims to provide zero diff with **original markdown** in **most cases** and **exact zero diff** in the case of the **html render**.

supporting syntax from the [commonmark specification](https://spec.commonmark.org/)

## Overview

- [rules](src/rules/README.MD)
- [renderer](src/renderer/README.MD)
- [plugin](src/plugin/README.MD)

## Usage

### Plugin

Plugin interface allows you to configure your markdown-it instance with plugin to
use [renderer](src/renderer/README.MD) to render into **markdown** instead of the **html**.

```
import MarkdownIt from 'markdown-it';

import {MarkdownRendererEnv} from 'src/renderer';
import {mdRenderer} from 'src/plugin';

const md = new MarkdownIt('commonmark', {html: true});

md.use(mdRenderer);
```

Markdown renderer needs additional information parsed from the document

For that reason we require you to provide, `MarkdownRendererEnv` described in the [renderer](src/renderer/README.MD) module.

`source` - is original markdown string split by new lines

```
const markdown = '# Title\nparagraph goes **here**\n- list item one\n- list item two\n';

const env: MarkdownRendererEnv = {source: markdown.split('\n')};

const rendered = md.render(markdown, env);
```

