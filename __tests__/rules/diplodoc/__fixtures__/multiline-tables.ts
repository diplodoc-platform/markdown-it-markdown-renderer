const multilineTables = [
    {
        markdown: `\
#|
||
**Header1**
|
**Header2**
||
||
Text
|
Text
||
|#
`,
        html: '',
        section: 'multiline-tables',
        number: 1,
    },
    {
        markdown: `\
#|
||
**Header1**
|
**Header2**
||
||
- unordered list item 1
- unordered list item 2
|
1. ordered list item 1
2. ordered list item 2
   - sub list
||
|#
`,
        html: '',
        section: 'multiline-tables',
        number: 2,
    },
    {
        markdown: `\
paragraph

#|
|||
header
||
||
cell above is empty
|
cell above has header
||
|#
`,
        html: '',
        section: 'multiline-tables',
        number: 3,
    },
    {
        markdown: `\
- hello

  #|
  ||
  header 1
  |
  header 2
  ||
  ||
  content 1
  |
  content 2
  ||
  |#
`,
        html: '',
        section: 'multiline-tables',
        number: 4,
    },
    {
        markdown: `\
content before unordered list

- #|
  ||
  header 1
  - hey
  |
  header 2
  ||
  ||
  content 1
  |
  content 2
  ||
  |#

content after unordered list
1. hello
2. hello

   #|
   ||
   header 1
   - hey
   |
   header 2
   ||
   ||
   content 1
   |
   content 2
   ||
   |#

content after ordered list
`,
        html: '',
        section: 'multiline-tables',
        number: 5,
    },
    {
        markdown: `\
#|
||
1
|
2
||
||
3
|
#|
||
1
|
2
||
||
3
|
4
||
|#
||
|#
`,
        html: '',
        section: 'multiline-tables',
        number: 6,
    },
    {
        markdown: `\
#|
||**Header1**|**Header2**||
||Text|Text||
|#
`,
        expectedMarkdown: `\
#|
||
**Header1**
|
**Header2**
||
||
Text
|
Text
||
|#
`,
        html: '',
        section: 'multiline-tables',
        number: 7,
    },
];

export {multilineTables};
export default {multilineTables};
