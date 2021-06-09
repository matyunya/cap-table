import { produce } from "tinyx";
import { serialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";
import { store } from "/store.js";

const {
  activeItemId,
  appId,
  userId,
  isAuthenticated,
  activeEntity,
} = require("/index.ellx");

function getActiveItemRef(collection) {
  return (id) =>
    firebase
      .firestore()
      .collection("apps")
      .doc(appId.get())
      .collection(collection)
      .doc(id);
}

export const getActiveDocRef = getActiveItemRef("files");

export const getActivePlanRef = getActiveItemRef("plans");

const ENTITIES_REFS = {
  plans: getActiveItemRef("plans"),
  documents: getActiveItemRef("files"),
  scenarios: getActiveItemRef("scenarios"),
};

const getRef = (id, name) => ENTITIES_REFS[name](id);

const op = (ref, val) => (val !== undefined ? ref.set(val) : ref.delete(val));

export function syncUp(st, TRANSACTION, payload, id) {
  id = id || activeItemId.get();
  if (id === undefined) {
    throw new Error("Trying to sync undefined item");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  op(getRef(id, activeEntity.get()), val);
}

export function syncItemUp(st, TRANSACTION, payload, id, key) {
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get())[key].get(id));

  op(getRef(id, activeEntity.get()), val);
}

export function getCollection(name) {
  return firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection(name)
    .where("owner", "==", userId.get());
}

export default function createConnect({
  name,
  getDefaultItem = () => {},
  syncMutation,
}) {
  return () => {
    if (isAuthenticated.get() !== true) return;

    return getCollection(name).onSnapshot((querySnapshot) => {
      querySnapshot.empty
        ? getRef(null, name).set(
            serialize({ ...getDefaultItem(), owner: userId.get() }),
            uid()
          )
        : store.commit(syncMutation, querySnapshot);
    });
  };
}
