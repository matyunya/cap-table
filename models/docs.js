import { defaultDocument, store, getActiveDocRef } from "/store.js";
import { SYNC_DOCS, serialize } from "/utils/sync.js";
import { uid } from "/utils/index.js";
import { store } from "/store.js";

const { appId, userId } = require("/index.ellx");

function getDocsRef() {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('files')
    .where("owner", "==", userId.get());
}

export function connect() {
  if (!userId.get() || userId.get() instanceof Error) return;

  return getDocsRef()
    .onSnapshot(
      querySnapshot => {
        querySnapshot.empty
          ? updateDoc(serialize({ ...defaultDocument, owner: userId.get() }), uid())
          : store.commit(SYNC_DOCS, querySnapshot)
      }
    );
}

export function getDoc(docId) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('files')
    .doc(docId)
    .then(d => store.commit(() => ({ set }) =>
      set(docId, {
        ...deserialize(d.data()),
        readOnly: true,
      })
    ));
}


export function updateDoc(data) {
  return getActiveDocRef().set(data);
}
