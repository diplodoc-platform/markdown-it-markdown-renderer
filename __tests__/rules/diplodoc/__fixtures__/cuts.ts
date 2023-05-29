const cuts = [
    {
        markdown: `\
{% cut "cut's title" %}

content

{% endcut %}
`,
        html: '',
        section: 'cuts',
        number: 1,
    },
    {
        markdown: `\
{% cut "" %}

content

{% endcut %}
`,
        html: '',
        section: 'cuts',
        number: 2,
    },
    {
        markdown: `\
content before cut

{% cut "" %}

content inside cut

{% endcut %}

content after cut
`,
        html: '',
        section: 'cuts',
        number: 3,
    },
];

export {cuts};
export default {cuts};
