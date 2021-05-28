import bootstrap from "~matyunya/store";
import { select, derived, produce } from "tinyx";
import { serialize } from "/utils/sync.js";

const { activeItemId, appId, route } = require("/index.ellx");

export const DEFAULT_LANGUAGE = navigator.languages[0].slice(0, 2);

const defaultStore = {
  profile: {
    language: DEFAULT_LANGUAGE,
    projectedInvestmentTypes: [],
  },
  documents: new Map(),
  plans: new Map(),
};

export const store = bootstrap(defaultStore);

function getActiveItemRef(collection) {
  return id => firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection(collection)
    .doc(id);
}

export const getActiveDocRef = getActiveItemRef("files");

export const getActivePlanRef = getActiveItemRef("plans");

export function syncUp(st, TRANSACTION, payload, id) {
  id = id || activeItemId.get();
  if (id === undefined) {
    throw new Error("Trying to sync undefined item");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  if (route.get().startsWith("/docs")) {
    getActiveDocRef(id).set(val); // fix this...
  } else {
    getActivePlanRef(id).set(val);
  }
}

export function syncItemUp(st, TRANSACTION, payload, id, key) {
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get())[key].get(id));

  if (route.get().startsWith("/docs")) {
    getActiveDocRef(id).set(val);
  } else {
    getActivePlanRef(id).set(val);
  }
}

export const language = select(store, () => ["profile", "language"]);

export const userProfile = select(store, () => ["profile"]);

export const documentIds = derived(store, ({ documents }) =>
  [...documents]
    .map(([id, { title, lastViewed }]) => [id, title, lastViewed])
    .sort(([, , a], [, , b]) => b - a)
);

export const planIds = derived(store, ({ plans = new Map() }) =>
  [...plans]
    .map(([id, { title, lastViewed }]) => [id, title, lastViewed])
    .sort(([, , a], [, , b]) => b - a)
);
