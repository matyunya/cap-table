import bootstrap from "~matyunya/store";
import { uid } from "../utils.js";

const ids = [uid(), uid(), uid(), uid(), uid(), uid(), uid()];

const testStore = {
  // date (Month Year), name, share price, conditions attached
  rounds: new Map([[
    ids[0], // round id
    {
      name: "Founded",
      date: new Date("2014-08-01"),
      type: "founded",
      sharePrice: 1000,
      investments: new Set(), // set of tuples [investor_id, number of acquired shares]
    }
  ]]),

  // name, address, class, acquisition date, #shares,
  // position/relationship with shareholders, note(acquisition price,allocation to third party or purchase)
  investors: new Map([[ids[0], { name: "Founder", group: "Founder" }]]),
};

const testStoreWithRowSpan = {
  rounds: new Map([[
    0,
    {
      name: "Row span test Employee SO round",
      date: new Date("2022-08-01"),
      type: "employee",
      sharePrice: 1000,
      investments: new Set(),
    }
  ]]),
  investors: new Map([[ids[0], { name: "Founder", group: "Founder" }], [ids[1], { name: "Employee 1", group: "Employees" }]]),
};

const testStoreWithShareCalc = {
  rounds: new Map([[
    ids[0],
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
      investments: new Set([[0, 0, 0], [1, 576, 0]]),
    }
  ], [
    2,
    {
      name: "Angel round 1",
      date: new Date("2022-10-01"),
      type: "angel",
      sharePrice: 125000,
      investments: new Set([[0, 0, 0], [1, 0, 0], [2, 120, 0], [3, 40, 0]]),
    }
  ], [
    3,
    {
      name: "Angel round 2",
      date: new Date("2022-12-01"),
      type: "angel",
      sharePrice: 150000,
      investments: new Set([[0, 50, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 50, 0], [5, 150, 0], [6, 220, 0]]),
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
    [6, { name: "Angel 2 3", group: "Angels 2" }]
  ]),
};

export const basicStore = bootstrap(testStore);

export const storeWithRowSpan = bootstrap(testStoreWithRowSpan);

export const shareCalcStore = bootstrap(testStoreWithShareCalc);
