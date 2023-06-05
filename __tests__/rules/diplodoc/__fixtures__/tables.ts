const tables = [
    {
        markdown: `\
|Header 1|Header 2|
|-----------|-----------|
|[link text](https://www.google.com)|**bold text**|
|![image text](image.png "hint")|*italics*|
`,
        html: '',
        section: 'tables',
        number: 1,
    },
    {
        markdown: `\
before gfm table
|Header 1|Header 2|
|-----------|-----------|
|[link text](https://www.google.com)|**bold text**|
|![image text](image.png "hint")|*italics*|

after gfm table
`,
        html: '',
        section: 'tables',
        number: 2,
    },
];

export {tables};
export default {tables};
