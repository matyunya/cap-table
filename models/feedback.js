import { uid } from "/utils/index.js";
const { appId, userId } = require("/index.ellx");

export function addFeedback(data) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('feedback')
    .doc(uid())
    .set({
      ...data,
      userId: userId.get(),
      owner: userId.get(),
    });
}
