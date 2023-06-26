const strikethrough = [
    {
        markdown: `\
strikethrough ~~works~~
`,
        html: '',
        section: 'strikethrough',
        number: 1,
    },
    {
        markdown: `\
    [hello ~~world~~ i'm ~~fine~~](href "hint")
    `,
        html: '',
        section: 'strikethrough',
        number: 2,
    },
];

export {strikethrough};
export default {strikethrough};
