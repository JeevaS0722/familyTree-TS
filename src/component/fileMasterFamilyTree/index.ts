// src/index.ts
import CalculateTree from './CalculateTree/CalculateTree';
import createStore from './createStore';
import view from './view/view';
import createSvg from './view/view.svg';
import * as handlers from './handlers';
import * as elements from './elements';
import * as htmlHandlers from './view/view.html.handlers';
import * as icons from './view/elements/Card.icons';
import createChart from './createChart';

import CardSvg from './Cards/CardSvg';
import CardHtml from './Cards/CardHtml';

const fmFamilyTree = {
  CalculateTree,
  createStore,
  view,
  createSvg,
  handlers,
  elements,
  htmlHandlers,
  icons,
  createChart,

  CardSvg,
  CardHtml,
};

export default fmFamilyTree;

// Export individual components for direct imports
export {
  CalculateTree,
  createStore,
  view,
  createSvg,
  handlers,
  elements,
  htmlHandlers,
  icons,
  createChart,
  CardSvg,
  CardHtml,
};
