import {
  togglePublic,
  createDocument,
  removeDocument,
  resetDocument,
  syncCurrentDoc,
} from "./actions.js";
import {
  uid,
  lastInvestorIdInGroup,
} from "./index.js";
import exportExcel from "/utils/excel.js";

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

export const investorGroupMenuItems = (group, investors, isFounderGroup) => [
  {
    text: "グループ追加",
    cb: () => syncCurrentDoc(
      ADD_INVESTOR,
      {
        newGroup: true,
        afterId: [...investors].reduce(lastInvestorIdInGroup(group), "")
      }
    )
  },
  !isFounderGroup && {
    text: "削除",
    cb: () => syncCurrentDoc(REMOVE_GROUP, { group }),
  },
].filter(Boolean);

export const investorMenuItems = (id, group) => [{
  text: "投資家追加",
  cb: () => syncCurrentDoc(ADD_INVESTOR, { afterId: id }),
},
group !== "Founder" && {
  text: "削除",
  cb: () => syncCurrentDoc(REMOVE_INVESTOR, { id }),
}].filter(Boolean);

export const roundMenuItems = (id) => [
  {
    text: "新ラウンド作成（普通株式）",
    cb: () => syncCurrentDoc(
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
      syncCurrentDoc(ADD_ROUND, { type: "j-kiss", afterId: id, newId }),
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
    cb: () => syncCurrentDoc(ADD_SPLIT_ROUND, { type: "split", afterId: id, splitBy: 100 }),
  } : false,
  canRemoveRound(id) ? {
    text: "ラウンド削除",
    cb: () => syncCurrentDoc(REMOVE_ROUND, { id: id }),
  } : false,
].filter(Boolean);

export const getCommonMenuItems = (id) => [
  {
    text: "Excelでダウンロード",
    cb: () => exportExcel(id),
  },
  {
    text: "チャートを表示",
    cb: () => null, // TODO:
  },
  store.get("documents").size > 1 && {
    text: "削除",
    cb: () => removeDocument({ id }),
  },
];

export const getDocMenuItems = () => [
  {
    text: "新しいテーブル",
    cb: createDocument,
  },
  {
    text: store.get("documents", docId.get(), "access", "read", "public") ? "共有をキャンセル" : "共有する",
    cb: togglePublic,
  },
  {
    text: "このテーブルをコピー",
    cb: () => createDocument({ from: docId.get() }),
  },
  ...getCommonMenuItems(docId.get()),
  {
    text: "リセット",
    cb: resetDocument,
  },
].filter(Boolean);

