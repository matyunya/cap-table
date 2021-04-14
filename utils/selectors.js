import { get } from "svelte/store";

import {
  roundOptions,
  togglePublic,
  createDocument,
  removeDocument,
  resetDocument,
  updateRoundDate,
} from "./actions.js";
import _ from "./intl.js";
import {
  calcRoundResults,
  calcSingleColumn,
  getPreviousRounds,
  convertReactiveRounds,
  jkissRoundResults,
  uid,
  formatRoundDate,
  isValuationCapApplied,
} from "./index.js";

import {
  UPDATE_INVESTOR_NAME,
  UPDATE_INVESTOR_TITLE,
  ADD_INVESTOR,
  REMOVE_INVESTOR,
  ADD_ROUND,
  ADD_SPLIT_ROUND,
  REMOVE_ROUND,
  docId,
  store,
  syncUp,
} from "/store.js";

export const investorNames = investors => id => [
  'investor-name:' + id,
  {
    value: investors.get(id).name,
    onChange: (s, { id, value }) => {
      const [, investorId] = id.split(':');

      syncUp(s, UPDATE_INVESTOR_NAME, { investorId: investorId, name: value });
    },
  }
];

export const investorTitles = investors => id => [
  'investor-title:' + id,
  {
    value: investors.get(id).title || "",
    onChange: (s, { id, value }) => {
      const [, investorId] = id.split(':');

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

const roundDate = (id, rounds) => [
  'round-date:' + id,
  {
    value: formatRoundDate(rounds.get(id).date),
    onChange: updateRoundDate,
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

export function calculate(rounds, investors) {
  if (!investors) return new Map([]);

  const roundsWithReactive = convertReactiveRounds(rounds, investors);

  return [...roundsWithReactive.keys()].reduce(roundValues(roundsWithReactive, investors), {});
}
