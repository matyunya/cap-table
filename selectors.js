import { get } from "svelte/store";

import {
  roundOptions,
  updateSharePrice,
  renameRound,
  groupNames,
  togglePublic,
  createDocument,
  removeDocument,
} from "./actions.js";
import _ from "./intl.js";
import {
  getPreviousRounds,
  getFutureRounds,
  calcRoundResults,
  totalInvestorRows,
  getPosition,
  calcValues,
  format,
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
  REMOVE_ROUND,
  UPDATE_DOCUMENT_TITLE,
  docId,
  store,
} from "./store.js"

const formatRoundTitle = ({ name, date }) => `${name}`
  + (date ? ` (${(new Date(date)).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })})` : '');

const columnHeaders = (cols, idx) => cols.map((c, i) => [
  `round-label:${idx}:${i}`,
  {
    position: [c.hasRowspan ? 2 : 1, idx + i, 2, idx + i],
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
      {
        text: "J-kiss ラウンド作成",
        cb: () => s.commit(ADD_ROUND, { type: "j-kiss", afterId: id.split(':')[1] }),
      },
      {
        text: "ラウンド削除",
        cb: () => s.commit(REMOVE_ROUND, { id: id.split(':')[1] }),
      },
    ],
  }
];

function roundResultsWithPosition(id, x, y, colSpan, roundResults) {
  return [
    [`${id}:share-price-label`, { value: roundResults.sharePrice, onChange: roundResults.isJkiss ? false : updateSharePrice, renameRound }],
    [`${id}:new-equity-label`, { value: roundResults.newEquity }],
    [`${id}:pre-money-label`, { value: roundResults.preMoney }],
    [`${id}:post-money-label`, { value: roundResults.postMoney }],
    [`${id}:pre-money-label-diluted`, { value: roundResults.preMoneyDiluted }],
    [`${id}:post-money-label-diluted`, { value: roundResults.postMoneyDiluted }],
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
    const roundResults = calcRoundResults(rounds, id);
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
        ...votingColumnHeader(cols, prevCol + 1),
        ...roundResultsWithPosition(id, prevCol, totalInvestorRows(investors) + 4, colSpan, roundResults),
        ...cols.reduce(
          calcValues({
            prevCol,
            round,
            investors,
            id,
            previousRounds: getPreviousRounds(rounds, id),
            futureRounds,
            nextRoundResults,
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

export function toBlocks(s) {
  const { investors, rounds, title } = s.get();

  return new Map([
    [
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
        ]
      }
    ],
    ...groupNames(investors),
    ...[...investors.keys()].map(investorNames(investors)),
    ...[...rounds.keys()].reduce(roundValues(rounds, investors), [[], 1])[0],
    ...footerLabels(totalInvestorRows(investors) + 4),
  ]);
}
