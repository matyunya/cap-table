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

const getRef = (id, name) => {
  if (name === "documents") return getActiveItemRef("files")(id);
  return getActiveItemRef(name)(id);
};

const op = (ref, val) => (val !== undefined ? ref.set(val) : ref.delete(val));

export function syncUp(st, TRANSACTION, payload, id, entity) {
  id = id || activeItemId.get(); // error-prone, fix later
  if (id === undefined) {
    throw new Error("Trying to sync undefined item");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  op(getRef(id, entity || activeEntity.get()), val);
}

export function syncItemUp(st, TRANSACTION, payload, id, entity) {
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get())[entity].get(id));

  op(getRef(id, entity), val);
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
      if (querySnapshot.empty) {
        const id = uid();
        getRef(id, name).set(
          serialize({ ...getDefaultItem(), owner: userId.get() }),
          id
        );
      } else {
        store.commit(syncMutation, querySnapshot);
      }
    });
  };
}
