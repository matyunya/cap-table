import addMonths from "date-fns/addMonths";
import isAfter from "date-fns/isAfter";
import startOfMonth from "date-fns/startOfMonth";
import isEqual from "date-fns/isEqual";
import formatDate from "date-fns/format";

const firstDayOfMonth = startOfMonth(new Date());

export const getClosestRoundToNow = (rounds) =>
  [...rounds]
    .map(([id, r]) => [new Date(r.date).getTime(), id])
    .sort(([a], [b]) => a - b)
    .find(
      ([date]) =>
        isAfter(date, firstDayOfMonth) || isEqual(date, firstDayOfMonth)
    )[1];

const reduceSumOfShares = (acc, { investments }) =>
  acc +
  sum(
    [...investments.values()].map(
      ({ commonShares = 0, votingShares = 0 }) => commonShares + votingShares
    )
  );

const reduceSumOfCommonShares = (acc, { investments }) =>
  acc +
  sum([...investments.values()].map(({ commonShares = 0 }) => commonShares));

export const uid = (length = 16) =>
  [...Array(length)]
    .map(() => ((Math.random() * 16) | 0).toString(16))
    .join("");

export const sum = (i) => i.reduce((acc, cur) => acc + cur, 0);

export const lastInvestorIdInGroup =
  (search) =>
  (res, [investorId, { group }]) =>
    group === search ? investorId : res;

export const totalShares = (rounds) =>
  rounds.size ? [...rounds.values()].reduce(reduceSumOfShares, 0) : 0;

export const totalCommonShares = (rounds) =>
  rounds.size ? [...rounds.values()].reduce(reduceSumOfCommonShares, 0) : 0;

export const totalCommonSharesForInvestor = (rounds, investorId) =>
  [...rounds.values()].reduce(
    (acc, { investments }) =>
      acc + ((investments.get(investorId) || {}).commonShares || 0),
    0
  );

export const totalVotingSharesForInvestor = (rounds, investorId) =>
  [...rounds.values()].reduce(
    (acc, { investments }) =>
      acc + ((investments.get(investorId) || {}).votingShares || 0),
    0
  );

export const totalSharesForInvestor = (rounds, investorId) => {
  return (
    totalCommonSharesForInvestor(rounds, investorId) +
    totalVotingSharesForInvestor(rounds, investorId)
  );
};

export const formatRoundDate = (d) =>
  formatDate(new Date(d || new Date()), "yyyy/MM");

export const getPreviousRounds = (rounds, id) => {
  if (!id) return new Map([]);

  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(0, idx + 1));
};

export const getFutureRounds = (rounds, id) => {
  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(idx + 1));
};

export const getPreviousRound = (rounds, id) =>
  getAtIndex(rounds, [...rounds.keys()].indexOf(id) - 1);

export const getNextRound = (rounds, id) =>
  getAtIndex(rounds, [...rounds.keys()].indexOf(id) + 1);

export const getAtIndex = (map, idx) => map.get([...map.keys()][idx]);

const getPrevNextRoundDates = (rounds, id) => {
  const [{ date: prevRoundDate }, { date: nextRoundDate }] = [
    getPreviousRound(rounds, id) || {},
    getNextRound(rounds, id) || {},
  ];

  return [prevRoundDate, nextRoundDate];
};

export function getNewRoundDate(rounds, idx) {
  const [{ date: prevRoundDate }, { date: nextRoundDate }] = [
    getAtIndex(rounds, idx - 1) || {},
    getAtIndex(rounds, idx) || {},
  ];

  if (!prevRoundDate) return formatRoundDate();

  if (!nextRoundDate)
    return formatRoundDate(addMonths(new Date(prevRoundDate), 1));

  return formatRoundDate(prevRoundDate);
}

export function isValidRoundDate(rounds, id, date) {
  const [prevRoundDate, nextRoundDate] = getPrevNextRoundDates(rounds, id);

  if (isAfter(new Date(prevRoundDate), date)) {
    throw new Error("Previous round date cannot come before");
  }
  if (nextRoundDate && isAfter(date, new Date(nextRoundDate))) {
    throw new Error("Round date cannot come after following round");
  }
}

// if valuation cap < next round premoney diluted (minus jkiss invested)
//   then jkiss invested / (val cap / prevRound totalShares)
//   else jkiss invested / nextRound share price * (1 - discount)
export const calcJkissShares = ({
  nextRoundResults,
  prevRoundResults,
  valuationCap = 0,
  jkissInvested = 0,
  discount = 100,
}) => {
  if (!jkissInvested || !nextRoundResults || !prevRoundResults) return 0;

  const { sharePrice } = nextRoundResults;
  const { totalDilutedShares } = prevRoundResults;

  const jkissPrice = calcJkissPrice({
    sharePrice,
    discount,
    valuationCap,
    totalDilutedShares,
  });

  return Math.floor(jkissInvested / jkissPrice);
};

