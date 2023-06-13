const checkbox = [
    {
        markdown: `\
- [ ] item space
- [x] item cross
- [_] item underscore
`,
        html: '',
        section: 'checkbox',
        number: 1,
    },
    {
        markdown: `\
content before
- [ ] item space
- [x] item cross
- [_] item underscore

content after
`,
        html: '',
        section: 'checkbox',
        number: 2,
    },
    {
        markdown: `\
- parent
  - [ ] item space
  - [x] item cross
  - [_] item underscore
`,
        html: '',
        section: 'checkbox',
        number: 3,
    },
    {
        markdown: `\
[ ] one

[ ] two
`,
        html: '',
        section: 'checkbox',
        number: 4,
    },
];

export {checkbox};
export default {checkbox};
