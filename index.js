import ellxify from "~ellx-hub/lib/utils/svelte.js";
import App from "./App.svelte";

export { roundTypes } from "/utils/actions.js";
export {
  uid,
  calcFounderShare,
  uniqueGroups,
  totalShares,
  totalCommonShares,
  fillEmptyInvestments,
} from "/utils/index.js";
export { calculate } from "/utils/selectors.js";
export { default as router } from "/utils/router.js";

export const app = ellxify(App);

export { store } from "/store.js";

export function groupInvestors(groups, investors) {
  return [...groups].reduce((acc, group) => [
    ...acc,
    { isGroup: true, label: group, id: group },
    ...[...investors.keys()].filter(id => investors.get(id).group === group).map(id => ({
      id,
      label: investors.get(id).name,
      group,
    }))
  ], []);
}
