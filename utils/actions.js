import { select } from "tinyx";
import {
  UPDATE_SHARE,
  UPDATE_SHARE_PRICE,
  UPDATE_GROUP_NAME,
  RENAME_ROUND,
  UPDATE_ROUND_DATE,
  UPDATE_JKISS_INVESTED,
  TOGGLE_PUBLIC,
  COPY_DOCUMENT,
  REMOVE_DOCUMENT,
  RESET_DOCUMENT,
  UPDATE_DOCUMENT_TITLE,
  UPDATE_SPLIT_BY,
  UPDATE_VALUATION_CAP,
  UPDATE_DISCOUNT,
  UPDATE_INVESTOR_NAME,
  UPDATE_INVESTOR_TITLE,

  syncUp,
  syncDocumentUp,
  store,
} from "/store.js";

import {
  totalShares,
  totalCommonShares,
  totalSharesForInvestor,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  format,
  uid,
} from "./index.js";

import router from "./router.js";

const { docId } = require("/index.ellx");

const getStore = () => select(store, () => ['documents', docId.get()]);

export const syncTable = (...args) => syncUp(getStore(), ...args);

export const renameDocument = ({ detail }) => syncTable(UPDATE_DOCUMENT_TITLE, detail);

export const updateSplitBy = ({ roundId, value }) => syncTable(UPDATE_SPLIT_BY, { roundId, value });

export const renameRound = ({ roundId, value }) => syncTable(RENAME_ROUND, { roundId, name: value });

const updateShares = type => ({ roundId, investorId, value }) => syncTable(UPDATE_SHARE, { roundId, investorId, shares: Number(value), type });

const updateInvestment = (mutation, fieldName) => ({ roundId, investorId, value }) => syncTable(mutation, { roundId, investorId, [fieldName]: Number(value) });

const updateJkissInvested = updateInvestment(UPDATE_JKISS_INVESTED, "jkissInvested");

const updateRound = (mutation, fieldName) => ({ roundId, value }) => syncTable(mutation, { roundId, [fieldName]: value });

export const updateRoundDate = ({ roundId, value }) => syncTable(UPDATE_ROUND_DATE, { roundId, date: value });

export const updateSharePrice = updateRound(UPDATE_SHARE_PRICE, "sharePrice");

export const updateValuationCap = ({ roundId, value }) => syncTable(UPDATE_VALUATION_CAP, { roundId, value });

export const updateDiscount = ({ roundId, value }) => syncTable(UPDATE_DISCOUNT, { roundId, value });

export const renameInvestorGroup = ({ oldName, newName }) => syncTable(UPDATE_GROUP_NAME, { oldName, newName });

export const renameInvestor = ({ investorId, value }) => syncTable(UPDATE_INVESTOR_NAME, { investorId, name: value });

export const updateInvestorTitle = ({ investorId, value }) => syncTable(UPDATE_INVESTOR_TITLE, { investorId, title: value });

const calcCell = calcFn =>
  (investors, rounds) =>
    ([investorId, investment]) => {
      return [
        investorId,
        calcFn({
          rounds,
          investors,
          investorId,
          ...investment
        })
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

const calcCommonShares = ({ rounds, investorId }) => totalCommonSharesForInvestor(rounds, investorId);

const calcCommonVotingShares = ({ rounds, investorId }) => totalVotingSharesForInvestor(rounds, investorId);

const calcTotalShares = ({ rounds, investorId }) => totalSharesForInvestor(rounds, investorId);

const colTypes = {
  sharesInitial: {
    label: "株式数",
    onChange: updateShares("common"),
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: format.number.format,
  },
  shareDiff: {
    label: "株式増減",
    onChange: updateShares("common"),
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: format.number.format,
  },
  sharesAmount: {
    label: "株式数",
    fn: calcCell(calcCommonShares),
    format: format.number.format,
  },
  sharesPercent: {
    label: "%",
    fn: calcCell(calcSharesPerRound),
    format: format.percent.format,
  },
  votingShareDiff: {
    label: "潜在株式増減",
    fn: calcCell(({ votingShares }) => votingShares || 0),
    onChange: updateShares("voting"),
    format: format.number.format,
  },
  votingSharesAmount: {
    label: "潜在株式数",
    fn: calcCell(calcCommonVotingShares),
    format: format.number.format,
  },
  jkissShares: {
    label: "株式数",
    fn: calcCell(({ commonShares }) => commonShares || 0),
    format: format.number.format,
  },
  jkissInvested: {
    label: "投資額",
    fn: calcCell(({ jkissInvested }) => jkissInvested || 0),
    format: format.currency.format,
    onChange: updateJkissInvested,
  },
  totalSharesAmount: {
    label: "発行済株式数",
    fn: calcCell(calcTotalShares),
    format: format.number.format,
  },
  totalSharesPercent: {
    label: "%",
    fn: calcCell(calcTotalSharesPerRound),
    format: format.percent.format,
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
} = colTypes;

const foundCols = { sharesInitial, sharesPercent };

const genericCols = {
  shareDiff,
  sharesAmount,
  sharesPercent,
  votingShareDiff,
  votingSharesAmount,
  totalSharesAmount,
  totalSharesPercent
}

const jkissCols = {
  jkissInvested,
  jkissShares,
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

function copyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export const togglePublic = (store) => {
  syncUp(store, TOGGLE_PUBLIC);
  copyToClipboard(window.location.href);
};

export const createDocument = (store, { from } = {}) => {
  const to = uid();
  syncDocumentUp(store, COPY_DOCUMENT, { from: store.get("documents", from), to }, to);

  const { userId, appId } = ellx.auth();

  router.set(`${userId}/${appId}/${to}`);
}

export const resetDocument = () => syncTable(RESET_DOCUMENT);

export const removeDocument = (store, { id }) => {
  const ids = [...store.get('documents').keys()];
  const idx = ids.indexOf(id);

  syncUp(store, REMOVE_DOCUMENT, { id });

  const { userId, appId } = ellx.auth();

  router.set(`${userId}/${appId}/${ids[idx - 1]}`);
}
