<script>
  import Select from "/components/ui/Select.svelte";
  import axis from "d3-axis";
  import d3 from "d3-selection";
  import scale from "d3-scale";
  import array from "d3-array";
  import shape from "d3-shape";
  import { format } from "/utils/index.js";
  import dateFormat from "date-fns/format";

  const {
    activeDocChartData,
    chartDocStatus,
    chartDocId,
    itemIds,
  } = require("/index.ellx");

  let el, tooltipEl, tip;

  $: if (el && $activeDocChartData && $chartDocStatus === "success") draw();

  const margin = { top: 80, right: 0, bottom: 55, left: 100 };
  const width = 1500;
  const height = 760;

  const fmt = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });

  function draw() {
    d3.select(el).selectAll("svg").remove();

    const chart = d3
      .select(el)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 1600 800")
      .attr("height", 460)
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

            try {
              return dateFormat($activeDocChartData[i].date, "yy年M月");
            } catch {
              return $activeDocChartData[i].date || "Invalid date";
            }
          })
      );

    const y = scale
      .scaleLog()
      .domain(array.extent($activeDocChartData, (d) => +d.newEquity))
      .range([height - margin.bottom, margin.top]);

    const yPercent = scale
      .scaleSequential()
      .domain([0, array.max($activeDocChartData, (d) => +d.founderShare)])
      .range([height - margin.bottom, margin.top]);

    const r = scale
      .scaleLinear()
      .domain(array.extent($activeDocChartData, (d) => +d.newEquity))
      .range([5, 30]);

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
          .tickValues([0.333, 0.5, 0.666])
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
          .y((d) => y(d.newEquity))
      );

    const dotEvaluationNode = chart
      .selectAll("dot")
      .data($activeDocChartData)
      .enter();

    dotEvaluationNode
      .append("circle")
      .attr("r", (d, i) => (i === 0 ? 0 : r(d.newEquity)))
      .attr("fill", "#0285c7")
      .attr("class", "cursor-pointer")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d) => y(d.newEquity))
      .on("mouseover", function (d, i) {
        tip = {
          value: fmt.format(i.postMoney) + "円",
          pos: [d.clientX, d.clientY],
        };
      })
      .on("mouseout", function (d, i) {
        setTimeout(() => (tip = false), 400);
      });

    dotEvaluationNode
      .append("text")
      .attr("class", "label blue cursor-pointer")
      .attr("x", (d, i) => x(i) - 25)
      .attr("y", (d) => y(d.newEquity) - 10 - r(d.newEquity))
      .text((d, i) => (i === 0 ? "" : fmt.format(d.newEquity) + "円"))
      .on("mouseover", function (d, i) {
        tip = {
          value: fmt.format(i.postMoney) + "円",
          pos: [d.clientX, d.clientY],
        };
      })
      .on("mouseout", function (d, i) {
        setTimeout(() => (tip = false), 400);
      });

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
      .attr("y", height)
      .text("調達金額");

    firstLabelNode
      .append("text")
      .attr("class", "share-label")
      .attr("x", 100)
      .attr("y", 50)
      .text("経営者持分");

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
</script>

{#if $chartDocId}
  <div
    class:opacity-0={!tip}
    class:opacity-100={tip}
    style="left: {tip && tip.pos[0]}px; top: {tip && tip.pos[1]}px"
    bind:this={tooltipEl}
    class="fixed bg-white shadow-xl rounded-lg p-2 flex items-center z-50 transition duration-100 text-xs"
  >
    {tip ? "時価総額: " + tip.value : ""}
  </div>

  <div
    id="chart"
    style="min-height: 460px"
    class="my-4 p-4 dark:bg-gray-900 bg-white shadow-lg rounded-lg z-40 w-full"
    bind:this={el}
  >
    <div class="flex items-center justify-between">
      <Select
        classes="focus:ring-2 w-32 truncate transition p-1 duration-200 text-xs shadow focus:outline-none rounded-xl"
        hasEmpty={false}
        value={$chartDocId}
        on:change={({ target }) =>
          window.ellx.router.go(`/docs?chart_doc_id=${target.value}`)}
        options={$itemIds}
      />
      <a class="text-black dark:text-white text-lg" href="/docs">×</a>
    </div>
  </div>
{/if}

<style>
  :global(text) {
    font-size: 20px;
  }

  :global(.label) {
    font-size: 22px;
    font-family: monospace;
  }

  :global(.blue) {
    color: #0285c7;
  }

  :global(.post-money-label) {
    color: #0285c7;
    font-size: 24px;
    font-weight: bold;
  }

  :global(.orange) {
    color: orange;
  }

  :global(.share-label) {
    color: orange;
    font-size: 24px;
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
    opacity: 0.8;
    stroke-dasharray: 10 10;
    stroke: red;
  }
  :global(.percent .tick text) {
    font-size: 22px;
    font-weight: medium;
  }
  :global(.percent .domain, .eval-ticks .domain) {
    stroke: none;
  }
</style>
