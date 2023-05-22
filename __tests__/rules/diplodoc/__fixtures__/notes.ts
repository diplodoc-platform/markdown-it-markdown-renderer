const notes = [
    {
        markdown: `\
{% note info %}

note info

{% endnote %}`,
        expectedMarkdown: `\
{% note info "Note" %}

note info

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 1,
    },
    {
        markdown: `\
{% note info %}

note info

{% endnote %}

outside content`,
        expectedMarkdown: `\
{% note info "Note" %}

note info

{% endnote %}

outside content`,
        html: '',
        section: 'notes',
        number: 2,
    },
    {
        markdown: `\
outside content

{% note info %}

note info

{% endnote %}`,
        expectedMarkdown: `\
outside content

{% note info "Note" %}

note info

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 3,
    },
    {
        markdown: `\
{% note tip %}

note tip

{% endnote %}`,
        expectedMarkdown: `\
{% note tip "Tip" %}

note tip

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 4,
    },
    {
        markdown: `\
{% note warning %}

note warning

{% endnote %}`,
        expectedMarkdown: `\
{% note warning "Warning" %}

note warning

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 5,
    },
    {
        markdown: `\
{% note alert %}

note alert

{% endnote %}`,
        expectedMarkdown: `\
{% note alert "Alert" %}

note alert

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 6,
    },
    {
        markdown: `\
{% note info "custom header" %}

note with custom header

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 7,
    },
    {
        markdown: `\
{% note info "" %}

note with empty title

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 8,
    },
    {
        markdown: `\
{% note info "" %}

- list item one
- list item two

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 9,
    },
    {
        markdown: `\
- parent
  - nested list item

    {% note info "" %}

    - list item one
    - list item two

    {% endnote %}`,
        html: '',
        section: 'notes',
        number: 10,
    },
    {
        markdown: `\
1. something 1
   1. other 1

      {% note info "" %}

      - content

      {% endnote %}
   2. other 2
2. something 2`,
        expectedMarkdown: `\
1. something 1
   1. other 1

      {% note info "" %}

      - content

      {% endnote %}


   2. other 2
2. something 2`,
        html: '',
        section: 'notes',
        number: 11,
    },
];

export {notes};
export default {notes};
