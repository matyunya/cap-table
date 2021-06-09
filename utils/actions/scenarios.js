import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import _ from "/utils/intl.js";
import { store } from "/store.js";
import { syncItemUp } from "/models/generic.js";

import {
  COPY_SCENARIO,
  REMOVE_SCENARIO,
  UPDATE_SCENARIO_TITLE,
  UPDATE_CELL,
  SET_SCENARIO_SCENARIO_ID,
} from "/utils/mutations/scenarios.js";

import { uid } from "/utils/index.js";

import {
  syncCurrentItem as syncCurrentScenario,
  syncItem as syncScenario,
} from "/utils/actions/generic.js";

export const DEFAULT_TAX = 0.3;

const { userId, route } = require("/index.ellx");

export const updateCell = (params) => syncCurrentScenario(UPDATE_CELL, params);

export const setScenarioPlanId = ({ id }) =>
  syncCurrentScenario(SET_SCENARIO_SCENARIO_ID, { id });

export const renameScenario = ({ detail, id }) =>
  id
    ? syncScenario(id, UPDATE_SCENARIO_TITLE, detail)
    : syncCurrentScenario(UPDATE_SCENARIO_TITLE, detail);

export const createScenario = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_SCENARIO,
    { from: store.get("scenarios", from), to },
    to,
    "scenarios"
  );
};

export const removeScenario = async ({ id }) => {
  const ok = await promptYesNo({
    title: `この株価算定を削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  const ids = [...store.get("scenarios").keys()];
  const idx = ids.indexOf(id);

  syncItemUp(store, REMOVE_SCENARIO, { id }, id, "scenarios");

  if (route.get().startsWith("/scenarios/")) {
    window.ellx.router.go(`/scenarios/${userId.get()}/${ids[idx - 1]}`);
  }
};
