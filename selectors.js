import { roundOptions } from "./options.js";
import {
  getPreviousRounds,
  calcRoundResults,
  format,
  totalInvestorRows,
  getPosition,
  allGroups,
  calcIndividualValues,
} from "./utils.js";

const formatRoundTitle = ({ name, date }) => `${name} (${(new Date(date)).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })})`;

const labelClasses = "font-bold text-center flex items-center justify-center";

const columnHeaders = (cols, idx) => cols.map((c, i) => [
  `round-label:${idx}:${i}`,
  {
    position: [c.hasRowspan ? 2 : 1, idx + i, 2, idx + i],
    value: c.label,
    classes: labelClasses,
  },
]);

const votingColumnHeader = (cols, idx) => cols
  .map((c, i) => c.voting ? [
    `round-sup:${idx}:${i}`,
    {
      position: [1, idx + i, 1, idx + i + 1],
      value: "Potentially voting",
      classes: labelClasses,
    },
] : false)
  .filter(Boolean);

export const footerLabels = offset => [
  ['total-label', { position: [offset - 1, 0, offset - 1, 0], value: "Total" }],
  ['share-price-label', { position: [offset, 0, offset, 0], value: "Share price" }],
  ['new-equity-label', { position: [offset + 1, 0, offset + 1, 0], value: "New equity (¥)" }],
  ['pre-money-label', { position: [offset + 2, 0, offset + 2, 0], value: "Pre money (¥)" }],
  ['post-money-label', { position: [offset + 3, 0, offset + 3, 0], value: "Post money (¥)" }],
];

export const investorNames = investors => (id, i) => ['investor:' + id, { position: getPosition(investors, id, 0), value: investors.get(id).name }];

export function groupNames(investors) {
  const groups = allGroups(investors).slice(1); // omit founders

  return groups.reduce((acc, cur, i) => {
    if (groups[i + 1] === cur) {
      return acc;
    }

    return [
      ...acc,
      // Three label rows + 1 founder row
      [`group-label:${cur}:${i}`, { position: [i + 4, 0, i + 4, 0], value: cur, classes: "italic" }],
    ];
  }, []);
}

const roundTitle = (id, x, colSpan, rounds) => [
  'round:' + id,
  {
    position: [0, x + 1, 0, x + colSpan],
    value: formatRoundTitle(rounds.get(id)),
    classes: "font-bold text-center",
  }
];

function roundResultsWithPosition(id, x, y, colSpan, roundResults) {
  return [
    [`${id}:share-price-label`, { value: roundResults.sharePrice }],
    [`${id}:new-equity-label`, { value: roundResults.newEquity }],
    [`${id}:pre-money-label`, { value: roundResults.preMoney }],
    [`${id}:post-money-label`, { value: roundResults.postMoney }],
  ].map(([idx, val], i) => [
    idx,
    {
      ...val,
      format: format.currency.format,
      position: [y + i, x + 1, y + i, x + colSpan],
      classes: "text-center",
    }
  ]);
}

export function roundValues(rounds, investors) {
  return ([acc, prevCol], id) => {
    const round = rounds.get(id);
    const { colSpan, cols } = roundOptions[round.type];

    return [
      [
        ...acc,
        roundTitle(id, prevCol, colSpan, rounds),
        ...columnHeaders(cols, prevCol + 1),
        ...votingColumnHeader(cols, prevCol + 1),
        ...roundResultsWithPosition(id, prevCol, totalInvestorRows(investors) + 3, colSpan, calcRoundResults(rounds, id)),

        ...cols.reduce(calcIndividualValues({
          prevCol,
          round,
          investors,
          previousRounds: getPreviousRounds(rounds, id),
          id,
        }), []),
      ],
      prevCol + colSpan
    ];
  };
}

export const colsCount = (rounds) => 1 + [...rounds.values()].reduce((acc, r) => acc + roundOptions[r.type].colSpan, 0);

export const rowsCount = (investors) => totalInvestorRows(investors) + 7;
