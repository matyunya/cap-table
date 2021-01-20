import equal from "fast-deep-equal/es6";

const asKV = ([key, value]) => ({ key, value });
const fromKV = ({ key, value }) => [key, value];

function serializeEntry([key, value]) {
  if (value instanceof Map) return ['Map$' + key, [...value].map(serializeEntry).map(asKV)];
  if (value instanceof Set) return ['Set$' + key, [...value].map(serialize)];
  if (Array.isArray(value)) return [key, value.map(serialize)];
  return [key, serialize(value)];
}

export function serialize(value) {
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Map || value instanceof Set || Array.isArray(value)) return serialize({ '[]': value });
  return Object.fromEntries(Object.entries(value).map(serializeEntry));
}

function deserializeEntry([key, value]) {
  if (key.startsWith('Map$')) return [key.slice(4), new Map(value.map(fromKV).map(deserializeEntry))];
  if (key.startsWith('Set$')) return [key.slice(4), new Set(value.map(deserialize))];
  return [key, deserialize(value)];
}

export function deserialize(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return snapshot;
  if (Array.isArray(snapshot)) return snapshot.map(deserialize);

  const obj = Object.fromEntries(Object.entries(snapshot).map(deserializeEntry));
  if ('[]' in obj) return obj['[]'];
  return obj;
}

export function sync(dbRef, store, owner, onInitialSync) {
  let lastLocalState = null;
  let lastRemoteState = null;

  const storeOff = store.subscribe(state => {
    lastLocalState = state;
    if (!lastRemoteState || state === lastRemoteState) return;

    console.log('SYNC: store -> DB', state);
    const newVal = serialize(lastRemoteState = state);
    if (newVal) {
      dbRef.set(newVal);
    } else {
      dbRef.delete();
    }
  });

  const dbOff = dbRef.onSnapshot(doc => {
    if (!doc.exists) {
      console.log('INITIAL SYNC: store -> DB', lastLocalState);
      if (typeof onInitialSync === 'function') onInitialSync(lastLocalState);

      const newVal = serialize(lastRemoteState = lastLocalState);

      if (newVal) {
        dbRef.set({
          userId,
          ...newVal,
        });
      } else {
        dbRef.delete();
      }
      return;
    }

    const state = deserialize(doc.data());
    if (!lastRemoteState && typeof onInitialSync === 'function') onInitialSync(state);

    if (!equal(state, lastRemoteState)) {
      console.log('SYNC: DB -> store', state);
      store.commit(val => ({ update }) => update(v => ({
        ...v,
        ...val,
      })), lastRemoteState = state);
    }
  });

  return () => {
    dbOff();
    storeOff();
  }
}

export function SYNC_DOCS(querySnapshot) {
  return ({ set, remove }) => {
    for (let { type, doc } of querySnapshot.docChanges()) {
      if (type === 'removed') remove("documents", doc.id);
      else set("documents", doc.id, deserialize(doc.data()));
    }
  }
}

export function SYNC_PROFILE(querySnapshot) {
  return ({ set, remove }) => {
    for (let { type, doc } of querySnapshot.docChanges()) {
      if (type === 'removed') remove("profile");
      else set("profile", deserialize(doc.data()));
    }
  }
}
