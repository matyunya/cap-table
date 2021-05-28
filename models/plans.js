import { store, getActivePlanRef } from "/store.js";
import { SYNC_PLANS, serialize } from "/utils/sync.js";
import { defaultPlan } from "/utils/mutations/plans.js";
import { uid } from "/utils/index.js";
import { store } from "/store.js";

const { appId, userId, isAuthenticated } = require("/index.ellx");

function getPlansRef() {
  return firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection("plans")
    .where("owner", "==", userId.get());
}

export function connect() {
  if (isAuthenticated.get() !== true) return;

  return getPlansRef().onSnapshot((querySnapshot) => {
    querySnapshot.empty
      ? getActivePlanRef().set(
        serialize({ ...defaultPlan(), owner: userId.get() }),
        uid()
      )
      : store.commit(SYNC_PLANS, querySnapshot);
  });
}
