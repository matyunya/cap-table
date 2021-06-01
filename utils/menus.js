import { createDocument, removeDocument } from "/utils/actions/docs.js";
import { uid, lastInvestorIdInGroup } from "./index.js";
import exportExcel from "/utils/excel.js";

import { syncCurrentItem as syncCurrentDoc } from "/utils/actions/generic.js";

import { store } from "/store.js";

import {
  ADD_INVESTOR,
  REMOVE_INVESTOR,
  ADD_ROUND,
  ADD_SPLIT_ROUND,
  REMOVE_ROUND,
  REMOVE_GROUP,
} from "/utils/mutations/docs.js";

import {
  createProject,
  removeProject,
  addYear,
  removeYear,
  setIPO,
} from "/utils/actions/plans.js";

const { activeItemId, rounds, isDoc, isPlan, projects, years } = require("/index.ellx");

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

  return !(
    rounds.get(prevId).type === "j-kiss" &&
    ["j-kiss", "split"].includes(rounds.get(nextId).type)
  );
}

export const investorGroupMenuItems = (group, investors, isFounderGroup) =>
  [
    {
      text: "グループ追加",
      cb: () =>
        syncCurrentDoc(ADD_INVESTOR, {
          newGroup: true,
          afterId: [...investors].reduce(lastInvestorIdInGroup(group), ""),
        }),
    },
    !isFounderGroup && {
      text: "削除",
      cb: () => syncCurrentDoc(REMOVE_GROUP, { group }),
    },
  ].filter(Boolean);

function canDeleteInvestors(group, investors) {
  const foundedGroup = investors.get().get("FOUNDER_ID").group;

  if (group !== foundedGroup) return true;

  return (
    [...investors.get().values()].filter((v) => v.group === foundedGroup)
      .length > 1
  );
}

export const investorMenuItems = (id, group, investors) =>
  [
    {
      text: "投資家追加",
      cb: () => syncCurrentDoc(ADD_INVESTOR, { afterId: id }),
    },
    canDeleteInvestors(group, investors) && {
      text: "削除",
      cb: () => syncCurrentDoc(REMOVE_INVESTOR, { id }),
    },
  ].filter(Boolean);

export const roundMenuItems = (id) =>
  [
    {
      text: "新ラウンド作成（普通株式）",
      cb: () =>
        syncCurrentDoc(ADD_ROUND, {
          type: "common",
          afterId: id,
        }),
    },
    canAddJkiss(id)
      ? {
        text: "J-kissラウンド作成",
        cb: () => {
          const newId = uid();
          syncCurrentDoc(ADD_ROUND, {
            type: "j-kiss",
            afterId: id,
            newId,
            name: "新しいJ-kissラウンド",
          }),
            setTimeout(() => {
              const el = document.querySelector(
                `[data-id="valuation:${newId}"]`
              );
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                el.click();
              }
            }, 200);
        },
      }
      : false,
    canAddSplit(id)
      ? {
        text: "株式分割ラウンド作成",
        cb: () =>
          syncCurrentDoc(ADD_SPLIT_ROUND, {
            type: "split",
            afterId: id,
            splitBy: 100,
          }),
      }
      : false,
    canRemoveRound(id)
      ? {
        text: "ラウンド削除",
        cb: () => syncCurrentDoc(REMOVE_ROUND, { id: id }),
      }
      : false,
  ].filter(Boolean);

export const getCommonMenuItems = (id) => [
  {
    text: "Excelでダウンロード",
    cb: () => exportExcel(id),
  },
  isDoc.get() && {
    text: "チャートを表示",
    cb: () => window.ellx.router.go("/docs?chart_doc_id=" + id),
  },
  (isPlan.get() || (isDoc.get() && store.get("documents").size > 1)) && {
    text: "削除",
    cb: () => removeDocument({ id }),
  },
].filter(Boolean);

export const getDocMenuItems = () => [
  {
    text: "新しいテーブル",
    cb: createDocument,
  },
  {
    text: "このテーブルを複製",
    cb: () => createDocument({ from: activeItemId.get() }),
  },
  ...getCommonMenuItems(activeItemId.get()),
].filter(Boolean);

export const getProjectMenuItems = ({ id }) => [
  {
    text: "新規事業を下に追加",
    cb: () => createProject({ afterId: id }),
  },
  projects.get().size > 1 && {
    text: "この事業を削除",
    cb: () => removeProject({ id }),
  },
].filter(Boolean);

export const getYearMenuItems = ({ year }) => [
  year === years.get()[years.get().length - 1] && {
    text: "次の年度を追加",
    cb: () => addYear(),
  },
  years.get().length > 2 && year === years.get()[years.get().length - 1] && {
    text: "この年度を削除",
    cb: () => removeYear({ year }),
  },
  year !== years.get()[0] && {
    text: "この年度でIPOする",
    cb: () => setIPO({ year }),
  },
].filter(Boolean);
