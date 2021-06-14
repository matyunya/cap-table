import ellxify from "~ellx-hub/lib/utils/svelte.js";
import App from "./App.svelte";
import { writable } from "tinyx";
import "/index.css";

import { store } from "/store.js";

export { roundTypes } from "/utils/actions/docs.js";
export {
  uid,
  calcFounderShare,
  uniqueGroups,
  totalShares,
  totalCommonShares,
  fillEmptyInvestments,
} from "/utils/index.js";
export {
  calculate,
  groupInvestors,
  chartData,
  calcFundingPerYear,
} from "/utils/selectors.js";
export { default as connect } from "/models/docs.js";
export { default as connectProfile } from "/models/profile.js";
export { default as connectPlans } from "/models/plans.js";
export { default as connectScenarios } from "/models/scenarios.js";
export { default as connectBenchmarks } from "/models/benchmarks.js";
export { default as withStatus } from "/utils/withStatus.js";
export { DEFAULT_TAX_RATE } from "/utils/mutations/plans.js";

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
  if (route.startsWith("/scenarios")) {
    return store.get().scenarios;
  }
  return false;
}

export function getItemIds(items) {
  if (typeof items === "string") return [];

  return [...items]
    .map(([id, { title, lastViewed, ...item }]) => [
      id,
      title,
      lastViewed,
      item,
    ])
    .sort(([, , a], [, , b]) => b - a);
}

export const getYearsRange = (start, stop) =>
  Array.from({ length: stop - start + 1 }, (_, i) => start + i);

export function getDocPlanId(plans, docId) {
  const [id] = [...plans].find(([, p]) => p.docId === docId) || [];

  return id;
}

export function getFoundedDates(docs) {
  return Object.fromEntries(
    [...docs.keys()].map((key) => [
      key,
      docs.get(key).rounds.get("founded").date,
    ])
  );
}
