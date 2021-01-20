import { defaultDocument, store, getActiveDocId } from "/store.js";
import { SYNC_DOCS, serialize } from "/utils/sync.js";

function getDocsRef() {
  const { appId, userId } = ellx.auth() || {};

  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .where("owner", "==", userId);
}

export function connect() {
  const { appId, userId } = ellx.auth() || {};

  return getDocsRef()
    .onSnapshot(
      querySnapshot => querySnapshot.empty
        ? updateDoc(serialize({ ...defaultDocument, owner: userId }), "DOC_0")
        : store.commit(SYNC_DOCS, querySnapshot)
  );
}

export function getActiveDocRef(docId) {
  docId = docId || getActiveDocId();

  const { appId, userId } = ellx.auth() || {};

  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .doc(docId)
}

export function updateDoc(data) {
  return getActiveDocRef().set(data);
}
