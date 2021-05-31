import { getDefaultTitle, defaultName } from "/utils/intl.js";
import addYears from "date-fns/addYears";
import { uid } from "/utils/index.js";

const { userId } = require("/index.ellx");

export const defaultPlan = (title) => ({
  title: title || defaultName("planTitle"),
  lastViewed: null,
  // sparse map containing user input values, key year -> field -> (projectId) -> value
  data: new Map(),
  dateRange: [new Date(), addYears(new Date(), 5)].map(d => d.getFullYear()),
  projects: new Map([
    ["PR", { title: "主力事業" }],
    ["PR2", { title: "新規事業A" }],
  ]),
});

export function UPDATE_CELL({ year, value, id, projectId }) {
  return ({ set }) => projectId
    ? set("data", year, id, projectId, Number(value))
    : set("data", year, id, Number(value));
}

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

export function RENAME_PROJECT({ projectId, title }) {
  return ({ update }) =>
    update("projects", projectId, "title", (i) => title || i);
}


export function CREATE_PROJECT({ afterId }) {
  return ({ update }) =>
    update("projects", (i) => {
      title = getDefaultTitle(i, "project");

      console.log(i,)

      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;
      const newId = uid();
      const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

      return new Map(newIds.map((id) => [id, i.get(id) || { title }]));
    });
}

export function REMOVE_PROJECT({ id }) {
  return ({ update }) =>
    update("projects", (d) => {
      if (d.size === 1) {
        throw new Error("Cannot delete last project");
      }

      const updated = new Map(d);
      updated.delete(id);
      // TODO: delete from data

      return updated;
    });
}

export function REMOVE_PLAN({ id }) {
  return ({ update }) =>
    update("plans", (d) => {
      if (d.size === 1) {
        throw new Error("Cannot delete last plan");
      }

      const updated = new Map(d);
      updated.delete(id);

      return updated;
    });
}

export function ADD_YEAR() {
  // TODO: allow only at the end
  return ({ update }) => update("dateRange", ([start, end]) => [start, end + 1]);
}

export function REMOVE_YEAR() {
  // TODO: remove data
  return ({ update }) => update("dateRange", ([start, end]) => [start, end - 1]);
}

export function SET_IPO_YEAR({ year }) {
  return ({ set }) => set("ipo", year);
}
