import { groupClasses } from "./classes.js";

const reduceSumOfShares = (acc, { investments }) => acc + sum(investments.map(([_, a, b]) => a + b));

const reduceSumOfCommonShares = (acc, { investments }) => acc + sum(investments.map(([_, a]) => a));

export const uid = (length = 16) => [...Array(length)].map(() => (Math.random() * 16 | 0).toString(16)).join('');

export const calcShare = (myShare, total) => (myShare * 100 / total).toFixed(1);

export const sum = i => i.reduce((acc, cur) => acc + cur, 0);

export const lastInvestorIdInGroup = search => (res, [investorId, { group }]) => group === search ? investorId : res;

export const totalShares = (rounds) => [...rounds.values()].reduce(reduceSumOfShares, 0);

export const totalCommonShares = (rounds) => [...rounds.values()].reduce(reduceSumOfCommonShares, 0);

export const totalCommonSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + sum(investments.filter(([id]) => id === investorId).map(([_, i]) => i)
  ), 0);

export const totalVotingSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + sum(investments.filter(([id]) => id === investorId).map(([,, i]) => i)
  ), 0);

export const totalSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + sum(investments.filter(([id]) => id === investorId).map(([_, a, b]) => a + b)
  ), 0);

export const getPreviousRounds = (rounds, id) => {
  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(0, idx + 1));
}

export const format = {
  number: new Intl.NumberFormat("ja-JA"),
  percent: new Intl.NumberFormat("ja-JA", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  currency: new Intl.NumberFormat("ja-JA", { style: "currency", currency: 'JPY' }),
};

export const allGroups = investors => [...investors.values()].map(i => i.group);

export const uniqueGroups = investors => new Set(allGroups(investors));

function calcGroupRow(investors, group) {
  const investorGroups = allGroups(investors).slice(1);

  return investorGroups.reduce((acc, cur, i) => {
    if (typeof acc === "number") return acc;

    if (investorGroups[i - 1] === cur) {
      return acc;
    }

    const y = i + 4 + acc.length;

    if (cur === group) return y;

    return [
      ...acc,
      [cur, y],
    ];
  }, []);
}

export function getPosition(investors, id, x, colSpan = 0) {
  const { group } = investors.get(id);
  const y = group.toLowerCase() === 'founder' ? 2 : calcGroupRow(investors, group);
  const idx = [...getGroupInvestors(investors, group).keys()].indexOf(id);

  return [y + idx + 1, x, y + idx + 1, x + colSpan];
}

export const totalInvestorRows = investors => investors.size + (new Set(allGroups(investors))).size;

export function calcRoundResults(rounds, id) {
  const roundIds = [...rounds.keys()];
  const prevId = roundIds[roundIds.indexOf(id) - 1];
  const { sharePrice, ...round } = rounds.get(id);

  const prevRoundShares = prevId === undefined ? 0 : totalCommonShares(getPreviousRounds(rounds, prevId));
  const newEquity = reduceSumOfCommonShares(0, round) * sharePrice;
  const preMoney = sharePrice * prevRoundShares;

  return {
    sharePrice,
    newEquity,
    preMoney,
    postMoney: newEquity + preMoney,
  };
}

function getAggregateValue(prefix, individualValues, x, y, ...options) {
  const [idx] = individualValues[individualValues.length - 1] || [];

  if (!idx) return false;

  return [`${prefix}:${idx}`, {
    position: [y, x, y, x],
    value: individualValues.reduce((acc, [k, { value }]) => acc + value, 0),
    ...options[0],
  }];
}

const getGroupInvestors = (investors, group) => new Map([...investors].filter(([_, i]) => i.group === group));

function fillEmptyInvestments(round, investors) {
  const investments = [...round.investments];
  const activeInvestorIds = investments.map(([id]) => id);
  const inactiveInvestors = [...investors.keys()].filter(id => !activeInvestorIds.includes(id));

  return [...investments, ...inactiveInvestors.map(id => [id, 0, 0])] || [];
}

export const calcValues = ({
  prevCol,
  round,
  investors,
  previousRounds,
  id,
}) => (acc, { onChange, fn, format, classes }, i) => {
  if (!fn) return acc;

  const y = prevCol + i + 1;

  const investments = fillEmptyInvestments(round, investors);
  const individualValues = investments
    .map(fn(investors, previousRounds, y, id, { onChange, format, classes }));

  const groups = [...uniqueGroups(investors)].slice(1);

  const groupValues = groups.map(group => {
    const x = calcGroupRow(investors, group)
    const groupInvestors = getGroupInvestors(investors, group);
    const groupInvestorsValues = (investments.filter(([id]) => groupInvestors.has(id)) || [])
      .map(fn(groupInvestors, previousRounds, y, id, { onChange, format, classes }));

    if (!groupInvestorsValues.length) return false;

    return getAggregateValue("group", groupInvestorsValues, y, x, { format, classes: groupClasses + " " + classes });
  }).filter(Boolean);

  return [
    ...acc,
    ...individualValues,
    ...groupValues,

    getAggregateValue("total", individualValues, y, totalInvestorRows(investors) + 2, { format }),
  ].filter(Boolean);
}

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const uniqueGroupName = investors => {
  const groups = uniqueGroups(investors);

  const unusedLetter = [...alpha].find(a => !groups.has("Group " + a));

  return "Group " + unusedLetter;
}

export const uniqueRoundName = rounds => {
  const names = new Set([...rounds.values()].map(i => i.name));

  const unusedLetter = [...alpha].find(a => !names.has("Round " + a));

  return "Round " + unusedLetter;
}
