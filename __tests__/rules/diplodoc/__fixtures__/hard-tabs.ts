const hardTabs = [
    {
        markdown: `\
	console.log('hello');
`,
        expectedMarkdown: `\
    console.log('hello');
`,
        html: '',
        section: 'hard-tabs',
        number: 1,
    },
    {
        markdown: `\
{% list tabs %}

- Tab title

	- list item indented with hard tab
- Nanny

	- list item indented with hard tab
  
{% endlist %}`,
        expectedMarkdown: `\
{% list tabs %}

- Tab title

    - list item indented with hard tab
- Nanny

    - list item indented with hard tab

{% endlist %}
`,
        html: '',
        section: 'hard-tabs',
        number: 2,
    },
];

export {hardTabs};
export default {hardTabs};
