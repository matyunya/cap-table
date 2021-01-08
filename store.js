import bootstrap from "~matyunya/store";
import { uid } from "./utils.js";

const [ID_0, ID_1] = [uid(), uid()];

const defaultStore = {
  rounds: new Map([[
    ID_0,
    {
      name: "Founded",
      date: new Date("2014-08-01"),
      type: "founded",
      sharePrice: 1000,
      investments: new Set([[ID_0, 3000, 0]]),
    },
  ]]),
  investors: new Map([
    [ID_0, { name: "Founder", group: "Founder" }],
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

export function ADD_INVESTOR({ afterId, group }) {
  return (({ update }) => update("investors", i => {
    const ids = [...i.keys()];
    const idx = ids.indexOf(afterId) + 1;

    console.log({ afterId, group });


    const newInvestor = {
      group: group || i.get(afterId).group,
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
  return (({ update }) => {
    update("investors", i => new Map([...i].map(([id, investor]) => [id, {
      ...investor,
      group: investor.group === oldName ? newName : investor.group,
    }])));
  });
}
