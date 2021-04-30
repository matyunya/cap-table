import { roundOptions } from "./actions.js";

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

export function roundsCount(docId) {
  const doc = store.get('documents', docId);

  return doc.rounds.size;
}

function founderShareForTheRound(values) {
  // should be founders group
  return values.totalSharesPercent ? values.totalSharesPercent.get("FOUNDER_ID") : values.sharesPercent.get("FOUNDER_ID");
}

export function chartData(docId) {
  const doc = store.get('documents', docId);
  const data = calculate(doc.rounds, doc.investors);

  const res = [...doc.rounds.keys()].map(id => ({
    founderShare: founderShareForTheRound(data[id].values),
    postMoney: data[id].roundResults.postMoney,
    date: new Date(doc.rounds.get(id).date),
  }));

  return res;
}
