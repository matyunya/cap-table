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
import { rowTypes as planRowTypes } from "/utils/actions/plans.js";
import { calcFundingPerYear, calculate } from "/utils/selectors.js";

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
].map((i) => [i, i]);

const BASIC_PERIODS = ["IPO", "N+1", "N+2"];

const BASIC_PERIOD_OPTIONS = BASIC_PERIODS.map((i) => [i, i]);

const getPlan = (data) => {
  const planId = data.planId;
  if (!planId) return null;
  return plans.get().get(planId);
};

const getDoc = (data) => {
  const plan = getPlan(data);
  if (!plan) return null;
  return docs.get().get(plan.docId);
};

const getIpoDate = ({ data }) => {
  const doc = getDoc(data);
  if (!doc || !doc.ipoRoundId) return null;

  return doc.rounds.get(doc.ipoRoundId).date;
};

const calcNetIncome = ({ data }) => {
  const ipoDate = getIpoDate({ data });

  if (!ipoDate) return 0;

  const year =
    new Date(ipoDate).getFullYear() + BASIC_PERIODS.indexOf(data.basicPeriod);

  return planRowTypes
    .find((i) => i.id === "netIncome")
    .calculate({
      year,
      data: getPlan(data).data,
      fundingAmount: calcFundingPerYear([year], getDoc(data)),
    });
};

const calcIpoRoundSharesAmount = ({ data }) => {
  const doc = getDoc(data);
  if (!doc || !doc.ipoRoundId) return 0;

  return calculate(doc.rounds, doc.investors)[
    doc.ipoRoundId
  ].values.totalSharesAmount.get("total");
};

const calcProjectValue = (p) =>
  calcNetIncome(p) * p.data.per * (1 - p.data.ipoDiscount / 100);

const calcIpoSharePrice = (p) =>
  (calcProjectValue(p) / calcIpoRoundSharesAmount(p)) * 1000;

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
    calculate: ({ data }) => (getDoc(data) || {}).title,
  },
  {
    label: "上場予定年月",
    id: "ipoDate",
    calculate: getIpoDate,
    format: "identity",
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
    calculate: calcNetIncome,
  },
  {
    label: "（B）IPO時点での適用PER",
    id: "per",
  },
  {
    label: "（C）IPOディスカウント",
    id: "ipoDiscount",
    format: "nominalPercent",
  },
  {
    label: "（D）企業価値",
    id: "projectValue",
    calculate: calcProjectValue,
  },
  {
    label: "（E）発行済株式数",
    id: "ipoRoundSharesAmount",
    calculate: calcIpoRoundSharesAmount,
  },
  {
    label: "（F）IPO時株価",
    id: "ipoSharePrice",
    calculate: calcIpoSharePrice,
  },
  {
    label: "（G）適用IRR（ハードルレート）",
    id: "hurdleRate",
    format: "nominalPercent",
  },
  {
    label: "（H）現在株価(理論値）",
    format: "currency",
    calculate: (p) =>
      getIpoDate(p)
        ? xnpv(
            p.data.hurdleRate / 100,
            [0, calcIpoSharePrice(p)],
            [new Date(), getIpoDate(p)]
          )
        : 0,
  },
];

const getDiffDays = (date1, date2) => {
  return Math.ceil(
    Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24)
  );
};

function xnpv(rate, values, dates) {
  return values.reduce(
    (acc, cur, i) =>
      acc + cur / Math.pow(1 + rate, getDiffDays(dates[0], dates[i]) / 365),
    0
  );
}

const fillEmpty =
  (cb) =>
  ({ data }) => {
    return cb({
      data: {
        ...EMPTY(types),
        ...Object.fromEntries(data),
      },
    });
  };

export const rowTypes = types.map((e) => ({
  ...e,
  calculate: e.calculate ? fillEmpty(e.calculate) : null,
}));

export function getTypeValue({ rowType, data }) {
  if (!data || !data.get) return null;

  if (rowType.calculate) {
    return rowType.calculate({ data });
  }

  return data.get(rowType.id);
}

export function formatValue(fn, value) {
  return format[fn || "number"].format(value || 0);
}
