const tabs = [
    {
        markdown: `\
{% list tabs %}

- tab-title-1

  tab 1 text

{% endlist %}
`,
        html: '',
        section: 'tabs',
        number: 1,
    },
    {
        markdown: `
{% list tabs %}

- tab-title-1

  tab 1 text
  - hello
    
    hey hey
- tab-title-2

  tab 2 text

{% endlist %}

[link text](file.md "link title")

{% list tabs %}

- tab-tab-title-1

  tab tab 1 text

{% endlist %}

text after
`,
        html: '',
        section: 'tabs',
        number: 2,
    },
];

export {tabs};
export default {tabs};
