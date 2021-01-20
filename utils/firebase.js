import { serialize } from "./sync.js";

export function getAppData({ userId, appId }) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .where('owner', '==', userId);
}

export function getDoc(docId, { appId, collection = 'files' }) {
  console.log("Calling getDoc", { docId, appId, collection });
  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection(collection)
    .doc(docId);
}

export async function addDoc(docId, { userId, appId, collection }, defaultValue = {}) {
  console.log("Trying to add doc", docId, { userId, appId });
  const serialized = serialize(defaultValue);
  return getDoc(docId, { appId, collection }).set({ ...serialized, owner: userId });
}
