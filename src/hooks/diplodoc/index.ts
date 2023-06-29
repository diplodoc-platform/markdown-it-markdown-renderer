import {CustomRendererLifeCycle} from '@diplodoc/markdown-it-custom-renderer';

import {reorderTabs} from './reorderTabs';
import {mapTabsIntoUnorderedLists} from './mapTabsIntoUnorderedLists';

const diplodoc = {
    [CustomRendererLifeCycle.BeforeRender]: [reorderTabs, mapTabsIntoUnorderedLists],
};

export {diplodoc};
export default {diplodoc};
