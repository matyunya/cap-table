import { defaultDocument, store, docId, getActiveDocRef } from "/store.js";
import { SYNC_DOCS, serialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";

function getDocsRef() {
  const { appId, userId } = ellx.auth() || {};

  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .where("owner", "==", userId);
}

export function connect(onFirstSnapshot = () => {}) {
  let initial = true;
  const { appId, userId } = ellx.auth() || {};

  return getDocsRef()
    .onSnapshot(
      querySnapshot => {
        querySnapshot.empty
          ? updateDoc(serialize({ ...defaultDocument, owner: userId }), uid())
          : store.commit(SYNC_DOCS, querySnapshot)

        if (initial) {
          onFirstSnapshot();
          initial = false;
        }
      }
  );
}

export function updateDoc(data) {
  return getActiveDocRef().set(data);
}
