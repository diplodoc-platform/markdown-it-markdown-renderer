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
    {
        markdown: `\
> |Header 1|Header 2|
> |-----------|-----------|
> |[link text](https://www.google.com)|**bold text**|
> |![image text](image.png "hint")|*italics*|
`,
        html: '',
        section: 'tables',
        number: 3,
    },
    {
        markdown: `\
- |Header 1|Header 2|
  |-----------|-----------|
  |[link text](https://www.google.com)|**bold text**|
  |![image text](image.png "hint")|*italics*|
- |Header 1|Header 2|
  |-----------|-----------|
  |[link text](https://www.google.com)|**bold text**|
  |![image text](image.png "hint")|*italics*|

  haha
- |Header 1|Header 2|
  |-----------|-----------|
  |[link text](https://www.google.com)|**bold text**|
  |![image text](image.png "hint")|*italics*|
- |Header 1|Header 2|
  |-----------|-----------|
  |[link text](https://www.google.com)|**bold text**|
  |![image text](image.png "hint")|*italics*|
`,
        html: '',
        section: 'tables',
        number: 4,
    },
    {
        markdown: `\
1. |Header 1|Header 2|
   |-----------|-----------|
   |[link text](https://www.google.com)|**bold text**|
   |![image text](image.png "hint")|*italics*|

   text
2. |Header 1|Header 2|
   |-----------|-----------|
   |[link text](https://www.google.com)|**bold text**|
   |![image text](image.png "hint")|*italics*|
3. |Header 1|Header 2|
   |-----------|-----------|
   |[link text](https://www.google.com)|**bold text**|
   |![image text](image.png "hint")|*italics*|
`,
        html: '',
        section: 'tables',
        number: 5,
    },
];

export {tables};
export default {tables};
