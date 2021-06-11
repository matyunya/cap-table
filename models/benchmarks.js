import { SYNC_BENCHMARKS } from "/utils/sync.js";
import { defaultBenchmark } from "/utils/mutations/benchmarks.js";
import createConnect from "/models/generic.js";

export default createConnect({
  name: "benchmarks",
  getDefaultItem: defaultBenchmark,
  syncMutation: SYNC_BENCHMARKS,
})
