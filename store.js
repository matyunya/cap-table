import bootstrap from "~matyunya/store";
import { produce } from "tinyx";
import { serialize } from "/utils/sync.js";

const { activeItemId, appId, isPlan } = require("/index.ellx");

export const store = bootstrap({
  profile: {
    language: navigator.languages[0].slice(0, 2),
    projectedInvestmentTypes: [],
  },
  documents: new Map(),
  plans: new Map(),
});

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

const getRef = id => isPlan.get()
  ? getActivePlanRef(id)
  : getActiveDocRef(id);

const op = (ref, val) => val !== undefined ? ref.set(val) : ref.delete(val);

export function syncUp(st, TRANSACTION, payload, id) {
  id = id || activeItemId.get();
  if (id === undefined) {
    throw new Error("Trying to sync undefined item");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  op(getRef(id), val);
}

export function syncItemUp(st, TRANSACTION, payload, id, key) {
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get())[key].get(id));

  op(getRef(id), val);
}
