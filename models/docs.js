import { defaultDocument, store, getActiveDocRef } from "/store.js";
import { SYNC_DOCS, serialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";
const { appId, userId } = require("/index.ellx");

function getDocsRef() {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('files')
    .where("owner", "==", userId.get());
}

export function connect() {
  return getDocsRef()
    .onSnapshot(
      querySnapshot => {
        querySnapshot.empty
          ? updateDoc(serialize({ ...defaultDocument, owner: userId.get() }), uid())
          : store.commit(SYNC_DOCS, querySnapshot)
      }
  );
}

export function updateDoc(data) {
  return getActiveDocRef().set(data);
}
