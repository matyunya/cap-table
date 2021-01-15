import bootstrap from "~matyunya/store";
import { derived, select } from "tinyx";

import { lastInvestorIdInGroup, uniqueGroupName, uid } from "./utils.js";

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
};

const defaultStore = {
  language: "ja",
  profile: defaultProfile,
  rounds: new Map([[
    "founded",
    {
      name: "Founded",
      type: "founded",
      sharePrice: 1000,
      investments: new Map([[founderId, { commonShares: 1000, votingShares: 0 }]]),
    },
  ]]),
  investors: new Map([
    [founderId, { name: "Founder 1", group: "Founders" }],
    ["INVESTOR_1", { name: "Partner 1", group: "Partners" }],
    ["INVESTOR_2", { name: "Employee 1", group: "Partners" }],
  ]),
};

export const store = bootstrap(defaultStore);

export const isAuthenticated = select(store, () => ["profile", "companyName"]);
export const language = select(store, () => ["language"]);

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

export function UPDATE_VALUATION_CAP({ roundId, investorId, valuationCap }) {
  return ({ update }) => update("rounds", roundId, "investments", investorId, (params = {}) => ({
    ...params,
    valuationCap,
  }))
}

export function UPDATE_DISCOUNT({ roundId, investorId, discount }) {
  return ({ update }) => update("rounds", roundId, "investments", investorId, (params = {}) => ({
    ...params,
    discount,
  }))
}

export function UPDATE_SHARE_PRICE({ roundId, sharePrice }) {
  return ({ update }) => update("rounds", roundId, i => ({ ...i, sharePrice: Number(sharePrice) }));
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
      name: "New investor"
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

export function ADD_ROUND({ afterId, name, type, sharePrice = 0, investments = new Map() }) {
  return (({ update, apply, get }) => {
    let roundName;

    update('rounds', i => {
      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;

      roundName = name || (get("language") === "ja" ? "新しいラウンド" : "New round");

      const newRound = { name: roundName, type, sharePrice, investments };

      const newId = uid();
      const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

      return new Map(newIds.map(id => [id, i.get(id) || newRound]));
    });

    const lastId = [...get('investors').keys()].pop();

    apply(ADD_INVESTOR({ newGroup: true, afterId: lastId, group: roundName }));
  })
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
     email: p.email,
   })));
}

export function SET_LANGUAGE({ language }) {
  return (({ set }) => set("language", language));
}
