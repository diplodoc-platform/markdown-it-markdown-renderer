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
    {
        markdown: `
{% list tabs %}

* tab title 1

  tab content
* tab title 2

  tab content

{% endlist %}
`,
        html: '',
        section: 'tabs',
        number: 3,
    },
    {
        markdown: `
{% list tabs %}

- tab 1.1

  1. content 1.1

     {% list tabs %}

     - tab 2.1

       content 2.1

     {% endlist %}

- tab 1.2

  content
- tab 1.3

  content

{% endlist %}
`,
        html: '',
        section: 'tabs',
        number: 4,
    },
    {
        markdown: `
{% list tabs %}

- one

  1. content

     {% list tabs %}

     - one

       content
     - two

       content
     - three

       content

     {% endlist %}

- two

  content

{% endlist %}
`,
        html: '',
        section: 'tabs',
        number: 5,
    },
    {
        markdown: `
{% list tabs group=helloGroup %}

- one

  content
- two

  content

{% endlist %}
`,
        html: '',
        section: 'tabs',
        number: 6,
    },
];

export {tabs};
export default {tabs};
