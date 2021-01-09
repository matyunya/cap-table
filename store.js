import bootstrap from "~matyunya/store";
import { uid, lastInvestorIdInGroup, uniqueGroupName, uniqueRoundName } from "./utils.js";

const founderId = uid();

const defaultStore = {
  rounds: new Map([[
    "founded",
    {
      name: "Founded",
      type: "founded",
      sharePrice: 1000,
      investments: new Set([[founderId, 1000, 0]]),
    },
  ]]),
  investors: new Map([
    [founderId, { name: "Founder name", group: "Founder" }],
    [uid(), { name: "Partner 1", group: "Partners" }],
    [uid(), { name: "Employee 1", group: "Partners" }],
  ]),
};

export const store = bootstrap(defaultStore);

export function UPDATE_SHARE({ roundId, investorId, shares, type }) {
  return ({ update }) => update("rounds", roundId, "investments", i => {
    const [, common = 0, voting = 0] = [...(i || [])].find(([id]) => investorId === id) || [];
    const investments = new Set([...(i || [])].filter(([id]) => investorId !== id) || []);

    const updated = [
      investorId,
      type === 'common' ? shares : common,
      type === 'voting' ? shares : voting,
    ]

    investments.add(updated);

    return investments;
  });
}

export function UPDATE_SHARE_PRICE({ roundId, sharePrice }) {
  return ({ update }) => update("rounds", roundId, i => ({ ...i, sharePrice }));
}

export function UPDATE_INVESTOR_NAME({ investorId, name }) {
  return (({ set }) => set("investors", investorId, 'name', name));
}

export function ADD_INVESTOR({ afterId, newGroup = false, group }) {
  return (({ update }) => update("investors", i => {
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
        investments: new Set([...i.investments].filter(notIn([id]))),
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
        investments: new Set([...i.investments].filter(notIn(ids))),
      }]))
    );

    update("investors", i => new Map([...i].filter(notIn(ids))));
  });
}

export function UPDATE_GROUP_NAME({ oldName, newName }) {
  // TODO: disallow renaming into existing group
  return (({ update }) => {
    update("investors", i => new Map([...i].map(([id, investor]) => [id, {
      ...investor,
      group: investor.group === oldName ? newName : investor.group,
    }])));
  });
}

export function ADD_ROUND({ afterId, name, type, sharePrice = 0, investments = new Set() }) {
  return (({ update, apply, get }) => {
    let roundName;

    update('rounds', i => {
      const ids = [...i.keys()];
      const idx = ids.indexOf(afterId) + 1;

      roundName = name || uniqueRoundName(i);

      const newRound = { name: roundName, type, sharePrice, investments };

      const newId = uid();
      const newIds = [...ids.slice(0, idx), newId, ...ids.slice(idx)];

      return new Map(newIds.map(id => [id, i.get(id) || newRound]));;
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
