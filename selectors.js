import { get } from "svelte/store";

import {
  roundOptions,
  renameRound,
  groupNames,
  togglePublic,
  createDocument,
  removeDocument,
  resetDocument,
  updateSharePrice,
} from "./actions.js";
import _ from "./intl.js";
import {
  getPreviousRounds,
  getFutureRounds,
  calcRoundResults,
  totalInvestorRows,
  getPosition,
  calcValues,
  calcOffset,
  format,
  calcJkissShares,
  totalCommonShares,
  totalShares,
  getPreviousRounds,
  convertJkissToCommonShares,
  jkissRoundResults,
  roundResultsWithPosition
} from "./utils.js";
import {
  labelClasses,
  firstColClasses,
} from "./classes.js";

import {
  UPDATE_INVESTOR_NAME,
  ADD_INVESTOR,
  REMOVE_INVESTOR,
  ADD_ROUND,
  ADD_SPLIT_ROUND,
  REMOVE_ROUND,
  UPDATE_DOCUMENT_TITLE,
  UPDATE_VALUATION_CAP,
  UPDATE_DISCOUNT,
  UPDATE_SPLIT_BY,
  docId,
  store,
} from "./store.js"

const formatRoundTitle = ({ name, date }) => `${name}`
  + (date ? ` (${(new Date(date)).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })})` : '');

const columnHeaders = (cols, xStart) => cols.map((c, i, idx) => [
  `round-label:${xStart}:${i}`,
  {
    position: [c.hasRowspan ? 2 : 1, xStart + calcOffset(cols, i), 2, xStart + calcOffset(cols, i) + (c.colSpan - 1)],
    value: c.label,
    classes: labelClasses,
    isLabel: true,
  },
]);

const votingColumnHeader = (cols, idx) => cols
  .map((c, i) => c.voting ? [
    `round-sup:${idx}:${i}`,
    {
      position: [1, idx + i, 1, idx + i + 1],
      value: "潜在株式",
      isLabel: true,
      classes: labelClasses,
    },
] : false)
  .filter(Boolean);

export const footerLabels = offset => [
  ['total-label', { position: [offset - 1, 0, offset - 1, 1], value: "合計", classes: firstColClasses, isLabel: true, }],
  ['share-price-label', { position: [offset, 0, offset, 1], value: "株価", classes: firstColClasses, isLabel: true, }],
  ['new-equity-label', { position: [offset + 1, 0, offset + 1, 1], value: "調達金額", classes: firstColClasses, isLabel: true, }],
  ['pre-money-label', { position: [offset + 2, 0, offset + 2, 1], value: "時価総額（Pre）", classes: firstColClasses, isLabel: true, }],
  ['post-money-label', { position: [offset + 3, 0, offset + 3, 1], value: "時価総額（Post）", classes: firstColClasses, isLabel: true, }],
  ['pre-money-diluted-label', { position: [offset + 4, 0, offset + 4, 1], value: "時価総額（Pre/ 潜在込）", classes: firstColClasses, isLabel: true, }],
  ['post-money-diluted-label', { position: [offset + 5, 0, offset + 5, 1], value: "時価総額（Pre/潜在込）", classes: firstColClasses, isLabel: true, }],
];

export const investorNames = investors => id => [
  'investor:' + id,
  {
    position: getPosition(investors, id, 0, 1),
    value: investors.get(id).name,
    classes: firstColClasses + " px-4",
    onChange: (s, { id, value }) => {
      const [,investorId] = id.split(':');

      s.commit(UPDATE_INVESTOR_NAME, { investorId: investorId, name: value });
    },
    menuItems: (s, { id }) => [
        {
          text: "投資家追加",
          cb: () => s.commit(ADD_INVESTOR, { afterId: id.split(':')[1] }),
        },
        {
          text: "削除",
          cb: () => s.commit(REMOVE_INVESTOR, { id: id.split(':')[1] }),
        },
      ].filter(i => investors.get(id.split(':')[1]).group !== 'Founder' || i.text === 'Add investor'),
  }
];

const roundTitle = (id, x, colSpan, rounds) => [
  'round:' + id,
  {
    position: [0, x + 1, 0, x + colSpan],
    value: formatRoundTitle(rounds.get(id)),
    classes: "font-bold text-center pr-4",
    onChange: renameRound,
    pinMenuToggle: true,
    menuItems: (s, { id }) => [
      {
        text: "新ラウンド作成（普通株式）",
        cb: () => s.commit(ADD_ROUND, { type: "common", afterId: id.split(':')[1] }),
      },
      rounds.get(id.split(':')[1]).type !== "j-kiss" ? {
        text: "J-kissラウンド作成",
        cb: () => s.commit(ADD_ROUND, { type: "j-kiss", afterId: id.split(':')[1] }),
      } : false,
      {
        text: "Splitラウンド作成",
        cb: () => s.commit(ADD_SPLIT_ROUND, { type: "split", afterId: id.split(':')[1], splitBy: 100, }),
      },
      rounds.get(id.split(':')[1]).type !== "founded" ? {
        text: "ラウンド削除",
        cb: () => s.commit(REMOVE_ROUND, { id: id.split(':')[1] }),
      } : false,
    ].filter(Boolean),
  }
];

