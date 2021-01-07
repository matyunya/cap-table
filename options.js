import { UPDATE_SHARE, UPDATE_SHARE_PRICE } from "./store.js";

import {
  sum,
  totalShares,
  totalCommonShares,
  totalSharesForInvestor,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  format,
  getPosition,
} from "./utils.js";

const calcCell = calcFn =>
  prefix =>
  (investors, rounds, col, id, ...options) =>
  ([investorId, shares, votingShares]) => {
  return [
    `${prefix}:${id}:${investorId}`,
    {
      position: getPosition(investors, investorId, col),
      value: calcFn({ shares, votingShares, rounds, investors, investorId }),
      ...options[0],
    }
  ];
};

const calcSharesPerRound = ({ rounds, investorId }) => {
  const total = totalCommonShares(rounds);
  const previousRoundShares = totalCommonSharesForInvestor(rounds, investorId);

  return previousRoundShares / total;
};

const calcTotalSharesPerRound = ({ rounds, investorId }) => {
  const total = totalShares(rounds);
  const previousRoundShares = totalSharesForInvestor(rounds, investorId);

  return previousRoundShares / total;
};

const calcCommonShares = ({ rounds, investorId }) => totalCommonSharesForInvestor(rounds, investorId);

const calcCommonVotingShares = ({ rounds, investorId }) => totalVotingSharesForInvestor(rounds, investorId);

const calcTotalShares = ({ rounds, investorId }) => totalSharesForInvestor(rounds, investorId);

// TODO: move into a store
export const investorTypes = ['Employees, partners', 'Angel investors 1', 'Angel investors 2', 'J-kiss investor'];

const updateShares = type => (store, { id, value }) => {
  const [, roundId, investorId] = id.split(':').map(Number);
  store.commit(UPDATE_SHARE, { roundId, investorId, shares: Number(value), type });
};

export const updateSharePrice = (store, { id, value }) => {
  const [roundId] = id.split(':').map(Number);
  store.commit(UPDATE_SHARE_PRICE, { roundId, sharePrice: Number(value) });
};

const colTypes = {
  sharesInitial: {
    label: "#shares",
    onChange: updateShares("common"),
    fn: calcCell(({ shares }) => shares)('initial'),
    format: format.number.format,
  },
  shareDiff: {
    label: "share±",
    onChange: updateShares("common"),
    fn: calcCell(({ shares }) => shares)('diff'),
    format: format.number.format,
  },
  sharesAmount: {
    label: "#shares",
    fn: calcCell(calcCommonShares)('amount'),
    format: format.number.format,
  },
  sharesPercent: {
    label: "%shares",
    fn: calcCell(calcSharesPerRound)('percent'),
    format: format.percent.format,
  },
  votingShareDiff: {
    label: "share±",
    hasRowspan: true,
    voting: true,
    fn: calcCell(({ votingShares }) => votingShares || 0)('voting-diff'),
    onChange: updateShares('voting'),
    classes: "text-red-700",
    format: format.number.format,
  },
  votingSharesAmount: {
    label: "#shares",
    hasRowspan: true,
    fn: calcCell(calcCommonVotingShares)('voting-total'),
    classes: "text-red-700",
    format: format.number.format,
  },
  totalSharesAmount: {
    label: "Total #shares",
    fn: calcCell(calcTotalShares)('total-amount'),
    format: format.number.format,
  },
  totalSharesPercent: {
    label: "Total %shares",
    fn: calcCell(calcTotalSharesPerRound)('total-percent'),
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

const genericCols = [
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
    colSpan: genericCols.length,
    cols: genericCols,
  },
  "j-kiss": {
    colSpan: genericCols.length,
    cols: genericCols,
  },
  split: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
  employee: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
  IPO: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
};

export const roundTypes = Object.keys(roundOptions);
