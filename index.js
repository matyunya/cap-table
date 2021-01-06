import ellxify from "~ellx-hub/lib/utils/svelte.js";
import RoundResults from "./RoundResults.svelte";
import Sheet from "./Sheet.svelte";
import i from "~ellx-hub/lib/components/Input/index.js";

import "/index.css";

export { default as output } from "~matyunya/output";
export { default as slider } from "~ellx-hub/lib/components/Slider/index.js";
export { default as select } from "~ellx-hub/lib/components/Select/index.js";
export { default as button } from "~ellx-hub/lib/components/Button/index.js";

export {
  basicStore,
  storeWithRowSpan,
  shareCalcStore,
} from "./store.js";

export {
  investorTypes,
  roundTypes,
} from "./options.js";

export {
  calcShare,
  uid
} from "./utils.js";

import { totalInvestorRows, groupNames } from "./utils.js";

import {
  footerLabels,
  investorNames,
  roundValues,
} from "./selectors.js";

export {
  colsCount,
  rowsCount,
} from "./selectors.js";

export const input = props => i({ size: 4, ...props });

export const roundResults = ellxify(RoundResults);

export const sheet = ellxify(Sheet);

export const testBlocks = new Map([[0, { position: [0,0,0,0], value: "test"}]]);

export const testBlocksWithStyle = new Map([[0, { position: [0,1,0,0], value: "test", classes: "font-bold text-center bg-gray-200" }]]);

export function toBlocks(investors, rounds) {
  return new Map([
    ...groupNames(investors),
    ...[...investors.keys()].map(investorNames(investors)),
    ...[...rounds.keys()].reduce(roundValues(rounds, investors), [[], 0])[0],
    ...footerLabels(totalInvestorRows(investors) + 3),
  ]);
}
