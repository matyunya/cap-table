import {
  createDocument,
  removeDocument,
  setIpoRoundId,
} from "/utils/actions/docs.js";
import { uid, lastInvestorIdInGroup } from "./index.js";
import exportExcel from "/utils/excel.js";

import { syncCurrentItem as syncCurrentDoc } from "/utils/actions/generic.js";
import { createPlan, removePlan } from "/utils/actions/plans.js";
import { createScenario, removeScenario } from "/utils/actions/scenarios.js";

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
} from "/utils/actions/plans.js";

const {
  activeItemId,
  rounds,
  planDocId,
  projects,
  scenarios,
  years,
  docPlanId,
  userId,
} = require("/index.ellx");

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
    id !== "founded" && {
      text: "このラウンドでIPO",
      cb: () => setIpoRoundId({ roundId: id }),
    },
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
          cb: () => syncCurrentDoc(REMOVE_ROUND, { id }),
        }
      : false,
  ].filter(Boolean);

export const getDocMenuItems = () =>
  [
    {
      text: "新しいテーブル",
      cb: createDocument,
    },
    {
      text: "このテーブルを複製",
      cb: () => createDocument({ from: activeItemId.get() }),
    },
    {
      text: "Excelでダウンロード",
      cb: () => exportExcel(activeItemId.get()),
    },
    docPlanId.get() && {
      text: "紐づけた事業計画へ",
      cb: () =>
        window.ellx.router.go(`/plans/${userId.get()}/${docPlanId.get()}`),
    },
    {
      text: "チャートを表示",
      cb: () =>
        window.ellx.router.go("/docs?chart_doc_id=" + activeItemId.get()),
    },
    store.get().documents.size > 1 && {
      text: "削除",
      cb: () => removeDocument({ id: activeItemId.get() }),
    },
  ].filter(Boolean);

export const getPlanMenuItems = () =>
  [
    {
      text: "新しい計画",
      cb: createPlan,
    },
    {
      text: "この計画を複製",
      cb: () => createPlan({ from: activeItemId.get() }),
    },
    planDocId.get() && {
      text: "紐づけた資本政策へ",
      cb: () =>
        window.ellx.router.go(`/docs/${userId.get()}/${planDocId.get()}`),
    },
    store.get().plans.size > 1 && {
      text: "削除",
      cb: () => removePlan({ id: activeItemId.get() }),
    },
  ].filter(Boolean);

export const getProjectMenuItems = ({ id }) =>
  [
    {
      text: "新規事業を下に追加",
      cb: () => createProject({ afterId: id }),
    },
    projects.get().size > 1 && {
      text: "この事業を削除",
      cb: () => removeProject({ id }),
    },
  ].filter(Boolean);

export const getYearMenuItems = ({ year }) =>
  [
    year === years.get()[years.get().length - 1] && {
      text: "次の年度を追加",
      cb: () => addYear(),
    },
    years.get().length > 2 &&
      year === years.get()[years.get().length - 1] && {
        text: "この年度を削除",
        cb: () => removeYear({ year }),
      },
  ].filter(Boolean);

// TODO
export const getScenarioMenuItems = ({ id }) =>
  [
    {
      text: "新規シナリオを追加",
      cb: () => createScenario(),
    },
    scenarios.get().size > 1 && {
      text: "このシナリオを削除",
      cb: () => removeScenario({ id }),
    },
  ].filter(Boolean);
