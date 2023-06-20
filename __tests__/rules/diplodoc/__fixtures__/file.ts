const file = [
    {
        markdown: `\
{% file src="sample-file" name="out.zip" type="application/zip" %}
    `,
        html: '',
        section: 'file',
        number: 1,
    },
    {
        markdown: `\
{% file src="sample-file-without-type" name="out.zip" %}
    `,
        html: '',
        section: 'file',
        number: 2,
    },
    {
        markdown: `\
{% file src="sample-file-empty" %}
    `,
        html: '',
        section: 'file',
        number: 3,
    },
    {
        markdown: `\
{% file type="application/zip" name="out.zip" src="sample-file-reversed" %}
    `,
        html: '',
        section: 'file',
        number: 4,
    },
    {
        markdown: `\
{% file name="out.zip" src="cuts" type="application/zip" %} text {% file name="out.zip" src="cuts" type="application/zip" %}
`,
        html: '',
        section: 'file',
        number: 5,
    },
];

export {file};
export default {file};