export const calcJkissPrice = ({
  sharePrice,
  discount,
  valuationCap,
  totalDilutedShares,
}) =>
  Math.min(
    sharePrice * (1 - discount * 0.01),
    valuationCap / totalDilutedShares
  );

export const isValuationCapApplied = ({
  rounds,
  id,
  valuationCap = 0,
  discount = 100,
  type,
}) => {
  if (type !== "j-kiss") return false;

  const futureRounds = getFutureRounds(rounds, id);
  const nextRoundResults = futureRounds.size
    ? calcRoundResults(
        new Map([...rounds, ...futureRounds]),
        [...futureRounds.keys()][0]
      )
    : false;

  const roundIds = [...rounds.keys()];
  const prevId = roundIds[roundIds.indexOf(id) - 1];
  const prevRoundResults = prevId ? calcRoundResults(rounds, prevId) : false;

  if (!nextRoundResults || !prevRoundResults) return false;

  const { sharePrice } = nextRoundResults;
  const { totalDilutedShares } = prevRoundResults;

  return sharePrice * (1 - discount * 0.01) > valuationCap / totalDilutedShares;
};

export const format = {
  number: new Intl.NumberFormat("ja-JA"),
  percent: new Intl.NumberFormat("ja-JA", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }),
  currency: new Intl.NumberFormat("ja-JA", {
    style: "currency",
    currency: "JPY",
  }),
};

export const allGroups = (investors) =>
  [...investors.values()].map((i) => i.group);

export const uniqueGroups = (investors) => new Set(allGroups(investors));

export function calcRoundResults(rounds, id) {
  if (rounds.get(id).type === "j-kiss") return {};

  const roundIds = [...rounds.keys()];
  const prevId = roundIds[roundIds.indexOf(id) - 1];
  const previousRounds = getPreviousRounds(rounds, prevId);

  const round = rounds.get(id);
  const prevRound = rounds.get(prevId);

  const { sharePrice, type } = round;

  const prevRoundShares = totalCommonShares(previousRounds) || 0;
  const newEquity =
    type === "split" ? 0 : reduceSumOfCommonShares(0, round) * sharePrice;
  const preMoney =
    (type === "split" ? prevRound.sharePrice : sharePrice) * prevRoundShares;

  const prevTotalRoundShares = totalShares(previousRounds) || 0;
  const newEquityDiluted =
    type === "split" ? 0 : reduceSumOfShares(0, round) * sharePrice;
  const preMoneyDiluted =
    (type === "split" ? prevRound.sharePrice : sharePrice) *
    prevTotalRoundShares;

  return {
    sharePrice,
    newEquity,
    preMoney,
    postMoney: newEquity + preMoney,
    preMoneyDiluted,
    postMoneyDiluted: preMoneyDiluted + newEquityDiluted,
    totalShares: totalCommonShares(getPreviousRounds(rounds, id)),
    totalDilutedShares: totalShares(getPreviousRounds(rounds, id)),
  };
}

function getAggregateValue(individualValues) {
  const [idx] = individualValues[individualValues.length - 1] || [];

  if (!idx) return false;

  return individualValues.reduce((acc, [_, value]) => acc + value, 0);
}

const getGroupInvestors = (investors, group) =>
  new Map([...investors].filter(([, i]) => i.group === group));

export function fillEmptyInvestments(round, investors) {
  const investments = [...round.investments];
  const activeInvestorIds = [...round.investments.keys()];
  const inactiveInvestors = [...investors.keys()].filter(
    (id) => !activeInvestorIds.includes(id)
  );

  return [
    ...investments,
    ...inactiveInvestors.map((id) => [
      id,
      { commonShares: 0, votingShares: 0 },
    ]),
  ];
}

export const calcSingleColumn = ({ round, investors, previousRounds, fn }) => {
  if (!fn) return acc;

  const investments = fillEmptyInvestments(round, investors);
  const individualValues = investments.map(fn(investors, previousRounds));

  const groups = [...uniqueGroups(investors)];

  const groupValues = groups
    .map((group) => {
      const groupInvestors = getGroupInvestors(investors, group);
      const groupInvestorsValues = (
        investments.filter(([id]) => groupInvestors.has(id)) || []
      ).map(fn(groupInvestors, previousRounds));

      if (!groupInvestorsValues.length) return false;

      return [group, getAggregateValue(groupInvestorsValues)];
    })
    .filter(Boolean);

  return new Map(
    [
      ...individualValues,
      ...groupValues,

      ["total", getAggregateValue(individualValues)],
    ].filter(Boolean)
  );
};

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NEW_GROUP_PREFIX = "新規グループ名";

