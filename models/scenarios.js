import { SYNC_SCENARIOS } from "/utils/sync.js";
import { defaultScenario } from "/utils/mutations/scenarios.js";
import createConnect from "/models/generic.js";

export default createConnect({
  name: "scenarios",
  getDefaultItem: defaultScenario,
  syncMutation: SYNC_SCENARIOS,
})
