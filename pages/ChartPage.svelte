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

  const margin = { top: 20, right: 30, bottom: 30, left: 70 };
  const width = 800;
  const height = 300;

  const fmt = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });

  function draw() {
    d3.select(el).selectAll("*").remove();

    const chart = d3
      .select(el)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 840 300")
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
        axis.axisBottom(x).tickFormat((i) => {
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

    chart
      .append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(
        axis
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => fmt.format(d))
      );

    chart
      .append("g")
      .attr("transform", "translate(" + (width - margin.right) + ",0)")
      .call(
        axis
          .axisRight(yPercent)
          .tickValues([0.333, 0.5, 0.666, 1])
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
          .curve(shape.curveStep)
          .x((d, i) => x(i) - 4)
          .y((d) => yPercent(d.founderShare) - 4)
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

    const dotNode = chart.selectAll("dot").data($activeDocChartData).enter();

    dotNode
      .append("circle")
      .attr("r", (d, i) => (i === 0 ? 0 : r(d.postMoney)))
      .attr("fill", "#0285c7")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d) => y(d.postMoney));

    dotNode
      .append("text")
      .attr("class", "label")
      .attr("x", (d, i) => x(i) - 10)
      .attr("y", (d) => y(d.postMoney) - 5)
      .text((d, i) => (i === 0 ? "" : fmt.format(d.postMoney) + "円"));
  }
</script>

<div class="mt-24">
  <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
    資本政策チャート
  </h2>
  <Select
    classes="ml-6 mr-3 focus:ring-2 w-32 truncate transition p-1 duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
    hasEmpty={false}
    value={$chartDocId}
    on:change={({ target }) => window.ellx.router.go(`/chart/${target.value}`)}
    options={$documentIds}
  />
  <div class="my-4 z-50 max-w-5xl mx-auto" bind:this={el} />
</div>

<style>
  :global(text) {
    font-size: 8px;
  }
</style>
