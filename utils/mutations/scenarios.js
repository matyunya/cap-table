import { getDefaultTitle, defaultName } from "/utils/intl.js";

const { userId, language } = require("/index.ellx");

export const defaultScenario = (title) => ({
  title: title || defaultName("scenarioTitle"),
  // sparse map containing user input values, key -> value
  data: new Map(),
  planId: null,
});

export function UPDATE_CELL({ key, value }) {
  return ({ set }) => set("data", key, Number(value));
}

export function COPY_SCENARIO({ from, to }) {
  return ({ set, get }) => {
    const newPlan = from
      ? {
        ...from,
        title: from.title + (language.get() === "ja" ? "コピー" : " copy"),
      }
      : defaultScenario(getDefaultTitle(get("scenarios"), "scenarioTitle"));

    set("scenarios", to, {
      ...newPlan,
      owner: userId.get(),
    });
  };
}

export function UPDATE_SCENARIO_TITLE(value) {
  return ({ set }) => set("title", value);
}

export function REMOVE_SCENARIO({ id }) {
  return ({ update }) =>
    update("scenarios", (d) => {
      if (d.size === 1) {
        throw new Error("Cannot delete last scenario");
      }

      const updated = new Map(d);
      updated.delete(id);

      return updated;
    });
}

export function SET_SCENARIO_PLAN_ID({ id }) {
  return ({ set }) => set("planId", id);
}
