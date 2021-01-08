export { default as headlong } from "~matyunya/headlong";
import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Sheet from "./Sheet.svelte";

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

export const makeSheetWith = (s, r, i) => sheet({ nRows: rowsCount(i), nCols: colsCount(r), blocks: toBlocks(s), store: s });

export const sheet = ellxify(Sheet);

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

