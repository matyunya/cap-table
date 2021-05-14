<script>
  import Select from "/components/ui/Select.svelte";
  import axis from "d3-axis";
  import d3 from "d3-selection";
  import scale from "d3-scale";
  import array from "d3-array";
  import shape from "d3-shape";
  import { format } from "/utils/index.js";
  import dateFormat from "date-fns/format";
  import { documentIds } from "/store.js";

  const {
    activeDocChartData,
    chartDocStatus,
    chartDocId,
  } = require("/index.ellx");

  let el;

  $: if (el && $activeDocChartData && $chartDocStatus === "success") draw();

  const margin = { top: 40, right: 30, bottom: 30, left: 70 };
  const width = 1100;
  const height = 800;

  const fmt = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });

  function draw() {
    d3.select(el).selectAll("*").remove();

    const chart = d3
      .select(el)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 1140 800")
      .classed("inline-block", true)
      .append("g")
      .attr("width", width)
      .attr("height", height);

    const x = scale
      .scaleLinear()
      .domain(array.extent($activeDocChartData, (d, i) => i))
      .range([margin.left, width - margin.right]);

    chart
      .append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(
        axis
          .axisBottom(x)
          .ticks($activeDocChartData.length)
          .tickFormat((i) => {
            if (!$activeDocChartData[i]) return "";

            return dateFormat($activeDocChartData[i].date, "yy年M月");
          })
      );

    const y = scale
      .scaleLog()
      .domain(array.extent($activeDocChartData, (d) => +d.postMoney))
      .range([height - margin.bottom, margin.top]);

    const yPercent = scale
      .scaleSequential()
      .domain([0, array.max($activeDocChartData, (d) => +d.founderShare)])
      .range([height - margin.bottom, margin.top]);

    const r = scale
      .scaleLinear()
      .domain(array.extent($activeDocChartData, (d) => +d.postMoney))
      .range([4, 12]);

    const rPercent = scale
      .scaleLinear()
      .domain(array.extent($activeDocChartData, (d) => +d.founderShare))
      .range([5, 30]);

    chart
      .append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(
        axis
          .axisLeft(y)
          .ticks(3)
          .tickFormat((d) => fmt.format(d) + "円")
      );

    chart
      .append("g")
      .attr("class", "eval-ticks")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(
        axis
          .axisLeft(y)
          .ticks(3)
          .tickSize(-width + margin.left + margin.right - 15)
          .tickFormat((d) => "")
      );

    chart
      .append("g")
      .attr("class", "percent")
      .attr("transform", "translate(" + (width - margin.right + 15) + ",0)")
      .call(
        axis
          .axisRight(yPercent)
          .tickValues([0.333, 0.5, 0.666, 1])
          .tickSize(-width + margin.left + margin.right - 15)
          .tickFormat(format.percent.format)
      );

    chart
      .append("path")
      .datum($activeDocChartData)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr(
        "d",
        shape
          .line()
          .curve(shape.curveMonotoneX)
          .x((d, i) => x(i))
          .y((d) => yPercent(d.founderShare))
      );

    chart
      .append("path")
      .datum($activeDocChartData)
      .attr("fill", "none")
      .attr("stroke", "#0285c7")
      .attr("stroke-width", 2)
      .attr(
        "d",
        shape
          .line()
          .curve(shape.curveStep)
          .x((d, i) => x(i))
          .y((d) => y(d.postMoney))
      );

    const dotEvaluationNode = chart
      .selectAll("dot")
      .data($activeDocChartData)
      .enter();

    dotEvaluationNode
      .append("circle")
      .attr("r", (d, i) => (i === 0 ? 0 : r(d.postMoney)))
      .attr("fill", "#0285c7")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d) => y(d.postMoney));

    dotEvaluationNode
      .append("text")
      .attr("class", "label blue")
      .attr("x", (d, i) => x(i) - 25)
      .attr("y", (d) => y(d.postMoney) - 10 - r(d.postMoney))
      .text((d, i) => (i === 0 ? "" : fmt.format(d.postMoney) + "円"));

    const dotShareNode = chart
      .selectAll("dot")
      .data($activeDocChartData)
      .enter();

    dotShareNode
      .append("circle")
      .attr("r", (d, i) => (i === 0 ? 0 : rPercent(d.founderShare)))
      .attr("fill", "orange")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d) => yPercent(d.founderShare));

    dotShareNode
      .append("text")
      .attr("class", "label orange")
      .attr("x", (d, i) => x(i) + (d.founderShare > 0.2 ? -50 : 0))
      .attr(
        "y",
        (d) =>
          yPercent(d.founderShare) +
          (d.founderShare > 0.2 ? 1 : -1) * (10 + rPercent(d.founderShare))
      )
      .text((d, i) => (i === 0 ? "" : format.percent.format(d.founderShare)));

    const firstLabelNode = chart
      .selectAll("dot")
      .data($activeDocChartData.slice(0, 1))
      .enter();

    firstLabelNode
      .append("text")
      .attr("class", "post-money-label")
      .attr("x", 100)
      .attr("y", height - 40)
      .text("時価総額");

    firstLabelNode
      .append("text")
      .attr("class", "share-label")
      .attr("x", 100)
      .attr("y", 0 + 30)
      .text("経営者持分");
  }
</script>

<div class="mt-24">
  <div class="max-w-5xl mx-auto">
    <h2 class="font-bold text-lg my-6 text-left w-full tracking-wide">
      資本政策チャート
    </h2>
    <Select
      classes="focus:ring-2 w-32 truncate transition p-1 duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
      hasEmpty={false}
      value={$chartDocId}
      on:change={({ target }) =>
        window.ellx.router.go(`/chart/${target.value}`)}
      options={$documentIds}
    />
  </div>
  <div
    class="my-4 p-4 dark:bg-gray-900 bg-gray-100 shadow-lg rounded-lg z-50 max-w-5xl mx-auto"
    bind:this={el}
  />
</div>

<style>
  :global(text) {
    font-size: 12px;
  }

  :global(.label) {
    font-size: 14px;
    font-family: monospace;
  }

  :global(.blue) {
    color: #0285c7;
  }

  :global(.post-money-label) {
    color: #0285c7;
    font-size: 18px;
    font-weight: bold;
  }

  :global(.orange) {
    color: orange;
  }

  :global(.share-label) {
    color: orange;
    font-size: 18px;
    font-weight: bold;
  }

  :global(.eval-ticks .tick line) {
    opacity: 0.2;
    stroke-dasharray: 5 1;
  }

  :global(.tick text) {
    opacity: 0.8;
  }

  :global(.percent .tick line) {
    opacity: 0.6;
    stroke-dasharray: 5 5;
  }
  :global(.percent .domain, .eval-ticks .domain) {
    stroke: none;
  }
</style>
