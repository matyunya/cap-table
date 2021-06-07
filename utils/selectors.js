import { roundOptions } from "/utils/actions/docs.js";

import {
  calcRoundResults,
  calcSingleColumn,
  getPreviousRounds,
  convertReactiveRounds,
  jkissRoundResults,
  isValuationCapApplied,
} from "./index.js";

import { store } from "/store.js";

export function groupInvestors(groups, investors) {
  return [...groups].reduce((acc, group) => [
    ...acc,
    { isGroup: true, label: group, id: group },
    ...[...investors.keys()].filter(id => investors.get(id).group === group).map(id => ({
      id,
      label: investors.get(id).name,
      title: investors.get(id).title || "",
      group,
    }))
  ], []);
}


export function roundValues(rounds, investors) {
  return (acc, id) => {
    const round = rounds.get(id);

    const { cols } = roundOptions[round.type];
    const roundResults = round.type === "j-kiss"
      ? jkissRoundResults(rounds, id)
      : calcRoundResults(rounds, id);

    return {
      ...acc,
      [id]: {
        isCapApplied: isValuationCapApplied({ rounds, id, ...round }),
        roundResults,
        values: Object.keys(cols).reduce((acc, colType) => ({
          ...acc,
          [colType]: calcSingleColumn({
            round,
            investors,
            previousRounds: getPreviousRounds(rounds, id),
            fn: cols[colType].fn,
          }),
        }), {}
        ),
      }
    }
  };
}

export function calculate(rounds, investors) {
  if (!investors) return new Map([]);

  const roundsWithReactive = convertReactiveRounds(rounds, investors);

  return [...roundsWithReactive.keys()].reduce(roundValues(roundsWithReactive, investors), {});
}

export function roundsCount(id) {
  const doc = store.get("documents", id);

  if (!doc) return 0;

  return doc.rounds.size;
}

function founderShareForTheRound(values) {
  // should be founders group
  // todo: fix for jkiss

  return values.totalSharesPercent ? values.totalSharesPercent.get("FOUNDER_ID") : values.sharesPercent.get("FOUNDER_ID");
}

export function chartData(id, docs) {
  const doc = docs ? docs.get(id) : store.get("documents", id);
  const data = calculate(doc.rounds, doc.investors);
  const keys = [...doc.rounds.keys()];

  const res = keys.map((id, i) => ({
    founderShare: doc.rounds.get(id).type === "j-kiss"
      ? founderShareForTheRound(data[keys[i - 1]].values)
      : founderShareForTheRound(data[id].values),
    postMoney: doc.rounds.get(id).type === "j-kiss"
      ? data[keys[i - 1]].roundResults.postMoney
      : data[id].roundResults.postMoney,
    newEquity: doc.rounds.get(id).type === "j-kiss"
      ? data[keys[i - 1]].roundResults.newEquity
      : data[id].roundResults.newEquity,
    date: doc.rounds.get(id).date,
  }));

  return res;
}
