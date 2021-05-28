import { getDefaultTitle, defaultName } from "/utils/intl.js";

const { userId } = require("/index.ellx");

export const defaultPlan = (title) => ({
  title: title || defaultName("planTitle"),
  lastViewed: null,
  years: new Map([]),
  projects: new Map([]),
});

export function COPY_PLAN({ from, to }) {
  return ({ set, get }) => {
    const newPlan = from
      ? {
        ...from,
        title: from.title + (language.get() === "ja" ? "コピー" : " copy"),
      }
      : defaultPlan(getDefaultTitle(get("plans"), "planTitle"));

    set("plans", to, {
      ...newPlan,
      owner: userId.get(),
    });
  };
}

export function UPDATE_PLAN_TITLE(value) {
  return ({ set }) => set("title", value);
}

export function UPDATE_LAST_VIEWED() {
  return ({ set }) => set("lastViewed", Date.now());
}

export function REMOVE_PLAN({ id }) {
  return ({ update }) =>
    update("plans", (d) => {
      const updated = new Map(d);
      updated.delete(id);

      return updated;
    });
}
