import { select } from "tinyx";
import _ from "/utils/intl.js";
import {
  syncUp,
  store,
} from "/store.js";

import {
  UPDATE_LAST_VIEWED,
} from "/utils/mutations/generic.js";

const { activeItemId, isPlan, isAuthenticated, sheetChanged } = require("/index.ellx");

const getItem = (id) => select(store, () => [isPlan.get() ? "plans" : "documents", id || activeItemId.get()]);

export const syncCurrentItem = (...args) => syncUp(getItem(), ...args);

export const syncItem = (id, ...args) => syncUp(getItem(id), ...args, id);

export const updateLastViewed = () => sheetChanged.subscribe((v) => {
  v &&
    v === activeItemId.get() &&
    !v.startsWith("@@io.ellx.STALE") &&
    isAuthenticated.get() === true &&
    syncCurrentItem(UPDATE_LAST_VIEWED);
})
