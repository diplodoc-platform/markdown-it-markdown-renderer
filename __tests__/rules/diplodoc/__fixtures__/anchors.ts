const anchors = [
    {
        markdown: `# implicit anchor`,
        section: 'anchors',
        number: 1,
        html: '',
    },
    {
        markdown: `# explicit anchor {#anchor}`,
        section: 'anchors',
        number: 2,
        html: '',
    },
    {
        markdown: `# explicit anchor [link inside header](file.md) {#anchor}`,
        section: 'anchors',
        number: 3,
        html: '',
    },
];

export {anchors};
export default {anchors};