export const uniqueGroupName = (investors) => {
  const groups = uniqueGroups(investors);

  const unusedLetter = [...alpha].find(
    (a) => !groups.has(NEW_GROUP_PREFIX + a)
  );

  return NEW_GROUP_PREFIX + unusedLetter;
};

export function jkissRoundResults(rounds, id) {
  const roundIds = [...rounds.keys()];
  const prevId = roundIds[roundIds.indexOf(id) - 1];
  const nextId = roundIds[roundIds.indexOf(id) + 1];
  const { discount, valuationCap } = rounds.get(id);

  const newEquity = [...rounds.get(id).investments.values()].reduce(
    (acc, { jkissInvested }) => acc + (jkissInvested || 0),
    0
  );

  if (!nextId) {
    return { newEquity };
  }

  const nextRoundResults = calcRoundResults(rounds, nextId);
  const prevRoundResults = calcRoundResults(rounds, prevId);

  const sharePrice = calcJkissPrice({
    sharePrice: nextRoundResults.sharePrice,
    discount,
    valuationCap,
    totalDilutedShares: prevRoundResults.totalDilutedShares,
  });

  const preMoney = prevRoundResults.totalShares * sharePrice;
  const preMoneyDiluted = prevRoundResults.totalDilutedShares * sharePrice;

  return {
    sharePrice,
    newEquity,
    preMoney,
    postMoney: preMoney + newEquity,
    preMoneyDiluted,
    postMoneyDiluted: preMoneyDiluted + newEquity,
  };
}

const convertSingleRoundToJkiss =
  (rounds, investors) =>
  ([id, round]) => {
    if (round.type !== "j-kiss") return [id, round];

    const roundsWithSplit = new Map(
      [...rounds].map(convertSingleRoundToSplit(rounds, investors))
    );

    const roundIds = [...rounds.keys()];
    const nextId = roundIds[roundIds.indexOf(id) + 1];
    if (!nextId) return [id, round];
    const prevId = roundIds[roundIds.indexOf(id) - 1];

    const nextRoundResults = calcRoundResults(roundsWithSplit, nextId);
    const prevRoundResults = calcRoundResults(roundsWithSplit, prevId);

    return [
      id,
      {
        ...round,
        investments: new Map(
          [...round.investments].map(([id, investment]) => {
            if (!investment.jkissInvested) return [id, investment];

            return [
              id,
              {
                ...investment,
                commonShares: calcJkissShares({
                  nextRoundResults,
                  prevRoundResults,
                  ...investment,
                  ...round,
                }),
              },
            ];
          })
        ),
      },
    ];
  };

function calcSplitByInvestments(rounds, investors, splitBy) {
  return new Map(
    [...investors.keys()].map((id) => {
      const commonShares = totalCommonSharesForInvestor(rounds, id);
      const votingShares = totalVotingSharesForInvestor(rounds, id);

      return [
        id,
        {
          commonShares: commonShares
            ? commonShares + commonShares * (splitBy - 2)
            : 0,
          votingShares: votingShares
            ? votingShares + votingShares * (splitBy - 2)
            : 0,
        },
      ];
    })
  );
}

const convertSingleRoundToSplit =
  (rounds, investors) =>
  ([id, round]) => {
    if (round.type !== "split") return [id, round];

    const roundIds = [...rounds.keys()];
    const prevId = roundIds[roundIds.indexOf(id) - 1];

    return [
      id,
      {
        ...round,
        investments: calcSplitByInvestments(
          getPreviousRounds(rounds, prevId),
          investors,
          round.splitBy
        ),
      },
    ];
  };

export function convertReactiveRounds(rounds, investors) {
  return new Map(
    [...rounds]
      .map(convertSingleRoundToJkiss(rounds, investors))
      .map(convertSingleRoundToSplit(rounds, investors))
  );
}

export function calcFounderShare({ investors, rounds } = {}) {
  if (!investors || !investors.size || !rounds || !rounds.size) return 0;

  const roundsConverted = convertReactiveRounds(rounds, investors);
  const groupInvestors = getGroupInvestors(
    investors,
    ([...investors.values()][0] || {}).group
  );

  return [...groupInvestors.keys()].reduce((acc, id) => {
    const total = totalShares(roundsConverted);
    const previousRoundShares = totalSharesForInvestor(roundsConverted, id);

    return acc + previousRoundShares / total;
  }, 0);
}
