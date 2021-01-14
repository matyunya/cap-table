import { UPDATE_SHARE, UPDATE_SHARE_PRICE, UPDATE_GROUP_NAME, REMOVE_GROUP, ADD_INVESTOR, RENAME_ROUND } from "./store.js";

import {
  firstColClasses,
  groupClasses,
} from "./classes.js";

import {
  totalShares,
  totalCommonShares,
  totalSharesForInvestor,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  format,
  getPosition,
  allGroups,
  lastInvestorIdInGroup,
} from "./utils.js";

export function groupNames(investors) {
  const investorGroups = allGroups(investors);

  return investorGroups.reduce((acc, cur, i) => {
    if (investorGroups[i - 1] === cur) {
      return acc;
    }

    const y = i + 3 + acc.length;

    return [
      ...acc,
      // Three label rows
      [
        `group-label:${cur}:${i}`,
        {
          position: [y, 0, y, 1],
          value: cur,
          classes: groupClasses + " " + firstColClasses,
          onChange: (store, { value }) => {
            store.commit(UPDATE_GROUP_NAME, { oldName: cur, newName: value });
          },
          menuItems: (store, { id }) => [
            {
              text: "New group",
              cb: () => {
                store.commit(
                  ADD_INVESTOR,
                  {
                    newGroup: true,
                    afterId: [...store.get('investors')].reduce(lastInvestorIdInGroup(id.split(':')[1]), "")
                  }
                )
              },
            },
            {
              text: "Remove",
              cb: () => store.commit(REMOVE_GROUP, { group: id.split(':')[1] }),
            },
          ],
        }
      ],
    ];
  }, []);
}

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

const updateShares = type => (store, { id, value }) => {
  const [, roundId, investorId] = id.split(":");
  store.commit(UPDATE_SHARE, { roundId, investorId, shares: Number(value), type });
};

export const renameRound = (store, { id, value }) => {
  const [, roundId] = id.split(":");
  console.log(roundId, id);
  store.commit(RENAME_ROUND, { id: roundId, name: value });
};

export const updateSharePrice = (store, { id, value }) => {
  const [roundId] = id.split(":");
  store.commit(UPDATE_SHARE_PRICE, { roundId, sharePrice: Number(value) });
};

const colTypes = {
  sharesInitial: {
    label: "#shares",
    onChange: updateShares("common"),
    fn: calcCell(({ shares }) => shares)("initial"),
    format: format.number.format,
  },
  shareDiff: {
    label: "share±",
    onChange: updateShares("common"),
    fn: calcCell(({ shares }) => shares)("diff"),
    format: format.number.format,
  },
  sharesAmount: {
    label: "#shares",
    fn: calcCell(calcCommonShares)("amount"),
    format: format.number.format,
  },
  sharesPercent: {
    label: "%shares",
    fn: calcCell(calcSharesPerRound)("percent"),
    format: format.percent.format,
  },
  votingShareDiff: {
    label: "share±",
    hasRowspan: true,
    voting: true,
    fn: calcCell(({ votingShares }) => votingShares || 0)("voting-diff"),
    onChange: updateShares("voting"),
    format: format.number.format,
  },
  votingSharesAmount: {
    label: "#shares",
    hasRowspan: true,
    fn: calcCell(calcCommonVotingShares)("voting-total"),
    format: format.number.format,
  },
  totalSharesAmount: {
    label: "Total #shares",
    fn: calcCell(calcTotalShares)("total-amount"),
    format: format.number.format,
  },
  totalSharesPercent: {
    label: "Total %shares",
    fn: calcCell(calcTotalSharesPerRound)("total-percent"),
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
  common: {
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
  preferred: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
};

export const roundTypes = Object.keys(roundOptions);
