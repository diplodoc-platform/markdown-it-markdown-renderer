import {CustomRendererLifeCycle} from '@diplodoc/markdown-it-custom-renderer';

import {reorderTabs} from './reorderTabs';

const diplodoc = {
    [CustomRendererLifeCycle.BeforeRender]: [reorderTabs],
};

export {diplodoc};
export default {diplodoc};
