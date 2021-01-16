import { groupClasses } from "./classes.js";

const reduceSumOfShares = (acc, { investments }) => acc + sum([...investments.values()].map(({ commonShares = 0, votingShares = 0 }) => commonShares + votingShares));

const reduceSumOfCommonShares = (acc, { investments }) => acc + sum([...investments.values()].map(({ commonShares = 0 }) => commonShares));

const reduceSumOfJkissInvested = (acc, { investments }) => acc + sum([...investments.values()].map(({ jkissInvested = 0 }) => jkissInvested));

export const uid = (length = 16) => [...Array(length)].map(() => (Math.random() * 16 | 0).toString(16)).join('');

export const calcShare = (myShare, total) => (myShare * 100 / total).toFixed(1);

export const sum = i => i.reduce((acc, cur) => acc + cur, 0);

export const lastInvestorIdInGroup = search => (res, [investorId, { group }]) => group === search ? investorId : res;

export const totalShares = (rounds) => [...rounds.values()].reduce(reduceSumOfShares, 0);

export const totalCommonShares = (rounds) => [...rounds.values()].reduce(reduceSumOfCommonShares, 0);

export const calcOffset = (cols, idx) => cols.slice(0, idx).reduce((acc, cur) => acc + (cur.colSpan || 1), 0);

const totalJkissShares = (rounds, investorId) => {
  return [...rounds].reduce((acc, [id, { investments, discount, valuationCap }]) => {
    const futureRounds = getFutureRounds(rounds, id);
    const nextRoundResults = futureRounds.size
      ? calcRoundResults(new Map([...rounds, ...futureRounds]), [...futureRounds.keys()][0])
      : false;
    if (!nextRoundResults) return acc;

    return acc + sum([...investments]
      .filter(([id, i]) => i.jkissInvested && investorId ? investorId === id : true)
      .map(([, investment]) => calcJkissShares({
        ...investment,
        discount,
        valuationCap,
        rounds: getPreviousRounds(rounds, id),
        nextRoundResults
      })))
  }, 0);
}

// export const totalShares = (rounds, futureRounds, investorId) => {
//   return totalBasicShares(rounds) + totalJkissShares(rounds, investorId);
// }

export const totalCommonSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + ((investments.get(investorId) || {}).commonShares || 0), 0);

export const totalVotingSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + ((investments.get(investorId) || {}).votingShares || 0), 0);

export const totalSharesForInvestor = (rounds, investorId) => {
  return totalCommonSharesForInvestor(rounds, investorId) + totalVotingSharesForInvestor(rounds, investorId);
}

export const getPreviousRounds = (rounds, id) => {
  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(0, idx + 1));
}

export const getFutureRounds = (rounds, id) => {
  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(idx + 1));
}

export const calcJkissShares = ({ nextRoundResults, valuationCap = 0, jkissInvested = 0, discount = 100 }) => {
  if (!jkissInvested || !nextRoundResults) return 0;

  if (valuationCap > (nextRoundResults.preMoneyDiluted - jkissInvested)) {
    return Math.floor(jkissInvested / (nextRoundResults.sharePrice * discount / 100));
  } else {
    return Math.floor(jkissInvested / nextRoundResults.sharePrice);
  }
}

