const monospace = [
    {
        markdown: `\
monospace ##works##
`,
        html: '',
        section: 'monospace',
        number: 1,
    },
    {
        markdown: `\
##hello, world##
i'm text
##title
##monospace##
this ##is## mono**space** t##e##x##t##, he## he ##he
`,
        html: '',
        section: 'monospace',
        number: 2,
    },
    {
        markdown: `\
[hello ##world## i'm ##fine##](href "hint")
`,
        html: '',
        section: 'monospace',
        number: 3,
    },
];

export {monospace};
export default {monospace};
