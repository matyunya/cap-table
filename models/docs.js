import { defaultDocument, store, getActiveDocRef } from "/store.js";
import { SYNC_DOCS, serialize, deserialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";
import { store } from "/store.js";

const { appId, userId, isAuthenticated } = require("/index.ellx");

function getDocsRef() {
  return firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("files")
    .where("owner", "==", userId.get());
}

export function connect() {
  if (isAuthenticated.get() !== true) return;

  return getDocsRef().onSnapshot((querySnapshot) => {
    querySnapshot.empty
      ? getActiveDocRef().set(
          serialize({ ...defaultDocument(), owner: userId.get() }),
          uid()
        )
      : store.commit(SYNC_DOCS, querySnapshot);
  });
}

export async function getDoc(docId) {
  if (!docId) return;

  const doc = firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("files")
    .doc(docId);

  const d = await doc.get();

  return store.commit(
    () =>
      ({ set }) =>
        set("documents", docId, deserialize(d.data()))
  );
}
