import ellxify from "~ellx-hub/lib/utils/svelte.js";
import App from "./App.svelte";
import { writable } from "tinyx";
import "/index.css";

export { roundTypes } from "/utils/actions/docs.js";
export {
  uid,
  calcFounderShare,
  uniqueGroups,
  totalShares,
  totalCommonShares,
  fillEmptyInvestments,
} from "/utils/index.js";
export { calculate, groupInvestors, chartData } from "/utils/selectors.js";
export { default as connect } from "/models/docs.js";
export { default as connectProfile } from "/models/profile.js";
export { default as connectPlans } from "/models/plans.js";
export { default as connectScenarios } from "/models/scenarios.js";

import { store } from "/store.js";
export { default as withStatus } from "/utils/withStatus.js";

export { store };

export const app = ellxify(App);

const { auth } = require("/index.ellx");

export const authError = writable(false);

Promise.resolve().then(() =>
  auth.subscribe((v) => authError.set(v instanceof Error))
);

export function getActiveItem(id, route) {
  if (route.startsWith("/docs")) {
    return store.get().documents.get(id);
  }
  if (route.startsWith("/plans")) {
    return store.get().plans.get(id);
  }
  return false;
}

export function getItemIds(items) {
  if (typeof items === "string") return [];

  return [...items]
    .map(([id, { title, lastViewed, ...item }]) => [id, title, lastViewed, item])
    .sort(([, , a], [, , b]) => b - a);
}

export const getYearsRange = (start, stop) =>
  Array.from({ length: stop - start + 1 }, (_, i) => start + i);

export function calcFundingPerYear(years, planDoc, calculated) {
  return Object.fromEntries(
    years.map((year) => [
      year,
      [...planDoc.rounds.keys()]
        .filter(
          (id) => new Date(planDoc.rounds.get(id).date).getFullYear() === year
        )
        .reduce((acc, id) => acc + calculated[id].roundResults.newEquity, 0),
    ])
  );
}

export function getDocPlanId(plans, docId) {
  const [id] = [...plans].find(([, p]) => p.docId === docId) || [];

  return id;
}
