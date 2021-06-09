import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import _ from "/utils/intl.js";
import { store } from "/store.js";
import { syncItemUp } from "/models/generic.js";
import { format, EMPTY } from "/utils/index.js";
import {
  COPY_SCENARIO,
  REMOVE_SCENARIO,
  UPDATE_SCENARIO_TITLE,
  UPDATE_CELL,
  SET_SCENARIO_PLAN_ID,
} from "/utils/mutations/scenarios.js";
import { uid } from "/utils/index.js";
import { syncItem } from "/utils/actions/generic.js";

const { planIds, plans, docs } = require("/index.ellx");

export const updateCell = (id, params) => syncItem(id, UPDATE_CELL, params);

export const setScenarioPlanId = (id, params) =>
  syncItem(id, SET_SCENARIO_PLAN_ID, params);

export const renameScenario = ({ detail, id }) =>
  syncItem(id, UPDATE_SCENARIO_TITLE, detail);

export const createScenario = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_SCENARIO,
    { from: store.get("scenarios", from), to },
    to,
    "scenarios"
  );
};

export const removeScenario = async ({ id }) => {
  const ok = await promptYesNo({
    title: `この株価算定を削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  syncItemUp(store, REMOVE_SCENARIO, { id }, id, "scenarios");
};

const CURRENT_STAGE_OPTIONS = [
  "創業",
  "プロトタイプ完成",
  "プロダクトローンチ済",
  "PMF済",
  "N+1",
  "N+2",
].map(i => [i, i]);

const BASIC_PERIOD_OPTIONS = ["IPO", "N+1", "N+2"].map(i => [i, i]);

const types = [
  {
    label: "事業計画",
    id: "planId",
    options: () => planIds.get(),
  },
  {
    label: "資本政策（事業計画に紐づいた）",
    id: "docTitle",
    format: "identity",
    calculate: ({ data }) => {
      const planId = data.get("planId");
      if (!planId) return "-";
      const plan = plans.get().get(planId);
      if (!plan) return "-";

      return (docs.get().get(plan.docId) || {}).title || "-"; // TODO: left align
    }
  },
  {
    label: "上場予定年月",
    id: "ipoYear",
    calculate: ({ ipoYear }) => ipoYear,
  },
  {
    label: "今回ラウンド",
    id: "currentStage",
    options: CURRENT_STAGE_OPTIONS,
  },
  {
    label: "基準期の選択",
    id: "basicPeriod",
    options: BASIC_PERIOD_OPTIONS,
  },
  {
    label: "（A）基準期の純利益",
    id: "netIncome",
    calculate: ({ plan }) => plan.netIncome || 0,
  },
  {
    label: "（B）IPO時点での適用PER",
  },
  {
    label: "（C）IPOディスカウント",
    id: "ipoDiscount",
    format: "nominalPercent",
  },
  {
    label: "（D）企業価値",
    id: "projectValue",
    calculate: (i) => 0, // TODO: excel
  },
  {
    label: "（E）発行済株式数",
  },
  {
    label: "（F）IPO時株価",
  },
  {
    label: "（G）適用IRR（ハードルレート）",
    id: "hurdleRate",
    format: "nominalPercent",
  },
  {
    label: "（H）現在株価(理論値）",
    calculate: (i) => 0, // TODO: excel
  },
];

const fillEmpty = (cb) => (args) => {
  return cb({
    ...args,
    ...EMPTY(types),
  });
};

export const rowTypes = types.map((e) => ({
  ...e,
  calculate: e.calculate ? fillEmpty(e.calculate) : null,
}));

export function getTypeValue({ rowType, data }) {
  if (rowType.calculate) {
    return rowType.calculate({ data, plan: {} });
  }

  return data.get(rowType.id);
}

export function formatValue(fn, value) {
  return format[fn || "number"].format(value || 0);
}
