import {CustomRendererLifeCycle} from '@diplodoc/markdown-it-custom-renderer';

import {image} from './image';
import {mapTabsIntoUnorderedLists, reorderTabs} from './diplodoc';

const hooks = {
    [CustomRendererLifeCycle.BeforeRender]: [reorderTabs, mapTabsIntoUnorderedLists, image],
};

export {hooks};
export default {hooks};
