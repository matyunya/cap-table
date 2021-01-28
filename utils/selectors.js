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
  updateRoundDate,
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
  getPreviousRounds,
  convertReactiveRounds,
  jkissRoundResults,
  roundResultsWithPosition,
  uid,
  formatRoundDate,
  isValuationCapApplied,
} from "./index.js";
import {
  labelClasses,
  firstColClasses,
} from "./classes.js";

import {
  UPDATE_INVESTOR_NAME,
  UPDATE_INVESTOR_TITLE,
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
  syncUp,
} from "/store.js";

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
  ['total-label', { position: [offset - 1, 0, offset - 1, 2], value: "合計", classes: firstColClasses, isLabel: true, }],
  ['share-price-label', { position: [offset, 0, offset, 2], value: "株価", classes: firstColClasses, isLabel: true, }],
  ['new-equity-label', { position: [offset + 1, 0, offset + 1, 2], value: "調達金額", classes: firstColClasses, isLabel: true, }],
  ['pre-money-label', { position: [offset + 2, 0, offset + 2, 2], value: "時価総額（Pre）", classes: firstColClasses, isLabel: true, }],
  ['post-money-label', { position: [offset + 3, 0, offset + 3, 2], value: "時価総額（Post）", classes: firstColClasses, isLabel: true, }],
  ['pre-money-diluted-label', { position: [offset + 4, 0, offset + 4, 2], value: "時価総額（Pre/ 潜在込）", classes: firstColClasses, isLabel: true, }],
  ['post-money-diluted-label', { position: [offset + 5, 0, offset + 5, 2], value: "時価総額（Pre/潜在込）", classes: firstColClasses, isLabel: true, }],
];

export const investorNames = investors => id => [
  'investor-name:' + id,
  {
    position: getPosition(investors, id, 0, 1),
    value: investors.get(id).name,
    classes: firstColClasses + " px-1",
    onChange: (s, { id, value }) => {
      const [,investorId] = id.split(':');

      syncUp(s, UPDATE_INVESTOR_NAME, { investorId: investorId, name: value });
    },
  }
];

export const investorTitles = investors => id => [
  'investor-title:' + id,
  {
    position: getPosition(investors, id, 2, 0),
    value: investors.get(id).title || "",
    classes: firstColClasses + " px-1",
    onChange: (s, { id, value }) => {
      const [,investorId] = id.split(':');

      syncUp(s, UPDATE_INVESTOR_TITLE, { investorId: investorId, title: value });
    },
    menuItems: (s, { id }) => [
        {
          text: "投資家追加",
          cb: () => syncUp(s, ADD_INVESTOR, { afterId: id.split(':')[1] }),
        },
        {
          text: "削除",
          cb: () => syncUp(s, REMOVE_INVESTOR, { id: id.split(':')[1] }),
        },
      ].filter(i => investors.get(id.split(':')[1]).group !== 'Founder' || i.text === 'Add investor'),
  }
];

function canAddJkiss(roundId, rounds) {
  if (rounds.get(roundId).type === "j-kiss") return false;

  const roundIds = [...rounds.keys()];
  const nextId = roundIds[roundIds.indexOf(roundId) + 1];

  if (!nextId) return true;

  return rounds.get(nextId).type !== "j-kiss";
}

function canAddSplit(roundId, rounds) {
  return rounds.get(roundId).type !== "j-kiss";
}

function canRemoveRound(roundId, rounds) {
  if (rounds.get(roundId).type === "founded") return false;

  const roundIds = [...rounds.keys()];
  const nextId = roundIds[roundIds.indexOf(roundId) + 1];
  const prevId = roundIds[roundIds.indexOf(roundId) - 1];

  if (!nextId) return true;

  return !(rounds.get(prevId).type === "j-kiss" && ["j-kiss", "split"].includes(rounds.get(nextId).type));
}

const roundTitle = (id, x, colSpan, rounds) => [
  'round-title:' + id,
  {
    position: [0, x + 1, 0, x + colSpan - 1],
    value: rounds.get(id).name,
    classes: "font-bold text-center pr-4",
    onChange: renameRound,
  }
];

