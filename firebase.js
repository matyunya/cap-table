import { serialize } from "./sync.js";

export function getAppData({ userId, appId }) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .where('owner', '==', userId);
}

export function getDoc(docId, { appId }) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId)
    .collection('files')
    .doc(docId);
}

export async function addDoc(docId, { userId, appId }, defaultValue = {}) {
  console.log("Trying to add doc", docId, { userId, appId });
  const serialized = serialize(defaultValue);
  return getDoc(docId, { appId }).set({ ...serialized, owner: userId });
}
