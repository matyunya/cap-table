import { select } from "tinyx";
import _ from "/utils/intl.js";
import { store } from "/store.js";
import { syncUp } from "/models/generic.js";

import { UPDATE_LAST_VIEWED } from "/utils/mutations/generic.js";

const {
  activeItemId,
  isAuthenticated,
  sheetChanged,
  activeEntity,
} = require("/index.ellx");

const getItem = (id, entity) =>
  select(store, () => [entity || activeEntity.get(), id]);

export const syncCurrentItem = (...args) =>
  syncUp(getItem(activeItemId.get()), ...args);

export const syncItem = (id, ...args) => syncUp(getItem(id), ...args, id);

export const syncItemForEntity = (id, entity, ...args) =>
  syncUp(getItem(id, entity), ...args, id, entity);

export const updateLastViewed = () =>
  sheetChanged.subscribe((v) => {
    v &&
      v === activeItemId.get() &&
      !v.startsWith("@@io.ellx.STALE") &&
      isAuthenticated.get() === true &&
      syncCurrentItem(UPDATE_LAST_VIEWED);
  });
