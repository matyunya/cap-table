import { promptYesNo } from "/components/ui/ConfirmationDialog.svelte";
import { select } from "tinyx";
import _ from "/utils/intl.js";
import {
  syncUp,
  syncItemUp,
  store,
} from "/store.js";

import {
  UPDATE_SHARE,
  UPDATE_SHARE_PRICE,
  UPDATE_GROUP_NAME,
  RENAME_ROUND,
  UPDATE_ROUND_DATE,
  UPDATE_JKISS_INVESTED,
  UPDATE_JKISS_STOCK_OPTIONS,
  COPY_DOCUMENT,
  REMOVE_DOCUMENT,
  UPDATE_DOCUMENT_TITLE,
  UPDATE_SPLIT_BY,
  UPDATE_VALUATION_CAP,
  UPDATE_DISCOUNT,
  UPDATE_INVESTOR_NAME,
  UPDATE_INVESTOR_TITLE,
} from "/utils/mutations/docs.js";

import {
  totalShares,
  totalCommonShares,
  totalSharesForInvestor,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  uid,
} from "/utils/index.js";

import {
  syncCurrentItem as syncCurrentDoc,
  syncItem as syncDoc,
} from "/utils/actions/generic.js";

const { userId, route } = require("/index.ellx");

export const renameDocument = ({ detail, id }) =>
  id
    ? syncDoc(id, UPDATE_DOCUMENT_TITLE, detail)
    : syncCurrentDoc(UPDATE_DOCUMENT_TITLE, detail);

export const updateSplitBy = ({ roundId, value }) =>
  syncCurrentDoc(UPDATE_SPLIT_BY, { roundId, value });

export const renameRound = ({ roundId, value }) =>
  syncCurrentDoc(RENAME_ROUND, { roundId, name: value });

const updateShares =
  (type) =>
    ({ roundId, investorId, value }) =>
      syncCurrentDoc(UPDATE_SHARE, {
        roundId,
        investorId,
        shares: Number(value),
        type,
      });

const updateInvestment =
  (mutation, fieldName) =>
    ({ roundId, investorId, value }) =>
      syncCurrentDoc(mutation, {
        roundId,
        investorId,
        [fieldName]: Number(value),
      });

const updateJkissInvested = updateInvestment(
  UPDATE_JKISS_INVESTED,
  "jkissInvested"
);
const updateJkissStockOptions = updateInvestment(
  UPDATE_JKISS_STOCK_OPTIONS,
  "jkissStockOptions"
);

const updateRound =
  (mutation, fieldName) =>
    ({ roundId, value }) =>
      syncCurrentDoc(mutation, { roundId, [fieldName]: value });

export const updateRoundDate = ({ roundId, value }) =>
  syncCurrentDoc(UPDATE_ROUND_DATE, { roundId, date: value });


export const updateSharePrice = updateRound(UPDATE_SHARE_PRICE, "sharePrice");

export const updateValuationCap = ({ roundId, value }) =>
  syncCurrentDoc(UPDATE_VALUATION_CAP, { roundId, value });

export const updateDiscount = ({ roundId, value }) =>
  syncCurrentDoc(UPDATE_DISCOUNT, { roundId, value });

export const renameInvestorGroup = ({ oldName, newName }) =>
  syncCurrentDoc(UPDATE_GROUP_NAME, { oldName, newName });

export const renameInvestor = ({ investorId, value }) =>
  syncCurrentDoc(UPDATE_INVESTOR_NAME, { investorId, name: value });

export const updateInvestorTitle = ({ investorId, value }) =>
  syncCurrentDoc(UPDATE_INVESTOR_TITLE, { investorId, title: value });

const calcCell =
  (calcFn) =>
    (investors, rounds) =>
      ([investorId, investment]) => {
        return [
          investorId,
          calcFn({
            rounds,
            investors,
            investorId,
            ...investment,
          }),
        ];
      };

const calcSharesPerRound = ({ rounds, investorId }) => {
  const total = totalCommonShares(rounds);
  const previousRoundShares = totalCommonSharesForInvestor(rounds, investorId);

  return previousRoundShares / total;
};

