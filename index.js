import ellxify from "~ellx-hub/lib/utils/svelte.js";
import App from "./App.svelte";
import { writable } from "tinyx";
import "/index.css";

export { roundTypes, updateLastViewed } from "/utils/actions/docs.js";
export {
  uid,
  calcFounderShare,
  uniqueGroups,
  totalShares,
  totalCommonShares,
  fillEmptyInvestments
} from "/utils/index.js";
export { calculate, groupInvestors, chartData } from "/utils/selectors.js";
export { connect } from "/models/docs.js";
export { connect as connectProfile } from "/models/profile.js";
export { connect as connectPlans } from "/models/plans.js";
export { store } from "/store.js";
export { default as withStatus } from "/utils/withStatus.js";

export const app = ellxify(App);

const { auth } = require("/index.ellx");

export const authError = writable(false);

Promise.resolve().then(() => auth.subscribe(v => authError.set(v instanceof Error)));
