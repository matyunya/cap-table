import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import _ from "/utils/intl.js";
import { store } from "/store.js";
import { syncItemUp } from "/models/generic.js";

import {
  COPY_BENCHMARK,
  REMOVE_BENCHMARK,
  UPDATE_CELL,
} from "/utils/mutations/benchmarks.js";
import { uid } from "/utils/index.js";
import { syncItemForEntity } from "/utils/actions/generic.js";

export const updateCell = (id, params) =>
  syncItemForEntity(id, "benchmarks", UPDATE_CELL, params);

export const createBenchmark = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_BENCHMARK,
    { from: store.get("benchmarks", from), to },
    to,
    "benchmarks"
  );
};

export const removeBenchmark = async ({ id }) => {
  const ok = await promptYesNo({
    title: `この株価算定を削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  syncItemUp(store, REMOVE_BENCHMARK, { id }, id, "benchmarks");
};
