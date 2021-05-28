import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import { select } from "tinyx";
import _ from "/utils/intl.js";
import {
  syncUp,
  syncItemUp,
  store,
} from "/store.js";

import {
  COPY_PLAN,
  REMOVE_PLAN,
  UPDATE_PLAN_TITLE,
} from "/utils/mutations/plans.js";

import {
  uid,
} from "/utils/index.js";

const { activeItemId, userId, route } = require("/index.ellx");

const getPlan = (id) => select(store, () => ["plans", id || activeItemId.get()]);

export const syncCurrentPlan = (...args) => syncUp(getPlan(), ...args);

export const syncPlan = (id, ...args) => syncUp(getPlan(id), ...args, id);

export const renamePlan = ({ detail, id }) =>
  id
    ? syncPlan(id, UPDATE_PLAN_TITLE, detail)
    : syncCurrentPlan(UPDATE_PLAN_TITLE, detail);

export const createPlan = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_PLAN,
    { from: store.get("plans", from), to },
    to,
    "plans",
  );

  window.ellx.router.go(`/plans/${userId.get()}/${to}`);
};

export const removePlan = async ({ id }) => {
  const ok = await promptYesNo({
    title: `この事業計画を削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  const ids = [...store.get("plans").keys()];
  const idx = ids.indexOf(id);

  syncUp(store, REMOVE_PLAN, { id }, id);

  if ((route.get() || "").startsWith("/plans/")) {
    window.ellx.router.go(`/plans/${userId.get()}/${ids[idx - 1]}`);
  }
};
