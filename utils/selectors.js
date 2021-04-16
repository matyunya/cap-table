import { roundOptions } from "./actions.js";

import {
  calcRoundResults,
  calcSingleColumn,
  getPreviousRounds,
  convertReactiveRounds,
  jkissRoundResults,
  isValuationCapApplied,
} from "./index.js";

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
