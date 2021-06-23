const { userId } = require("/index.ellx");

export const defaultBenchmark = () => ({
  data: new Map(),
});

export function UPDATE_CELL({ key, value }) {
  return ({ set }) => set("data", key, value);
}

export function COPY_BENCHMARK({ from, to }) {
  return ({ set }) => {
    const newBenchmark = from || defaultBenchmark();

    set("benchmarks", to, {
      ...newBenchmark,
      owner: userId.get(),
    });
  };
}

export function REMOVE_BENCHMARK({ id }) {
  return ({ update }) =>
    update("benchmarks", (d) => {
      if (d.size === 1) {
        throw new Error("Cannot delete last scenario");
      }

      const updated = new Map(d);
      updated.delete(id);

      return updated;
    });
}
