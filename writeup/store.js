import bootstrap from "~matyunya/store";
import { uid } from "../utils.js";

const founderId = uid();

const testStore = {
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
  ]),
};

const testStoreWithRowSpan = {
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
    [uid(), { name: "Partner 1", group: "Employees 1" }],
    [uid(), { name: "Employee 1", group: "Employees 1" }],
  ]),
};

const testStoreWithShareCalc = {
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
    [uid(), { name: "Partner 1", group: "Employees 2" }],
    [uid(), { name: "Employee 1", group: "Employees 2" }],
  ]),
};

export const basicStore = bootstrap(testStore);

export const storeWithRowSpan = bootstrap(testStoreWithRowSpan);

export const shareCalcStore = bootstrap(testStoreWithShareCalc);
