import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Sheet from "./Sheet.svelte";
import App from "./App.svelte";
import HomePage from "./HomePage.svelte";

export { store } from "./store.js";
export { roundTypes } from "./actions.js";
import { groupNames } from "./actions.js";
export { calcShare, uid } from "./utils.js";
import { totalInvestorRows } from "./utils.js";

import {
  footerLabels,
  investorNames,
  roundValues,
  colsCount,
  rowsCount,
} from "./selectors.js";

export const makeSheetWith = (s, r, i, login) => ({ nRows: rowsCount(i), nCols: colsCount(r), blocks: toBlocks(s), store: s, login });

export const sheet = ellxify(Sheet);
export const app = ellxify(App);

export const homepage = ellxify(HomePage);

export function toBlocks(store) {
  const investors = store.get('investors');
  const rounds = store.get('rounds');

  return new Map([
    ["ellx-logo", { position: [0,0,2,1], value: "", classes: "flex items-center justify-center" }],
    ...groupNames(investors),
    ...[...investors.keys()].map(investorNames(investors)),
    ...[...rounds.keys()].reduce(roundValues(rounds, investors), [[], 1])[0],
    ...footerLabels(totalInvestorRows(investors) + 3),
  ]);
}

/*
TODOs:

- sticky first col
- router
- drag and drop
- validate round type when adding
- round logic
- prevent empty cell
- global error handler for production
*/
