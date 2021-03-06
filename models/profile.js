import { store } from "/store.js";
import { SYNC_PROFILE } from "/utils/sync.js";
import { getCollection } from "/models/generic.js";

const { appId, userId, language } = require("/index.ellx");

export default function connect() {
  if (!userId.get()) return;

  return getCollection("profiles").onSnapshot((querySnapshot) => {
    querySnapshot.empty
      ? updateProfile({
          owner: userId.get(),
          language: language.get(),
        })
      : store.commit(SYNC_PROFILE, querySnapshot);
  });
}

export function updateProfile(data, options = { merge: true }) {
  return firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("profiles")
    .doc(userId.get())
    .set(data, options);
}

export const loginWithGoogle =
  (redirectUrl = "/") =>
  () =>
    window.ellx.login({
      withGoogle: true,
      redirectUrl,
      language: language.get(),
    });
