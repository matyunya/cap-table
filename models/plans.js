import { defaultPlan, store, getActivePlanRef } from "/store.js";
import { SYNC_DOCS, serialize, deserialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";
import { store } from "/store.js";

const { appId, userId, isAuthenticated } = require("/index.ellx");

function getPlansRef() {
  return firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("plans")
    .where("owner", "==", userId.get());
}

export function connect() {
  if (isAuthenticated.get() !== true) return;

  return getPlansRef().onSnapshot((querySnapshot) => {
    querySnapshot.empty
      ? getActivePlanRef().set(
        serialize({ ...defaultPlan(), owner: userId.get() }),
        uid()
      )
      : store.commit(SYNC_DOCS, querySnapshot);
  });
}

export async function getPlan(id) {
  if (!id) return;

  const doc = firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("plans")
    .doc(id);

  const d = await doc.get();

  return store.commit(
    () =>
      ({ set }) =>
        set("plans", id, deserialize(d.data()))
  );
}
