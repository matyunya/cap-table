import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import { format, EMPTY } from "/utils/index.js";
import _ from "/utils/intl.js";
import { store } from "/store.js";
import { syncItemUp } from "/models/generic.js";

import {
  COPY_PLAN,
  REMOVE_PLAN,
  UPDATE_PLAN_TITLE,
  RENAME_PROJECT,
  REMOVE_PROJECT,
  CREATE_PROJECT,
  UPDATE_CELL,
  ADD_YEAR,
  REMOVE_YEAR,
  SET_PLAN_DOC_ID,
  UPDATE_TAX_RATE,

  DEFAULT_TAX_RATE,
} from "/utils/mutations/plans.js";

import { uid } from "/utils/index.js";

import {
  syncCurrentItem as syncCurrentPlan,
  syncItem as syncPlan,
} from "/utils/actions/generic.js";

const { userId, route } = require("/index.ellx");

export const updateCell = (params) => syncCurrentPlan(UPDATE_CELL, params);

export const setPlanDocId = ({ id }) =>
  syncCurrentPlan(SET_PLAN_DOC_ID, { id });

export const updateTaxRate = ({ value }) =>
  syncCurrentPlan(UPDATE_TAX_RATE, { value });

export const renamePlan = ({ detail, id }) =>
  id
    ? syncPlan(id, UPDATE_PLAN_TITLE, detail)
    : syncCurrentPlan(UPDATE_PLAN_TITLE, detail);

export const renameProject = ({ projectId, title }) =>
  syncCurrentPlan(RENAME_PROJECT, { projectId, title });

export const createPlan = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_PLAN,
    { from: store.get("plans", from), to },
    to,
    "plans"
  );

  window.ellx.router.go(`/plans/${userId.get()}/${to}`);
};

