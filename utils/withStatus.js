const cells = require("/index.ellx");

export default cellName => {
  const subs = {
    subscribe: subscriber => {
      cells[cellName].subscribe(val => {
        let status = "success";
        if (val instanceof Error) status = "error";
        if (typeof val === "string" && val.startsWith("@@io.ellx.STALE")) status = "stale";
        subscriber(status);
      });
    }
  };
  return () => subs;
}
