import bootstrap from "~matyunya/store";
import { select, derived, produce } from "tinyx";
import { serialize } from "/utils/sync.js";

import {
  lastInvestorIdInGroup,
  uniqueGroupName,
  uid,
  convertReactiveRounds,
  calcRoundResults,
  formatRoundDate,
} from "/utils/index.js";

const { docId, userId, appId } = require("/index.ellx");

const DEFAULT_LANGUAGE = navigator.languages[0].slice(0, 2);

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
    ja: "創業メンバー"
  },
  partners: {
    en: "Partners",
    ja: "パートナー"
  },
};

const defaultName = n => defaultNames[n][DEFAULT_LANGUAGE];

const founderId = "FOUNDER_ID";

export const defaultDocument = {
  title: defaultName("docTitle"),
  lastViewed: null,
  rounds: new Map([[
    "founded",
    {
      name: defaultName("founded"),
      type: "founded",
      date: formatRoundDate(),
      sharePrice: 1000,
      investments: new Map([[founderId, { commonShares: 1000, votingShares: 0 }]]),
    },
  ]]),
  investors: new Map([
    [founderId, { name: "Founder 1", group: defaultName("founders"), type: "founder" }],
    ["INVESTOR_1", { name: "Partner 1", group: defaultName("partners") }],
    ["INVESTOR_2", { name: "Employee 1", group: defaultName("partners") }],
  ]),
};

const defaultStore = {
  profile: {
    language: DEFAULT_LANGUAGE,
  },
  documents: new Map(),
};

export const store = bootstrap(defaultStore);

export function getActiveDocRef(id) {
  return firebase.firestore()
    .collection('apps')
    .doc(appId.get())
    .collection('files')
    .doc(id || docId.get())
}

export function syncUp(st, TRANSACTION, payload, id) {
  const reducer = produce(TRANSACTION(payload));
  const val = serialize(reducer(st.get()));

  getActiveDocRef(id).set(val);
};

export function syncDocumentUp(st, TRANSACTION, payload, id) {
  const reducer = produce(TRANSACTION(payload));
  const newDoc = serialize(reducer(st)).documents[id];

  getActiveDocRef(id).set(newDoc);
};

export const language = select(store, () => ["profile", "language"]);

export const userProfile = select(store, () => ["profile"]);

export const documentIds = derived(store, ({ documents }) => [...documents].map(([id, { title, lastViewed }]) => [id, title, lastViewed]));

export function UPDATE_SHARE({ roundId, investorId, shares, type }) {
  return ({ update }) => update("rounds", roundId, "investments", investorId, ({ commonShares = 0, votingShares = 0, ...params } = {}) => {
    return {
      ...params,
      commonShares: type === 'common' ? Number(shares) : commonShares,
      votingShares: type === 'voting' ? Number(shares) : votingShares,
    };
  });
}

export function UPDATE_JKISS_INVESTED({ roundId, investorId, jkissInvested }) {
  return ({ update }) => update("rounds", roundId, "investments", investorId, (params = {}) => ({
    ...params,
    jkissInvested,
  }))
}

export function UPDATE_VALUATION_CAP({ roundId, value }) {
  return ({ set }) => set("rounds", roundId, "valuationCap", Number(value));
}

export function UPDATE_DISCOUNT({ roundId, value }) {
  return ({ set }) => set("rounds", roundId, "discount", Number(value));
}

export function UPDATE_SHARE_PRICE({ roundId, sharePrice }) {
  return ({ set }) => set("rounds", roundId, "sharePrice", Number(sharePrice));
}

export function UPDATE_SPLIT_BY({ roundId, value }) {
  return ({ update, get }) => update("rounds", roundId, r => {
    const rounds = convertReactiveRounds(get("rounds"), get("investors"));
    const roundIds = [...rounds.keys()];
    const prevId = roundIds[roundIds.indexOf(roundId) - 1];
    const prevSharePrice = rounds.get(prevId).sharePrice;

    return {
      ...r,
      sharePrice: prevSharePrice / value,
      splitBy: Number(value),
    };
  });
}

export function UPDATE_INVESTOR_NAME({ investorId, name }) {
  return (({ update }) => update("investors", investorId, 'name', i => name || i));
}

export function UPDATE_INVESTOR_TITLE({ investorId, title }) {
  return (({ update }) => update("investors", investorId, 'title', i => title || i));
}

export function ADD_INVESTOR({ afterId, newGroup = false, group }) {
  return (({ update }) => update("investors", i => {
    if (newGroup && group && [...i.values()].find(g => g.group === group)) {
      group = uniqueGroupName(i); // prevent group name clashes
    }

    const ids = [...i.keys()];
    const lastId = newGroup ? [...i].reduce(lastInvestorIdInGroup(i.get(afterId).group), "") : afterId;
    const idx = ids.indexOf(lastId) + 1;

    const newInvestor = {
      group: group || (newGroup ? uniqueGroupName(i) : i.get(afterId).group),
      name: (language.get() === "ja" ? "投資家名" : "New investor"),
    };

    const newId = uid();
    const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

    return new Map(newIds.map(id => [id, i.get(id) || newInvestor]));
  }));
}