function jkissCells(round, roundId, x, y) {
  if (round.type !== "j-kiss") return [];

  return [
    [`valuation-label:${roundId}`, {
      position: [y + 6, x, y + 6, x + 1],
      value: "バリュエーションキャップ",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`discount-label:${roundId}`, {
      position: [y + 7, x, y + 7, x + 1],
      value: "割引",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`valuation:${roundId}`, {
      position: [y + 6, x + 2, y + 6, x + 3],
      value: round.valuationCap || 0,
      onChange: (store, { value }) => store.commit(UPDATE_VALUATION_CAP, { roundId, value }),
      format: format.currency.format,
      classes: "dark:bg-gray-800 bg-white",
    }],
    [`discount:${roundId}`, {
      position: [y + 7, x + 2, y + 7, x + 3],
      value: round.discount || 0,
      onChange: (store, { value }) => store.commit(UPDATE_DISCOUNT, { roundId, value }),
      format: i => i + '%',
      classes: "dark:bg-gray-800 bg-white",
    }],
  ]
}

function splitCells(round, roundId, x, y) {
  if (round.type !== "split") return [];

  return [
    [`split-by-label:${roundId}`, {
      position: [y + 6, x, y + 6, x + 1],
      value: "Split by",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`split-by:${roundId}`, {
      position: [y + 6, x + 2, y + 6, x + 3],
      value: round.splitBy || 0,
      onChange: (store, { value }) => store.commit(UPDATE_SPLIT_BY, { roundId, value }),
      format: format.number.format,
      classes: "dark:bg-gray-800 bg-white",
    }],
  ]
}

export function roundValues(r, investors) {
  return ([acc, prevCol], id) => {
    const rounds = convertJkissToCommonShares(r, investors);

    const round = rounds.get(id);

    const { colSpan, cols } = roundOptions[round.type];
    const roundResults = round.type === "j-kiss"
      ? jkissRoundResults(rounds, id, prevCol, totalInvestorRows(investors) + 4)
      : roundResultsWithPosition(
        id,
        prevCol,
        totalInvestorRows(investors) + 4,
        colSpan,
        calcRoundResults(rounds, id),
        updateSharePrice,
        // Do we need to disable editing for split rounds?
        // round.type !== "split" ? updateSharePrice : false
      );

    const futureRounds = getFutureRounds(rounds, id);
    const nextRoundResults = futureRounds.size
      ? calcRoundResults(new Map([...rounds, ...futureRounds]), [...futureRounds.keys()][0])
      : false;

    return [
      [
        [
          `round-dividers:${id}`,
          {
            position: [0, prevCol + 1, totalInvestorRows(investors) + 9, prevCol + colSpan],
            classes: "pointer-events-none dark:border-blue-800 border-blue-300 border-l",
            value: "",
          }
        ],
        ...acc,
        roundTitle(id, prevCol, colSpan, rounds),
        ...columnHeaders(cols, prevCol + 1),
        ...jkissCells(round, id, prevCol + 1, totalInvestorRows(investors) + 5),
        ...splitCells(round, id, prevCol + 1, totalInvestorRows(investors) + 5),
        ...votingColumnHeader(cols, prevCol + 1),
        ...roundResults,
        ...cols.reduce(
          calcValues({
            prevCol,
            round,
            investors,
            id,
            previousRounds: getPreviousRounds(rounds, id),
            futureRounds,
            nextRoundResults,
            cols,
          }),
          []
        ),
      ],
      prevCol + colSpan
    ];
  };
}

export const colsCount = (rounds) => 1 + [...rounds.values()].reduce((acc, r) => acc + roundOptions[r.type].colSpan, 0);

export const rowsCount = (investors) => totalInvestorRows(investors) + 10;

function documentNameBlock(s, title) {
  return [
      "document-name",
    {
      position: [0,0,2,1],
      value: title,
      classes: "flex items-center justify-center",
      onChange: (s, value) => s.commit(UPDATE_DOCUMENT_TITLE, value),
      pinMenuToggle: true,
      menuItems: (s) => [
        {
          text: "新しいテーブル",
          cb: () => createDocument(store),
        },
        {
          text: "共有する",
          cb: () => togglePublic(s),
        },
        {
          text: "このテーブルをコピー",
          cb: () => createDocument(store, { from: get(docId) }),
        },
        {
          text: "削除",
          cb: () => removeDocument(store, { id: get(docId) }),
        },
        {
          text: "リセット",
          cb: () => resetDocument(s),
        },
      ]
    }
  ];
}

export function toBlocks(s) {
  const { investors, rounds, title } = s.get();

  return new Map([
    documentNameBlock(s, title),
    ...groupNames(investors),
    ...[...investors.keys()].map(investorNames(investors)),
    ...[...rounds.keys()].reduce(roundValues(rounds, investors), [[], 1])[0],
    ...footerLabels(totalInvestorRows(investors) + 4),
  ]);
}
