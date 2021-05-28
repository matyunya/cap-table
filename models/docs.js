import { store, getActiveDocRef } from "/store.js";
import { SYNC_DOCS, serialize } from "/utils/sync.js";
import { defaultDocument } from "/utils/mutations/docs.js";
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
