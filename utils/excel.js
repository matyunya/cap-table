import download from "~ellx-hub/lib/utils/download.js";
import { conclude } from "conclure@1.2.1";
import { cps } from "conclure@1.2.1/effects";
import { store } from "/store.js";
import _ from "/utils/intl.js";
import { uniqueGroups } from "/utils/index.js";
import { calculate, groupInvestors } from "/utils/selectors.js";

import { roundLabels } from "/utils/actions/docs.js";

const entityId = "generate-excel";

function createWorker(fn) {
  const code = fn.toString().replace(/^function.+?\{/g, "").slice(0, -1);
  const blob = new Blob([code], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
}

function makeWorker(bodyFunction) {
  const worker = createWorker(bodyFunction);
  const runningTasks = new Map();

  worker.onmessage = event => {
    const { type, taskId, entityId, output } = event.data;
    const request = runningTasks.get(entityId);

    if (!request || request.taskId !== taskId) return;
    const response = type === "error" ? [new Error(output)] : [null, output];

    runningTasks.delete(entityId);
    for (let cb of request.callbacks) cb(...response);
  };

  return function runTask(params, cb = () => { }) {
    const taskId = String(Math.random());
    const { callbacks } = runningTasks.get(entityId) || { callbacks: [] };
    callbacks.push(cb);

    runningTasks.set(entityId, { taskId, callbacks });

    worker.postMessage({ taskId, entityId, ...params });
  }
}

function xlsxWorker() {
  importScripts(
    "https://cdn.jsdelivr.net/npm/xlsx-populate/browser/xlsx-populate.min.js",
  );

  let wb;
  let investorsCount = 0;

  function addInvestors(sheet, investors) {
    investors.forEach((i, idx) => sheet.row(idx + 3).cell(1).value(i.label));
  }

  function addResultLabels(sheet, labels) {
    labels.forEach((label, idx) => sheet.row(idx + 3 + investorsCount).cell(1).value(label));
  }


  function addRoundResults(cursor, results, colSpan) {
    const { sharePrice, newEquity, preMoney, postMoney, preMoneyDiluted, postMoneyDiluted } = results;

    [sharePrice, newEquity, preMoney, postMoney, preMoneyDiluted, postMoneyDiluted].forEach((val) => {
      const range = cursor.rangeTo(cursor.relativeCell(0, colSpan - 1));
      range.merged(true);
      range.value(val);
      range
        .style({ italic: true, horizontalAlignment: "center", verticalAlignment: "center" })
        .style("numberFormat", formats.currency);
      cursor = cursor.relativeCell(1, 0);
    });

    cursor.row().style("topBorder", true);
  }

  const formats = {
    "percent": "0.0%",
    "number": "0",
    "currency": "¥#,##",
  };

  function makePanes(sheet, title) {
    sheet.column("A").width(25)
    sheet.column("A").style({ bold: true, horizontalAlignment: "left" });

    sheet.freezePanes(1, 2);

    const titleCell = sheet.range("A1:A2")
    titleCell.value(title);
    titleCell.style({ horizontalAlignment: "center", verticalAlignment: "center" })
    titleCell.merged(true);

    sheet.row(1).style({ bold: true });
    sheet.row(2).style({ bold: true });
  }

  const colLabels = (cols, cursor) => cols.forEach(([, label], idx) => cursor
    .relativeCell(1, idx)
    .value(label)
    .column()
    .width(15)
    .style({ horizontalAlignment: "right" }));


  const roundValues = (data, roundId, cols, cursor) => data.investors.forEach(({ id }, row) => {
    cols.forEach(([colType, , format], col) => {
      cursor
        .relativeCell(2 + row, col)
        .value(data.data[roundId].values[colType].get(id))
        .style("numberFormat", formats[format]);
    });
  });

  const totalValues = (data, roundId, cols, cursor) => cols.forEach(([colType, , format], col) => {
    cursor
      .relativeCell(2 + investorsCount, col)
      .value(data.data[roundId].values[colType].get("total"))
      .style("numberFormat", formats[format])
      .row()
      .style("bottomBorder", true);
  });

  const addSplitParams = (data, roundId, cursor) => cursor
    .relativeCell(9 + investorsCount, 0)
    .value(data.paramsLabels[2])
    .relativeCell(0, 1)
    .value(data.meta.rounds.get(roundId).splitBy);

  const addJkissParams = (data, roundId, cursor) => cursor
    .relativeCell(9 + investorsCount, 0)
    .value(data.paramsLabels[0])
    .style({ bold: data.data[roundId].isCapApplied })
    .relativeCell(1, 0)
    .value(data.paramsLabels[1])
    .style({ bold: !data.data[roundId].isCapApplied })
    .relativeCell(-1, 1)
    .value(data.meta.rounds.get(roundId).valuationCap)
    .style("numberFormat", formats.currency)
    .style({ bold: data.data[roundId].isCapApplied })
    .relativeCell(1, 0)
    .value(data.meta.rounds.get(roundId).discount)
    .style("numberFormat", formats.number)
    .style({ bold: !data.data[roundId].isCapApplied })

  function build(data) {
    investorsCount = data.investors.length;
    const sheet = wb.sheet(0);

    makePanes(sheet, data.meta.title);
    addInvestors(sheet, data.investors);
    addResultLabels(sheet, data.resultLabels);

    // Top left round cell (with round title)
    let cursor = sheet.cell("B1").active(true);

    for (const [roundId, { type, name, date }] of data.meta.rounds) {
      const cols = data.roundLabels[type];
      const colSpan = cols.length;

      // round name and date
      cursor.value(name);
      cursor.relativeCell(0, colSpan - 1).value(date);

      colLabels(cols, cursor);
      roundValues(data, roundId, cols, cursor);
      totalValues(data, roundId, cols, cursor);
      addRoundResults(cursor.relativeCell(3 + investorsCount, 0), data.data[roundId].roundResults, colSpan);

      if (type === "split") {
        addSplitParams(data, roundId, cursor);
      }
      if (type === "j-kiss") {
        addJkissParams(data, roundId, cursor);
      }

      cursor = cursor.relativeCell(0, colSpan).active(true);
      cursor.column().style("leftBorder", true);
    }

    return wb.outputAsync("arraybuffer");
  }

  self.addEventListener("message", async (event) => {
    let {
      taskId,
      data,
    } = event.data;

    if (!wb) {
      wb = await XlsxPopulate.fromBlankAsync();
    }

    try {
      const output = await build(data);
      self.postMessage({
        taskId,
        output,
        entityId: "generate-excel",
      });
    } catch (e) {
      console.log(e);
    }
  });
}

const requestGenerate = makeWorker(xlsxWorker);

export default function exportExcel(id) {
  const doc = store.get("documents", id);
  const { investors } = doc;
  const trans = _.get();

  const data = {
    meta: doc,
    data: calculate(doc.rounds, doc.investors),
    investors: groupInvestors(uniqueGroups(investors), investors),
    roundLabels: roundLabels(),
    paramsLabels: [
      "ﾊﾞﾘｭｴｰｼｮﾝｷｬｯﾌﾟ",
      "割引率",
      "分割数",
    ].map(trans),
    resultLabels: [
      "合計",
      "株価",
      "調達金額",
      "時価総額（Pre）",
      "時価総額（Post）",
      "時価総額（Pre/潜在込）",
      "時価総額（Post/潜在込）",
    ].map(trans)
  };
  conclude(cps(requestGenerate, { data }), (err, buf) => {
    // TODO: handle error
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    return download(data.meta.title + ".xlsx", blob);
  });
}
