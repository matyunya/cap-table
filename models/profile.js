import { store, language, DEFAULT_LANGUAGE } from "/store.js";
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
  if (!userId.get()) return;

  return getProfileRef()
    .onSnapshot(
      querySnapshot => {
        querySnapshot.empty
          ? updateProfile({
            owner: userId.get(),
            language: language.get() || DEFAULT_LANGUAGE
          })
          : store.commit(SYNC_PROFILE, querySnapshot);
      }
    );
}

export function updateProfile(data, options = { merge: true }) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('profiles')
    .doc(userId.get())
    .set(data, options);
}

export async function loginWithGoogle() {
  const res = await window.ellx.login({ withGoogle: true });

  console.log({ res }) // TODO: save name
}
