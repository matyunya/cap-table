import bootstrap from "~matyunya/store";
import { derived, select } from "tinyx";

import { lastInvestorIdInGroup, uniqueGroupName, uniqueRoundName, uid } from "./utils.js";

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
  establishedMonth: "",
  fiscalYearEndMonth: "",
  numberOfEmployees: "",
};

const defaultStore = {
  language: "JA",
  profile: defaultProfile,
  rounds: new Map([[
    "founded",
    {
      name: "Founded",
      type: "founded",
      sharePrice: 1000,
      investments: [[founderId, 1000, 0]],
    },
  ]]),
  investors: new Map([
    [founderId, { name: "Founder name", group: "Founder" }],
    ["INVESTOR_1", { name: "Partner 1", group: "Partners" }],
    ["INVESTOR_2", { name: "Employee 1", group: "Partners" }],
  ]),
};

export const store = bootstrap(defaultStore);

export const isAuthenticated = select(store, () => ["profile", "email"]);
export const language = select(store, () => ["language"]);

export function UPDATE_SHARE({ roundId, investorId, shares, type }) {
  return ({ update }) => update("rounds", roundId, "investments", i => {
    const [, common = 0, voting = 0] = [...(i || [])].find(([id]) => investorId === id) || [];
    const investments = [...(i || [])].filter(([id]) => investorId !== id) || [];

    const updated = [
      investorId,
      type === 'common' ? Number(shares) : common,
      type === 'voting' ? Number(shares) : voting,
    ]

    investments.push(updated);

    return investments;
  });
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
        investments: [...i.investments].filter(notIn([id])),
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
        investments: [...i.investments].filter(notIn(ids)),
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

export function ADD_ROUND({ afterId, name, type, sharePrice = 0, investments = [] }) {
  return (({ update, apply, get }) => {
    let roundName;

    update('rounds', i => {
      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;

      roundName = name || uniqueRoundName(i);

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
