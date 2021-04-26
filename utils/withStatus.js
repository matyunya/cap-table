export default function statusCell(getter) {
  function get() {
    try {
      const val = getter();
      if (typeof val === "string" && val.startsWith("@@io.ellx.STALE")) {
        return ["...", "stale"];
      }

      console.log('CALLLEDTTT?', typeof val, val instanceof Error, { val });

      if (val instanceof Error) {
        return [val, "error"];
      }

      return [val, "success"];
    } catch (e) {
      return [e, "error"];
    }
  }

  return {
    get,
    subscribe(subscriber) {
      const val = get();
      subscriber(val);

      return () => { }
    }
  }
}
