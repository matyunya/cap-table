import bootstrap from "~matyunya/store";
import { select, derived, produce } from "tinyx";
import { serialize } from "/utils/sync.js";
import {
  formatRoundDate,
} from "/utils/index.js";

const { docId, appId } = require("/index.ellx");

export const DEFAULT_LANGUAGE = navigator.languages[0].slice(0, 2);

const defaultNames = {
  docTitle: {
    en: "New table",
    ja: "新しいテーブル",
  },
  founded: {
    en: "Founded",
    ja: "創立",
  },
  founders: {
    en: "Founders",
    ja: "創業メンバー",
  },
  partners: {
    en: "Partners",
    ja: "共同創業者名",
  },
  founder: {
    en: "Founder name",
    ja: "創業者名",
  },
  partner: {
    en: "Partner name",
    ja: "共同創業者名",
  },
  employee: {
    en: "Employee name",
    ja: "従業員名",
  },
  employees: {
    en: "Employee name",
    ja: "従業員",
  },
};

const defaultName = (n) => {
  try {
    return defaultNames[n][language.get()];
  } catch (e) {
    console.error(n, e);

    return "";
  }
};
const founderId = "FOUNDER_ID";

export const defaultDocument = (title) => ({
  title: title || defaultName("docTitle"),
  lastViewed: null,
  rounds: new Map([
    [
      "founded",
      {
        name: defaultName("founded"),
        type: "founded",
        date: formatRoundDate(),
        sharePrice: 1000,
        investments: new Map([
          [founderId, { commonShares: 1000, votingShares: 0 }],
        ]),
      },
    ],
  ]),
  investors: new Map([
    [
      founderId,
      {
        name: defaultName("founder"),
        group: defaultName("founders"),
        type: "founder",
      },
    ],
    [
      "INVESTOR_1",
      { name: defaultName("partner"), group: defaultName("partners") },
    ],
    [
      "INVESTOR_2",
      { name: defaultName("employee"), group: defaultName("partners") },
    ],
  ]),
});

export const defaultPlan = (title) => ({
  title: title || defaultName("planTitle"),
  lastViewed: null,
  years: new Map([
    [
      "founded",
      {
        name: defaultName("founded"),
        type: "founded",
        date: formatRoundDate(),
        sharePrice: 1000,
        investments: new Map([
          [founderId, { commonShares: 1000, votingShares: 0 }],
        ]),
      },
    ],
  ]),
  investors: new Map([
    [
      founderId,
      {
        name: defaultName("founder"),
        group: defaultName("founders"),
        type: "founder",
      },
    ],
    [
      "INVESTOR_1",
      { name: defaultName("partner"), group: defaultName("partners") },
    ],
    [
      "INVESTOR_2",
      { name: defaultName("employee"), group: defaultName("partners") },
    ],
  ]),
});

const defaultStore = {
  profile: {
    language: DEFAULT_LANGUAGE,
    projectedInvestmentTypes: [],
  },
  documents: new Map(),
  plans: new Map(),
};

export const store = bootstrap(defaultStore);

function getActiveItemRef() {
  return id => firebase
    .firestore()
    .collection("apps")
    .doc(appId.get())
    .collection(collection)
    .doc(id);
}

export const getActiveDocRef = getActiveItemRef("files");

export const getActivePlanRef = getActiveItemRef("plans");

export function syncUp(st, TRANSACTION, payload, id) {
  id = id || docId.get();
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  getActiveDocRef(id).set(val);
}

export function syncItemUp(st, TRANSACTION, payload, id, key = "documents") {
  id = id || docId.get();
  if (id === undefined) {
    throw new Error("Trying to sync undefined doc");
  }
  const reducer = produce(TRANSACTION(payload));
  const newDoc = serialize(reducer(st.get())[key].get(id));

  getActiveDocRef(id).set(newDoc);
}

export const language = select(store, () => ["profile", "language"]);

export const userProfile = select(store, () => ["profile"]);

export const documentIds = derived(store, ({ documents }) =>
  [...documents]
    .map(([id, { title, lastViewed }]) => [id, title, lastViewed])
    .sort(([, , a], [, , b]) => b - a)
);

export const planIds = derived(store, ({ plans = new Map() }) =>
  [...plans]
    .map(([id, { title, lastViewed }]) => [id, title, lastViewed])
    .sort(([, , a], [, , b]) => b - a)
);
