const tabs = [
    {
        markdown: `\
{% list tabs %}

- Название таба1

    Текст таба1.

    * Можно использовать списки.
    * И **другую** разметку.

- Название таба2

    Текст таба2.

- Название таба3

    Текст таба3.

{% endlist %}
        `,
        expectedMarkdown: `\
{% note info "Note" %}

note info

{% endnote %}`,
        html: '',
        section: 'notes',
        number: 1,
    },
];

export {tabs};
export default {tabs};
