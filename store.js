import { writable } from "svelte/store";
import bootstrap from "~matyunya/store";
import { select, derived } from "tinyx";

import {
  lastInvestorIdInGroup,
  uniqueGroupName,
  uid,
  convertJkissToCommonShares,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  getPreviousRounds,
} from "./utils.js";

export const docId = writable("DOC_0");
export const user = writable({
  userId: null,
  appId: null
});

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

export const defaultProfile = {
  companyName: "",
  title: "",
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  zipCode: "",
  address: "",
  url: "",
  email: "",
  phone: "",
  language: DEFAULT_LANGUAGE,
};

const defaultDocument = {
  title: defaultName("docTitle"),
  rounds: new Map([[
    "founded",
    {
      name: defaultName("founded"),
      type: "founded",
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
  profile: defaultProfile,
  documents: new Map([[
    "DOC_0", defaultDocument,
  ]]),
};

export const store = bootstrap(defaultStore);

export const isAuthenticated = select(store, () => ["profile", "companyName"]);

export const language = select(store, () => ["profile", "language"]);

export const documentIds = derived(store, ({ documents }) => [...documents].map(([id, { title }]) => [id, title]));

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
    const rounds = convertJkissToCommonShares(get("rounds"));
    const roundIds = [...rounds.keys()];
    const prevId = roundIds[roundIds.indexOf(roundId) - 1];
    const prevSharePrice = rounds.get(prevId).sharePrice;

    return {
      ...r,
      sharePrice: prevSharePrice / value,
      splitBy: Number(value),
      investments: calcSplitByInvestments(getPreviousRounds(rounds, prevId), get("investors"), Number(value)),
    };
  });
}

export function UPDATE_INVESTOR_NAME({ investorId, name }) {
  return (({ update }) => update("investors", investorId, 'name', i => name || i));
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

export function ADD_ROUND({ afterId, name, type, sharePrice = 0, investments = new Map(), ...params }) {
  return (({ update, apply, get }) => {
    let roundName;

    update('rounds', i => {
      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;

      roundName = name || (language.get() === "ja" ? "新しいラウンド" : "New round");

      const newRound = { name: roundName, type, sharePrice, investments, ...params };

      const newId = uid();
      const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

      return new Map(newIds.map(id => [id, i.get(id) || newRound]));
    });

    const lastId = [...get('investors').keys()].pop();

    apply(ADD_INVESTOR({ newGroup: true, afterId: lastId, group: roundName }));
  });
}

function calcSplitByInvestments(rounds, investors, splitBy) {
  return new Map([...investors.keys()].map(id => {
    const commonShares = totalCommonSharesForInvestor(rounds, id);
    const votingShares = totalVotingSharesForInvestor(rounds, id);

    return [id, {
      commonShares: commonShares ? commonShares + commonShares * (splitBy - 2) : 0,
      votingShares: votingShares ? votingShares + votingShares * (splitBy - 2) : 0,
    }];
  }));
}

export function ADD_SPLIT_ROUND({ afterId, name, sharePrice = 0, splitBy }) {
  return (({ apply, get }) => {
    const rounds = convertJkissToCommonShares(get("rounds"));
    const prevSharePrice = rounds.get(afterId).sharePrice;

    apply(
      ADD_ROUND({
        afterId,
        type: "split",
        name: "Split",
        splitBy,
        sharePrice: prevSharePrice / splitBy,
        investments: calcSplitByInvestments(getPreviousRounds(rounds, afterId), get("investors"), splitBy),
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

export function RENAME_ROUND({ id, name }) {
   return (({ set }) => set('rounds', id, 'name', name));
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
    read: { public: access.read ? !access.read.public : true }
  })));
}

export function SET_DOCUMENT({ id, data }) {
  return (({ set }) => set("documents", id, data));
}

export function COPY_DOCUMENT({ from, to }) {
  return ({ set, get }) => {
    const newDoc = from ? {
      ...get("documents", from),
      title: get("documents", from).title + (language.get() === "ja" ? "コピー" : " copy")
    } : defaultDocument;

    set("documents", to, newDoc)
  };
}

export function UPDATE_DOCUMENT_TITLE({ value }) {
  return ({ set }) => set("title", value);
}

export function RESET_DOCUMENT() {
  return ({ set }) => set(defaultDocument);
}

export function REMOVE_DOCUMENT({ id }) {
  return ({ update }) => update("documents", d => {
    if (d.size === 1) {
      throw new Error("Cannot delete last document");
    }

    if (id === "DOC_0") {
      throw new Error("Cannot delete initial document"); // Allow when routing works
    }

    const updated = new Map(d);

    updated.delete(id);

    return updated; // TODO: sync deletion?
  })
}
