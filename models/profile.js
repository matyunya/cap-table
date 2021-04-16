import { defaultProfile, store } from "/store.js";
import { SYNC_PROFILE } from "/utils/sync.js";
const { appId, userId } = require("/index.ellx");

function getProfileRef() {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('profiles')
    .where("owner", "==", userId.get());
}

export function connect() {
  return getProfileRef()
    .onSnapshot(
      querySnapshot => {
        querySnapshot.empty
          ? updateProfile({ ...defaultProfile, owner: userId.get() })
          : store.commit(SYNC_PROFILE, querySnapshot);
      }
  );
}

export function updateProfile(data, options = {}) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('profiles')
    .doc(userId.get())
    .set(data, options);
}