export const removePlan = async ({ id }) => {
  const ok = await promptYesNo({
    title: `この事業計画を削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  const ids = [...store.get("plans").keys()];
  const idx = ids.indexOf(id);

  syncItemUp(store, REMOVE_PLAN, { id }, id, "plans");

  if (route.get().startsWith("/plans/")) {
    window.ellx.router.go(`/plans/${userId.get()}/${ids[idx - 1]}`);
  }
};

export const createProject = ({ afterId }) =>
  syncCurrentPlan(CREATE_PROJECT, { afterId });

export const removeProject = ({ id }) =>
  syncCurrentPlan(REMOVE_PROJECT, { id });

export const addYear = () => syncCurrentPlan(ADD_YEAR);

export const removeYear = ({ year }) => syncCurrentPlan(REMOVE_YEAR, { year });

const rateForField =
  (field) =>
  ({ year, data }) => {
    const prev = fieldSum(data.get(year - 1) || {}, field);
    if (!prev) return 0;

    const cur = fieldSum(data.get(year) || {}, field);
    if (!cur) return 0;

    return (cur - prev) / prev;
  };

const fillEmpty =
  (cb) =>
  ({ year, data, ...extra }) => {
    const yearData = data.get(year);
    if (!yearData) return 0;

    return cb({
      year,
      data,
      ...extra, // tax rate, funding amount, externals calc should react to
      yearData: {
        ...EMPTY(types),
        ...yearData,
      },
    });
  };

const calculateTax = (p) =>
  Math.max((calcProfitAndLossBeforeTax(p) * (p.taxRate ?? DEFAULT_TAX_RATE)) / 100, 0);

const calcFundingAmount = ({ fundingAmount, year }) => fundingAmount[year];

const calcSingleGrossProfit = ({ yearData: d, projectId }) =>
  (d.sales[projectId] || 0) - (d.costOfSales[projectId] || 0);

const calcSingleOperatingIncome = (p) => calcSingleGrossProfit(p) -
  (p.yearData.expenses[p.projectId] || 0);


const sum = (obj) => Object.keys(obj).reduce((acc, key) => acc + obj[key], 0);

const calcGrossProfit = ({ yearData: d }) => sum(d.sales) - sum(d.costOfSales);

const calcOperatingIncome = (p) =>
  calcGrossProfit(p) - sum(p.yearData.expenses);

const calcOrdinaryIncome = (p) =>
  calcOperatingIncome(p) +
  p.yearData.nonOperatingIncome -
  p.yearData.nonOperatingExpenses;

const calcProfitAndLossBeforeTax = (p) =>
  calcOrdinaryIncome(p) +
  p.yearData.extraordinaryProfit -
  p.yearData.extraordinaryLoss;

const types = [
  {
    id: "sales",
    label: "売上高",
    hasProjects: true,
  },
  {
    id: "salesGrowthRate",
    label: "売上高成長率",
    format: "percent",
    calculate: rateForField("sales"),
  },
  {
    id: "costOfSales",
    label: "売上原価",
    hasProjects: true,
  },
  {
    id: "grossProfit",
    label: "売上総利益",
    hasProjects: true,
    calculateSingle: calcSingleGrossProfit,
    calculate: calcGrossProfit,
  },
  {
    id: "expenses",
    label: "販売費及び一般管理費",
    hasProjects: true,
  },
  {
    id: "operatingIncome",
    label: "営業利益",
    hasProjects: true,
    calculateSingle: calcSingleOperatingIncome,
    calculate: calcOperatingIncome,
  },
  {
    id: "operatingProfitMargin",
    label: "営業利益率",
    format: "percent",
    calculate: (p) => calcOperatingIncome(p) / sum(p.yearData.sales),
  },
  {
    id: "nonOperatingIncome",
    label: "営業外収入",
  },
  {
    id: "nonOperatingExpenses",
    label: "営業外費用",
  },
  {
    id: "ordinaryIncome",
    label: "経常利益",
    calculate: calcOrdinaryIncome,
  },
  {
    id: "extraordinaryProfit",
    label: "特別利益",
  },
  {
    id: "extraordinaryLoss",
    label: "特別損失",
  },
  {
    id: "profitAndLossBeforeTax",
    label: "税引前当期損益",
    calculate: calcProfitAndLossBeforeTax,
  },
  {
    id: "corporateTaxEffectiveTaxRate",
    label: "法人税（実効税率）",
    calculate: calculateTax,
  },
  {
    id: "netIncome",
    label: "当期利益",
    calculate: (p) => {
      return calcProfitAndLossBeforeTax(p) - calculateTax(p);
    },
  },
  {
    id: "cashAndDepositBalance",
    label: "現預金残高",
  },
  {
    id: "capitalInvestmentAmount",
    label: "設備投資額",
    hasProjects: true,
  },
  {
    id: "workingCapital",
    label: "運転資金",
    hasProjects: true,
  },
  {
    id: "depreciationAmount",
    label: "減価償却額",
    hasProjects: true,
  },
  {
    id: "numberOfEmployees",
    label: "従業員数",
    hasProjects: true,
  },
  {
    id: "fundingAmount",
    label: "資金調達額",
    calculate: ({ yearData: d, fundingAmount, year }) =>
      d.borrowingGovernment +
      d.borrowingPrivate +
      d.ownResources +
      d.other +
      calcFundingAmount({ fundingAmount, year }),
  },
  {
    id: "stockFinancing",
    label: "株式資金調達",
    calculate: calcFundingAmount,
  },
  {
    id: "borrowingGovernment",
    label: "政府系金融機関借入",
  },
  {
    id: "borrowingPrivate",
    label: "民間金融機関借入",
  },
  {
    id: "ownResources",
    label: "自己資金",
  },
  {
    id: "other",
    label: "その他",
  },
];

export const rowTypes = types.map((e) => ({
  ...e,
  calculate: e.calculate ? fillEmpty(e.calculate) : null,
  calculateSingle: e.calculateSingle ? fillEmpty(e.calculateSingle) : null,
}));

const fieldSum = (yearData, field) =>
  Object.keys(yearData[field] || {}).reduce(
    (acc, cur) => acc + yearData[field][cur],
    0
  );

export function getTypeValue({ rowType, year, data, ...extra }) {
  const yearData = data.get(year);
  if (!yearData) return "";

  if (rowType.calculate) {
    return rowType.calculate({ year, data, ...extra });
  }

  if (rowType.hasProjects) {
    return fieldSum(yearData, rowType.id);
  }

  return yearData[rowType.id];
}

export function formatValue(fn, value) {
  return format[fn || "number"].format(value || 0);
}

export function getProjectValue(id, year, data, projectId, calculate) {
  const yearData = data.get(year) || {};

  const parent = yearData[id];

  if (calculate) {
    return calculate({ year, data, projectId });
  }

  return parent ? parent[projectId] : 0;
}
