const asKV = ([key, value]) => ({ key, value });
const fromKV = ({ key, value }) => [key, value];

function serializeEntry([key, value]) {
  if (value instanceof Map)
    return ["Map$" + key, [...value].map(serializeEntry).map(asKV)];
  if (value instanceof Set) return ["Set$" + key, [...value].map(serialize)];
  if (Array.isArray(value)) return [key, value.map(serialize)];
  return [key, serialize(value)];
}

export function serialize(value) {
  if (!value || typeof value !== "object") return value;
  if (value instanceof Map || value instanceof Set || Array.isArray(value))
    return serialize({ "[]": value });
  return Object.fromEntries(Object.entries(value).map(serializeEntry));
}

function deserializeEntry([key, value]) {
  if (typeof key === "number") return [key, deserialize(value)];
  if (key.startsWith("Map$"))
    return [key.slice(4), new Map(value.map(fromKV).map(deserializeEntry))];
  if (key.startsWith("Set$"))
    return [key.slice(4), new Set(value.map(deserialize))];
  return [key, deserialize(value)];
}

export function deserialize(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return snapshot;
  if (Array.isArray(snapshot)) return snapshot.map(deserialize);

  const obj = Object.fromEntries(
    Object.entries(snapshot).map(deserializeEntry)
  );
  if ("[]" in obj) return obj["[]"];
  return obj;
}

function syncRootItem(name) {
  return (querySnapshot) => {
    return ({ set, remove }) => {
      for (let { type, doc } of querySnapshot.docChanges()) {
        if (type === "removed") {
          remove(name, doc.id);
        } else {
          set(name, doc.id, deserialize(doc.data()));
        }
      }
    };
  }
}

export const SYNC_DOCS = syncRootItem("documents");

export const SYNC_PLANS = syncRootItem("plans");

export function SYNC_PROFILE(querySnapshot) {
  return ({ set, remove }) => {
    for (let { type, doc } of querySnapshot.docChanges()) {
      if (type === "removed") remove("profile");
      else
        set("profile", {
          ...deserialize(doc.data()),
          loaded: true,
        });
    }
  };
}
