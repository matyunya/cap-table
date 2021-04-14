import { select } from "tinyx";
import {
  UPDATE_SHARE,
  UPDATE_SHARE_PRICE,
  UPDATE_GROUP_NAME,
  REMOVE_GROUP,
  ADD_INVESTOR,
  RENAME_ROUND,
  UPDATE_ROUND_DATE,
  UPDATE_JKISS_INVESTED,
  TOGGLE_PUBLIC,
  COPY_DOCUMENT,
  REMOVE_DOCUMENT,
  RESET_DOCUMENT,
  syncUp,
  syncDocumentUp,
  store,
  UPDATE_DOCUMENT_TITLE,
  UPDATE_SPLIT_BY,
  UPDATE_VALUATION_CAP,
  UPDATE_DISCOUNT,
} from "/store.js";

import {
  totalShares,
  totalCommonShares,
  totalSharesForInvestor,
  totalCommonSharesForInvestor,
  totalVotingSharesForInvestor,
  format,
  allGroups,
  lastInvestorIdInGroup,
  uid,
} from "./index.js";

import router from "./router.js";

const { docId } = require("/index.ellx");

const getStore = () => select(store, () => ['documents', docId.get()]);

const syncTable = (...args) => syncUp(getStore(), ...args);

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

export function groupNames(investors) {
  const investorGroups = allGroups(investors);

  return investorGroups.reduce((acc, cur, i) => {
    if (investorGroups[i - 1] === cur) {
      return acc;
    }

    return [
      ...acc,
      [
        `group-label:${cur}:${i}`,
        {
          value: cur,
          onChange: (store, { value }) => {
            syncUp(store, UPDATE_GROUP_NAME, { oldName: cur, newName: value });
          },
          menuItems: (store, { id }) => [
            {
              text: "グループ追加",
              cb: () => {
                syncUp(
                  store,
                  ADD_INVESTOR,
                  {
                    newGroup: true,
                    afterId: [...store.get('investors')].reduce(lastInvestorIdInGroup(id.split(':')[1]), "")
                  }
                )
              },
            },
            {
              text: "削除",
              cb: () => syncUp(store, REMOVE_GROUP, { group: id.split(':')[1] }),
            },
          ],
        }
      ],
    ];
  }, []);
}

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
    label: "株式増減",
    hasRowspan: true,
    fn: calcCell(({ votingShares }) => votingShares || 0),
    onChange: updateShares("voting"),
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
  votingSharesAmount: {
    label: "株式数",
    fn: calcCell(calcCommonVotingShares),
    format: format.number.format,
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

export const resetDocument = (store) => {
  syncUp(store, RESET_DOCUMENT);
}

export const removeDocument = (store, { id }) => {
  const ids = [...store.get('documents').keys()];
  const idx = ids.indexOf(id);

  syncUp(store, REMOVE_DOCUMENT, { id });

  const { userId, appId } = ellx.auth();

  router.set(`${userId}/${appId}/${ids[idx - 1]}`);
}