const notIn = ids => ([i]) => !ids.includes(i);

export function REMOVE_INVESTOR({ id }) {
  return (({ update }) => {
    update(
      "rounds",
      r => new Map([...r].map(([roundId, i]) => [roundId, {
        ...i,
        investments: new Map([...i.investments].filter(notIn([id]))),
      }]))
    );

    update("investors", i => new Map([...i].filter(notIn([id]))));
  });
}

export function REMOVE_GROUP({ group }) {
  return (({ update, get }) => {
    const ids = [...get('investors')].filter(([, i]) => i.group === group).map(([id]) => id);

    update(
      "rounds",
      r => new Map([...r].map(([roundId, i]) => [roundId, {
        ...i,
        investments: new Map([...i.investments].filter(notIn(ids))),
      }]))
    );

    update("investors", i => new Map([...i].filter(notIn(ids))));
  });
}

export function UPDATE_GROUP_NAME({ oldName, newName }) {
  return (({ update }) => {
    update("investors", i => {
      if (!newName || [...i.values()].find(g => g.group === newName)) {
        return new Map(i);
      }

      return new Map([...i].map(([id, investor]) => [id, {
        ...investor,
        group: investor.group === oldName ? newName : investor.group,
      }]));
    });
  });
}

export function ADD_ROUND({ afterId, name, type, sharePrice = 0, investments = new Map(), newId, ...params }) {
  return (({ update, apply, get }) => {
    let roundName;

    update('rounds', i => {
      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;

      roundName = name || (language.get() === "ja" ? "新しいラウンド" : "New round");

      let newRound = { name: roundName, type, date: formatRoundDate(), sharePrice, investments, ...params };

      if (type === "j-kiss") {
        newRound.discount = 20;
        newRound.valuationCap = calcRoundResults(get("rounds"), afterId).postMoney * 2;
      }

      newId = newId || uid();
      const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

      return new Map(newIds.map(id => [id, i.get(id) || newRound]));
    });

    const lastId = [...get('investors').keys()].pop();

    apply(ADD_INVESTOR({ newGroup: true, afterId: lastId, group: roundName }));
  });
}

export function ADD_SPLIT_ROUND({ afterId, splitBy }) {
  return (({ apply, get }) => {
    const rounds = convertReactiveRounds(get("rounds"), get("investors"));
    const prevSharePrice = rounds.get(afterId).sharePrice;

    apply(
      ADD_ROUND({
        afterId,
        type: "split",
        name: "Split",
        splitBy,
        sharePrice: prevSharePrice / splitBy,
        investments: new Map(),
      })
    );
  });
}

export function REMOVE_ROUND({ id }) {
  if (id === 'founded') {
    throw new Error('Cannot delete founded round');
  }

  return (({ update }) => update('rounds', i => new Map([...i].filter(([i]) => i !== id))))
}

export function RENAME_ROUND({ roundId, name }) {
  return (({ set }) => set('rounds', roundId, 'name', name));
}

export function UPDATE_ROUND_DATE({ roundId, date }) {
  return (({ set }) => set('rounds', roundId, 'date', date));
}

export function UPDATE_PROFILE({ profile }) {
  return (({ update }) => update('profile', p => ({
    ...profile,
    language: p.language,
    email: p.email,
  })));
}

export function SET_LANGUAGE({ language }) {
  return (({ set }) => set("profile", "language", language));
}

export function TOGGLE_PUBLIC() {
  return (({ update }) => update("access", (access = {}) => ({
    read: { public: !(access.read || {}).public },
  })));
}

export function SET_DOCUMENT({ id, data }) {
  return (({ set }) => set("documents", id, data));
}

export function COPY_DOCUMENT({ from, to }) {
  return ({ set, get }) => {
    const newDoc = from ? {
      ...from,
      title: from.title + (language.get() === "ja" ? "コピー" : " copy")
    } : defaultDocument;

    set("documents", to, {
      ...newDoc,
      owner: userId.get(),
    });
  };
}

export function UPDATE_DOCUMENT_TITLE(value) {
  return ({ set }) => set("title", value);
}

export function UPDATE_LAST_VIEWED() {
  return ({ set }) => set("lastViewed", Date.now());
}

export function RESET_DOCUMENT() {
  return ({ set }) => set({
    ...defaultDocument,
    owner: userId.get(),
  });
}

export function REMOVE_DOCUMENT({ id }) {
  return ({ update }) => update("documents", d => {
    if (d.size === 1) {
      throw new Error("Cannot delete last document");
    }

    const updated = new Map(d);

    updated.delete(id);

    return updated;
  })
}
