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
    // TODO: pr into transform to preserve note's map
    // mappings are needed to render content inside other containers
    /*
    {
        markdown: `\
- parent list item

  {% note info "" %}

  - list item one
  - list item two

  {% endnote %}`,
        html: '',
        section: 'notes',
        number: 9,
    },
    */
];

export {notes};
export default {notes};
