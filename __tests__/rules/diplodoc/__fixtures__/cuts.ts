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
    {
        markdown: `\
- item one

  {% cut "cut title" %}

  content inside cut

  {% endcut %}

  content
`,
        expectedMarkdown: `\
- item one

  {% cut "cut title" %}

  content inside cut

  {% endcut %}
  
  content
`,
        html: '',
        section: 'cuts',
        number: 4,
    },
    {
        markdown: `\
-
  {% cut "cut title" %}

  content inside cut

  {% endcut %}
`,
        html: '',
        section: 'cuts',
        number: 5,
    },
    {
        markdown: `\
1. one
   1. one two

      {% cut "cut title" %}

      content inside cut

      {% endcut %}
2. two
`,
        html: '',
        section: 'cuts',
        number: 6,
    },
    {
        markdown: `\
- {% cut "list cut" %}

  content

  {% endcut %}
`,
        html: '',
        section: 'cuts',
        number: 7,
    },
];

export {cuts};
export default {cuts};