const calcTotalSharesPerRound = ({ rounds, investorId }) => {
  const total = totalShares(rounds);
  const previousRoundShares = totalSharesForInvestor(rounds, investorId);

  return previousRoundShares / total;
};

const calcCommonShares = ({ rounds, investorId }) =>
  totalCommonSharesForInvestor(rounds, investorId);

const calcCommonVotingShares = ({ rounds, investorId }) =>
  totalVotingSharesForInvestor(rounds, investorId);

const calcTotalShares = ({ rounds, investorId }) =>
  totalSharesForInvestor(rounds, investorId);

const colTypes = {
  sharesInitial: {
    label: "株式数",
    onChange: updateShares("common"),
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: "number",
  },
  shareDiff: {
    label: "株式増減",
    onChange: updateShares("common"),
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: "number",
  },
  sharesAmount: {
    label: "株式数",
    fn: calcCell(calcCommonShares),
    format: "number",
  },
  sharesPercent: {
    label: "%",
    fn: calcCell(calcSharesPerRound),
    format: "percent",
  },
  votingShareDiff: {
    label: "潜在株式増減",
    fn: calcCell(({ votingShares }) => votingShares || 0),
    onChange: updateShares("voting"),
    format: "number",
  },
  votingSharesAmount: {
    label: "潜在株式数",
    fn: calcCell(calcCommonVotingShares),
    format: "number",
  },
  jkissShares: {
    label: "株式数",
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: "number",
  },
  jkissInvested: {
    label: "投資額",
    fn: calcCell(({ jkissInvested }) => jkissInvested || 0),
    format: "currency",
    onChange: updateJkissInvested,
  },
  jkissStockOptions: {
    label: "新株予約権個数",
    fn: calcCell(({ jkissStockOptions }) => jkissStockOptions || 0),
    format: "number",
    onChange: updateJkissStockOptions,
  },
  totalSharesAmount: {
    label: "発行済株式数",
    fn: calcCell(calcTotalShares),
    format: "number",
  },
  totalSharesPercent: {
    label: "%",
    fn: calcCell(calcTotalSharesPerRound),
    format: "percent",
  },
};

const {
  sharesInitial,
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent,
  jkissShares,
  jkissInvested,
  jkissStockOptions,
} = colTypes;

const foundCols = { sharesInitial, sharesPercent };

const genericCols = {
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent,
};

const jkissCols = {
  jkissInvested,
  jkissShares,
  jkissStockOptions,
};

export const roundOptions = {
  founded: {
    colSpan: foundCols.length,
    cols: foundCols,
  },
  common: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
  "j-kiss": {
    colSpan: jkissCols.length,
    cols: jkissCols,
  },
  split: {
    colSpan: genericCols.length,
    cols: genericCols,
  },
};

export const roundTypes = Object.keys(roundOptions);

function filterRoundLabels({ cols }) {
  return Object.keys(cols).map((k) => [
    k,
    _.get()(cols[k].label),
    cols[k].format,
  ]);
}

export const roundLabels = () =>
  roundTypes.reduce(
    (acc, type) => ({
      ...acc,
      [type]: filterRoundLabels(roundOptions[type]),
    }),
    {}
  );

export const createDocument = ({ from } = {}) => {
  const to = uid();

  syncItemUp(
    store,
    COPY_DOCUMENT,
    { from: store.get("documents", from), to },
    to,
    "documents",
  );

  window.ellx.router.go(`/docs/${userId.get()}/${to}`);
};

export const removeDocument = async ({ id }) => {
  const ok = await promptYesNo({
    title: `このテーブルを削除してもよろしいですか？`,
    yesText: "はい",
    noText: "キャンセル",
    modal: false,
  });

  if (!ok) return;

  const ids = [...store.get("documents").keys()];
  const idx = ids.indexOf(id);

  syncItemUp(store, REMOVE_DOCUMENT, { id }, id, "documents");

  if (route.get().startsWith("/docs/")) {
    window.ellx.router.go(`/docs/${userId.get()}/${ids[idx - 1]}`);
  }
};