export const format = {
  number: new Intl.NumberFormat("ja-JA"),
  percent: new Intl.NumberFormat("ja-JA", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  currency: new Intl.NumberFormat("ja-JA", { style: "currency", currency: 'JPY' }),
};

export const allGroups = investors => [...investors.values()].map(i => i.group);

export const uniqueGroups = investors => new Set(allGroups(investors));

function calcGroupRow(investors, group) {
  const investorGroups = allGroups(investors);

  return investorGroups.reduce((acc, cur, i) => {
    if (typeof acc === "number") return acc;

    if (investorGroups[i - 1] === cur) {
      return acc;
    }

    const y = i + 3 + acc.length;

    if (cur === group) return y;

    return [
      ...acc,
      [cur, y],
    ];
  }, []);
}

export function getPosition(investors, id, x, colSpan = 0) {
  const { group } = investors.get(id);
  const y = calcGroupRow(investors, group);
  const idx = [...getGroupInvestors(investors, group).keys()].indexOf(id);

  return [y + idx + 1, x, y + idx + 1, x + colSpan];
}

export const totalInvestorRows = investors => investors.size + (new Set(allGroups(investors))).size;

export function calcRoundResults(r, id) {
  if (r.get(id).type === "j-kiss") return {};

  const rounds = new Map([...r].filter(([, { type }]) => type !== "j-kiss"));

  const roundIds = [...rounds.keys()];
  let prevId = roundIds[roundIds.indexOf(id) - 1];
  const round = rounds.get(id);

  const { sharePrice } = round;

  const prevRoundShares = prevId === undefined ? 0 : totalCommonShares(getPreviousRounds(rounds, prevId));
  const newEquity = reduceSumOfCommonShares(0, round) * sharePrice;
  const preMoney = sharePrice * prevRoundShares;

  const prevTotalRoundShares = prevId === undefined ? 0 : totalShares(getPreviousRounds(rounds, prevId));
  const newEquityDiluted = reduceSumOfShares(0, round) * sharePrice;
  const preMoneyDiluted = sharePrice * prevTotalRoundShares;

  return {
    sharePrice,
    newEquity,
    preMoney,
    postMoney: newEquity + preMoney,
    preMoneyDiluted,
    postMoneyDiluted: preMoneyDiluted + newEquityDiluted,
  };
}

function getAggregateValue(prefix, individualValues, x, y, colSpan, ...options) {
  const [idx] = individualValues[individualValues.length - 1] || [];

  if (!idx) return false;

  return [`${prefix}:${idx}`, {
    position: [y, x, y, x + (colSpan ? colSpan - 1 : 0)],
    value: individualValues.reduce((acc, [k, { value }]) => acc + value, 0),
    ...options[0],
  }];
}

const getGroupInvestors = (investors, group) => new Map([...investors].filter(([, i]) => i.group === group));

function fillEmptyInvestments(round, investors) {
  const investments = [...round.investments];
  const activeInvestorIds = [...round.investments.keys()];
  const inactiveInvestors = [...investors.keys()].filter(id => !activeInvestorIds.includes(id));

  return [...investments, ...inactiveInvestors.map(id => [id, { commonShares: 0, votingShares: 0 }])];
}

export const calcValues = ({
  prevCol,
  round,
  investors,
  id,
  previousRounds,
  futureRounds,
  nextRoundResults,
  cols,
}) => (acc, { onChange, fn, format, classes, colSpan }, i) => {
  if (!fn) return acc;

  const y = prevCol + calcOffset(cols, i) + 1;
  const investments = fillEmptyInvestments(round, investors);
  const individualValues = investments
    .map(fn(investors, previousRounds, futureRounds, nextRoundResults, y, id, colSpan, { onChange, format, classes }));

  const groups = [...uniqueGroups(investors)];

  const groupValues = groups.map(group => {
    const x = calcGroupRow(investors, group)
    const groupInvestors = getGroupInvestors(investors, group);
    const groupInvestorsValues = (investments.filter(([id]) => groupInvestors.has(id)) || [])
      .map(fn(groupInvestors, previousRounds, futureRounds, nextRoundResults, y, id, colSpan, { onChange, format, classes }));

    if (!groupInvestorsValues.length) return false;

    return getAggregateValue("group", groupInvestorsValues, y, x, colSpan, { format, classes: groupClasses + " " + classes });
  }).filter(Boolean);

  return [
    ...acc,
    ...individualValues,
    ...groupValues,

    getAggregateValue("total", individualValues, y, totalInvestorRows(investors) + 3, colSpan, { format, classes: groupClasses + " " + classes }),
  ].filter(Boolean);
}

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const uniqueGroupName = investors => {
  const groups = uniqueGroups(investors);

  const unusedLetter = [...alpha].find(a => !groups.has("Group " + a));

  return "Group " + unusedLetter;
}
