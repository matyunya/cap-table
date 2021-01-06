const reduceSumOfShares = (acc, { investments }) => acc + sum([...investments].map(([_, i]) => i));

export const uid = (length = 64) => [...Array(length)].map(() => (Math.random() * 16 | 0).toString(16)).join('');

export const calcShare = (myShare, total) => (myShare * 100 / total).toFixed(1);

export const sum = i => i.reduce((acc, cur) => acc + cur, 0);

export const totalShares = (rounds) => [...rounds.values()].reduce(reduceSumOfShares, 0);

export const totalSharesForInvestor = (rounds, investorId) => [...rounds.values()]
  .reduce(
    (acc, { investments }) => acc + sum([...investments].filter(([id]) => id === investorId).map(([_, i]) => i)
  ), 0);

export const getPreviousRounds = (rounds, id) => {
  const idx = [...rounds.keys()].indexOf(id);

  return new Map([...rounds].slice(0, idx + 1));
}

export const format = {
  number: new Intl.NumberFormat(),
  percent: new Intl.NumberFormat(undefined, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  currency: new Intl.NumberFormat(undefined, { style: "currency", currency: 'JPY' }),
};

export const allGroups = investors => [...investors.values()].map(i => i.group);

export const getPosition = (investors, id, col) => {
  const idx = [...investors.keys()].indexOf(id);
  const groups = allGroups(investors);
  const groupIdx = Math.max(0, groups.indexOf(investors.get(id).group)); // minus founders, which doesn't require extra row

  const row = idx + groupIdx + 3;

  return [row, col, row, col];
};

export const totalInvestorRows = investors => investors.size + (new Set(allGroups(investors))).size;

export function calcRoundResults(rounds, id) {
  const roundIds = [...rounds.keys()];
  const prevId = roundIds[roundIds.indexOf(id - 1)];
  const { sharePrice, ...round } = rounds.get(id);

  const prevRoundShares = prevId === undefined ? 0 : totalShares(getPreviousRounds(rounds, prevId));
  const newEquity = reduceSumOfShares(0, round) * sharePrice;
  const preMoney = sharePrice * prevRoundShares;

  return {
    sharePrice,
    newEquity,
    preMoney,
    postMoney: newEquity + preMoney,
  };
}

export const calcIndividualValues = ({
  prevCol,
  round,
  investors,
  previousRounds,
  id,
}) => (acc, { onChange, fn, format }, i) => {
  if (!fn) return acc;

  return [
    ...acc,
    ...([...round.investments] || [])
      .map(fn(investors, previousRounds, prevCol + i + 1, id, { onChange, format }))
  ];
}