const roundDate = (id, x, colSpan, rounds) => [
  'round-date:' + id,
  {
    position: [0, x + colSpan, 0, x + colSpan],
    value: formatRoundDate(rounds.get(id).date),
    classes: "font-bold text-center pr-4",
    onChange: updateRoundDate,
    type: "month",
    pinMenuToggle: true,
    menuItems: (s, { id }) => [
      {
        text: "新ラウンド作成（普通株式）",
        cb: () => syncUp(
          s,
          ADD_ROUND,
          {
            type: "common",
            afterId: id.split(':')[1],
          }),
      },
      canAddJkiss(id.split(':')[1], rounds) ? {
        text: "J-kissラウンド作成",
        cb: () => {
          const newId = uid();
          syncUp(s, ADD_ROUND, { type: "j-kiss", afterId: id.split(':')[1], newId }),
          setTimeout(() => {
            const el = document.getElementById(`valuation:${newId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              el.click();
            }
          }, 200);
        },
      } : false,
      canAddSplit(id.split(':')[1], rounds) ? {
        text: "株式分割ラウンド作成",
        cb: () => syncUp(s, ADD_SPLIT_ROUND, { type: "split", afterId: id.split(':')[1], splitBy: 100, }),
      } : false,
      canRemoveRound(id.split(':')[1], rounds) ? {
        text: "ラウンド削除",
        cb: () => syncUp(s, REMOVE_ROUND, { id: id.split(':')[1] }),
      } : false,
    ].filter(Boolean),
  }
];

function jkissCells(round, roundId, x, y, nextRoundResults, prevRoundResults) {
  if (round.type !== "j-kiss") return [];

  const isCapApplied = isValuationCapApplied({ nextRoundResults, prevRoundResults, ...round });

  return [
    [`valuation-bg:${roundId}`, {
      position: [y + 6, x, y + 7, x + 3],
      value: "",
      classes: "dark:bg-gray-800 bg-white",
    }],
    [`valuation-label:${roundId}`, {
      position: [y + 6, x, y + 6, x + 1],
      value: "バリュエーションキャップ",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`discount-label:${roundId}`, {
      position: [y + 7, x, y + 7, x + 1],
      value: "割引率",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`valuation:${roundId}`, {
      position: [y + 6, x + 2, y + 6, x + 3],
      value: round.valuationCap || 0,
      onChange: (store, { value }) => syncUp(store, UPDATE_VALUATION_CAP, { roundId, value }),
      format: format.currency.format,
      classes: isCapApplied ? "dark:bg-light-blue-800 bg-light-blue-200 dark:text-white" : "dark:bg-gray-800 bg-white",
    }],
    [`discount:${roundId}`, {
      position: [y + 7, x + 2, y + 7, x + 3],
      value: round.discount || 0,
      onChange: (store, { value }) => syncUp(store, UPDATE_DISCOUNT, { roundId, value }),
      format: i => i + '%',
      classes: !isCapApplied ? "dark:bg-light-blue-800 bg-light-blue-200 dark:text-white" : "dark:bg-gray-800 bg-white",
    }],
  ]
}

function splitCells(round, roundId, x, y) {
  if (round.type !== "split") return [];

  return [
    [`split-by-label:${roundId}`, {
      position: [y + 6, x, y + 6, x + 1],
      value: "分割数",
      classes: "dark:bg-gray-800 bg-white",
      isLabel: true,
    }],
    [`split-by:${roundId}`, {
      position: [y + 6, x + 2, y + 6, x + 3],
      value: round.splitBy || 0,
      onChange: (store, { value }) => syncUp(store, UPDATE_SPLIT_BY, { roundId, value }),
      format: format.number.format,
      classes: "dark:bg-gray-800 bg-white",
    }],
  ]
}

export function roundValues(r, investors) {
  return ([acc, prevCol], id) => {
    const rounds = convertReactiveRounds(r, investors);

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
        round.type !== "split" ? updateSharePrice : false,
      );

    const futureRounds = getFutureRounds(rounds, id);
    const nextRoundResults = futureRounds.size
      ? calcRoundResults(new Map([...rounds, ...futureRounds]), [...futureRounds.keys()][0])
      : false;

    const roundIds = [...rounds.keys()];
    const prevId = roundIds[roundIds.indexOf(id) - 1];
    const prevRoundResults = prevId ? calcRoundResults(rounds, prevId) : false;

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
        roundDate(id, prevCol, colSpan, rounds),
        ...columnHeaders(cols, prevCol + 1),
        ...jkissCells(round, id, prevCol + 1, totalInvestorRows(investors) + 5, nextRoundResults, prevRoundResults),
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

export const colsCount = (rounds) => 2 + [...rounds.values()].reduce((acc, r) => acc + roundOptions[r.type].colSpan, 0);

export const rowsCount = (investors) => totalInvestorRows(investors) + 10;

function documentNameBlock(s, title) {
  return [
      "document-name",
    {
      position: [0,0,2,2],
      value: title,
      classes: "flex items-center justify-center",
      onChange: (s, value) => syncUp(s, UPDATE_DOCUMENT_TITLE, value),
    }
  ];
}

export const getDocMenuItems = (s) => [
  {
    text: "新しいテーブル",
    cb: () => createDocument(store),
  },
  {
    text: s.get("access", "read", "public") ? "共有をキャンセル" : "共有する",
    cb: () => togglePublic(s),
  },
  {
    text: "このテーブルをコピー",
    cb: () => createDocument(store, { from: get(docId) }),
  },
  store.get("documents").size > 1 && {
    text: "削除",
    cb: () => removeDocument(store, { id: get(docId) }),
  },
  {
    text: "リセット",
    cb: () => resetDocument(s),
  },
].filter(Boolean);

export function toBlocks(s) {
  const { investors, rounds, title, readOnly } = s.get() || {};

  if (!investors) return new Map([]);

  return new Map([
    documentNameBlock(s, title),
    ...groupNames(investors),
    ...[...investors.keys()].map(investorTitles(investors)),
    ...[...investors.keys()].map(investorNames(investors)),
    ...[...rounds.keys()].reduce(roundValues(rounds, investors), [[], 2])[0],
    ...footerLabels(totalInvestorRows(investors) + 4),
  ].map(([id, cell]) => {
    if (!readOnly) return [id, cell];

    return [id, { ...cell, onChange: false, menuItems: false }];
  }));
}
