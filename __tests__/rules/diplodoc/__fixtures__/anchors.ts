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
    {
        markdown: '# header {#anchor1} {#anchor2}',
        section: 'anchors',
        number: 4,
        html: '',
    },
    {
        markdown: '# header {#anchor1} {#anchor2} {#anchor3}',
        section: 'anchors',
        number: 5,
        html: '',
    },
];

export {anchors};
export default {anchors};
