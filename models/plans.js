import { SYNC_PLANS } from "/utils/sync.js";
import { defaultPlan } from "/utils/mutations/plans.js";
import createConnect from "/models/generic.js";

export default createConnect({
  name: "plans",
  getDefaultItem: defaultPlan,
  syncMutation: SYNC_PLANS,
});

