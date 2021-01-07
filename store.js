import bootstrap from "~matyunya/store";

const defaultStore = {
  rounds: new Map([[
    0,
    {
      name: "Founded",
      date: new Date("2014-08-01"),
      type: "founded",
      sharePrice: 1000,
      investments: new Set([[0, 3000, 0]]),
    },
  ], [
    1,
    {
      name: "Row span test Employee SO round",
      date: new Date("2022-08-01"),
      type: "employee",
      sharePrice: 80000,
      investments: new Set([[1, 0, 576]]),
    }
  ], [
    2,
    {
      name: "Angel round 1",
      date: new Date("2022-10-01"),
      type: "angel",
      sharePrice: 125000,
      investments: new Set([[2, 120, 0], [3, 40, 0]]),
    }
  ], [
    3,
    {
      name: "Angel round 2",
      date: new Date("2022-12-01"),
      type: "angel",
      sharePrice: 150000,
      investments: new Set([[0, 50, 0], [1, 0, 200], [4, 50, 0], [5, 150, 0], [6, 220, 0]]),
    }
  ]
]),
  investors: new Map([
    [0, { name: "Founder", group: "Founder" }],
    [1, { name: "Employee", group: "Employees" }],
    [2, { name: "Angel 1", group: "Angels 1" }],
    [3, { name: "Angel 2", group: "Angels 1" }],
    [4, { name: "Angel 2 1", group: "Angels 2" }],
    [5, { name: "Angel 2 2", group: "Angels 2" }],
    [6, { name: "Angel 2 3", group: "Angels 2" }],
  ]),
};

export const store = bootstrap(defaultStore);

export function UPDATE_SHARE({ roundId, investorId, shares, type = "common" }) {
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
