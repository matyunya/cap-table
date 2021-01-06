import { UPDATE_SHARE } from "./store.js";

import {
  sum,
  totalShares,
  totalSharesForInvestor,
  format,
  getPosition,
} from "./utils.js";

const calcCell = calcFn =>
  prefix =>
  (investors, rounds, col, id, ...options) =>
  ([investorId, shares]) => {
  return [
    `${prefix}:${id}:${investorId}`,
    {
      position: getPosition(investors, investorId, col),
      value: calcFn({ shares, rounds, investors, investorId }),
      ...options[0],
    }
  ];
};

// const aggregateCell = calcFn =>
//   prefix =>
//   (investors, rounds, col, id, ...options) =>
//   ([investorId, shares]) => {
//   return [
//     `${prefix}${id}:${investorId}`,
//     {
//       position: getPosition(investors, investorId, col),
//       value: calcFn({ shares, rounds, investors, investorId }),
//       ...options[0],
//     }
//   ];
// };

const calcSharesPerRound = ({ rounds, investorId }) => {
  const total = totalShares(rounds);
  const previousRoundShares = totalSharesForInvestor(rounds, investorId);

  return previousRoundShares / total;
};

const calcIndividualShares = ({ rounds, investorId }) => totalSharesForInvestor(rounds, investorId);

// initial for founders or emitted in subsequent rounds
const addedSharesPerRound = calcCell(({ shares }) => shares);

const sharesPercentagePerRound = calcCell(calcSharesPerRound);

const totalIndividualShares = calcCell(calcIndividualShares);

// TODO: move into a store
export const investorTypes = ['Employees, partners', 'Angel investors 1', 'Angel investors 2', 'J-kiss investor'];

const colTypes = {
  sharesInitial: {
    label: "#shares",
    onChange: (store, params) => store.commit(UPDATE_SHARE, params),
    fn: addedSharesPerRound('initial'),
    aggrFn: () => {},
    format: format.number.format,
  },
  shareDiff: {
    label: "share±",
    onChange: (store, params) => store.commit(UPDATE_SHARE, params),
    fn: addedSharesPerRound('diff'),
    format: format.number.format,
  },
  sharesAmount: {
    label: "#shares",
    fn: totalIndividualShares('amount'),
    format: format.number.format,
  },
  sharesPercent: {
    label: "%shares",
    fn: sharesPercentagePerRound('percent'),
    format: format.percent.format,
  },
  votingShareDiff: {
    label: "share±",
    hasRowspan: true,
    voting: true,
//     fn: totalIndividualShares('voting-diff'),
//     format: format.number.format,
  },
  votingSharesAmount: {
    label: "#shares",
    hasRowspan: true,
//     fn: totalIndividualShares('voting-total'),
//     format: format.number.format,
  },
  totalSharesAmount: {
    label: "Total #shares",
    fn: totalIndividualShares('total-amount'),
    format: format.number.format,
  },
  totalSharesPercent: {
    label: "Total %shares",
    fn: sharesPercentagePerRound('total-percent'),
    format: format.percent.format,
  },
};

const {
  sharesInitial,
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent,
} = colTypes;

const foundCols = [sharesInitial, sharesPercent];

const angelCols = [shareDiff, sharesAmount, sharesPercent];

const employeeCols = [
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent
];

const ipoCols = [
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent
];

export const roundOptions = {
  founded: {
    colSpan: foundCols.length,
    cols: foundCols,
  },
  angel: {
    colSpan: angelCols.length,
    cols: angelCols,
  },
  "j-kiss": {
    colSpan: angelCols.length,
    cols: angelCols,
  },
  split: {
    colSpan: angelCols.length,
    cols: angelCols,
  },
  employee: {
    colSpan: employeeCols.length,
    cols: employeeCols,
  },
  IPO: {
    colSpan: ipoCols.length,
    cols: ipoCols,
  },
};

export const roundTypes = Object.keys(roundOptions);
