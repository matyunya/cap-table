import {
  roundOptions,
  togglePublic,
  createDocument,
  removeDocument,
  resetDocument,
  syncTable,
} from "./actions.js";
import _ from "./intl.js";
import {
  calcRoundResults,
  calcSingleColumn,
  getPreviousRounds,
  convertReactiveRounds,
  jkissRoundResults,
  uid,
  isValuationCapApplied,
  lastInvestorIdInGroup,
} from "./index.js";

import {
  ADD_INVESTOR,
  REMOVE_INVESTOR,
  ADD_ROUND,
  ADD_SPLIT_ROUND,
  REMOVE_ROUND,
  REMOVE_GROUP,
  store,
} from "/store.js";

const { docId, rounds } = require("/index.ellx");

export const investorGroupMenuItems = (group, investors, isFounderGroup) => [
  {
    text: "グループ追加",
    cb: () => syncTable(
      ADD_INVESTOR,
      {
        test: console.log({ investors }, 'UASD'),
        newGroup: true,
        afterId: [...investors].reduce(lastInvestorIdInGroup(group), "")
      }
    )
  },
  !isFounderGroup && {
    text: "削除",
    cb: () => syncTable(REMOVE_GROUP, { group }),
  },
].filter(Boolean);

export const investorMenuItems = (id, group) => [{
  text: "投資家追加",
  cb: () => syncTable(ADD_INVESTOR, { afterId: id }),
},
group !== "Founder" && {
  text: "削除",
  cb: () => syncTable(REMOVE_INVESTOR, { id }),
}].filter(Boolean);

export const roundMenuItems = (id) => [
  {
    text: "新ラウンド作成（普通株式）",
    cb: () => syncTable(
      ADD_ROUND,
      {
        type: "common",
        afterId: id,
      }),
  },
  canAddJkiss(id) ? {
    text: "J-kissラウンド作成",
    cb: () => {
      const newId = uid();
      syncTable(ADD_ROUND, { type: "j-kiss", afterId: id, newId }),
        setTimeout(() => {
          const el = document.querySelector(`[data-id="valuation:${newId}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            el.click();
          }
        }, 200);
    },
  } : false,
  canAddSplit(id) ? {
    text: "株式分割ラウンド作成",
    cb: () => syncTable(ADD_SPLIT_ROUND, { type: "split", afterId: id, splitBy: 100 }),
  } : false,
  canRemoveRound(id) ? {
    text: "ラウンド削除",
    cb: () => syncTable(REMOVE_ROUND, { id: id }),
  } : false,
].filter(Boolean);

function canAddJkiss(roundId) {
  if (rounds.get().get(roundId).type === "j-kiss") return false;

  const roundIds = [...rounds.get().keys()];
  const nextId = roundIds[roundIds.indexOf(roundId) + 1];

  if (!nextId) return true;

  return rounds.get(nextId).type !== "j-kiss";
}

function canAddSplit(roundId) {
  return rounds.get().get(roundId).type !== "j-kiss";
}

function canRemoveRound(roundId) {
  if (rounds.get().get(roundId).type === "founded") return false;

  const roundIds = [...rounds.get().keys()];
  const nextId = roundIds[roundIds.indexOf(roundId) + 1];
  const prevId = roundIds[roundIds.indexOf(roundId) - 1];

  if (!nextId) return true;

  return !(rounds.get(prevId).type === "j-kiss" && ["j-kiss", "split"].includes(rounds.get(nextId).type));
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
    cb: () => createDocument(store, { from: docId.get() }),
  },
  store.get("documents").size > 1 && {
    text: "削除",
    cb: () => removeDocument(store, { id: docId.get() }),
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
