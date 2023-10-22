const imsize = [
    {
        markdown: `\
paragraph with ![image text](file.md "image alt" =100x) that has only width specified
`,
        section: 'imsize',
        number: 1,
        html: '',
    },
    {
        markdown: `\
paragraph with ![image text](file.md "image alt" =x200) that has only height specified
`,
        section: 'imsize',
        number: 2,
        html: '',
    },
    {
        markdown: `\
paragraph with ![image text](file.md "image alt" =100x200) that has both width and height
`,
        section: 'imsize',
        number: 3,
        html: '',
    },
    {
        markdown: `\
paragraph with ![image text](file.md "image alt")
`,
        section: 'imsize',
        number: 4,
        html: '',
    },
    {
        markdown: `\
paragraph with ![image text](file.md)
`,
        section: 'imsize',
        number: 5,
        html: '',
    },
    {
        markdown: `\
paragraph with ![[one](one.md)](file.md)
`,
        section: 'imsize',
        number: 6,
        html: '',
    },
];

export {imsize};
export default {imsize};
