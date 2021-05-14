<script>
  import { onMount } from "svelte";
  import axis from "d3-axis";
  import d3 from "d3-selection";
  import scale from "d3-scale";
  import extent from "d3-array";
  import shape from "d3-shape";
  import { chartData, roundsCount } from "/utils/selectors.js";

  export let id;

  let el;

  onMount(() => {
    try {
      draw();
    } catch (e) {
      console.log(e);
    }
  });

  function draw() {
    if (roundsCount(id) <= 1) return;

    width = el.clientWidth;

    const data = chartData(id);

    const chart = d3
      .select(el)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 200 80")
      .classed("inline-block", true)
      .append("g")
      .attr("width", 200)
      .attr("height", 80);

    const x = scale
      .scaleTime()
      .domain(
        extent.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, 200]);

    // chart
    //   .append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(axis.axisBottom(x));

    const y = scale
      .scaleLinear()
      .domain([
        0,
        extent.max(data, function (d) {
          return +d.postMoney;
        }),
      ])
      .range([80 - 2, 2]);

    const yPercent = scale
      .scaleLinear()
      .domain([
        0,
        extent.max(data, function (d) {
          return +d.founderShare;
        }),
      ])
      .range([80 - 2, 2]);

    // chart.append("g").call(axis.axisLeft(y));
    // chart
    //   .append("g")
    //   .attr("transform", "translate(" + width + ",0)")
    //   .call(axis.axisRight(yPercent));

    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#0285c7")
      .attr("stroke-width", 1)
      .attr(
        "d",
        shape
          .line()
          .curve(shape.curveStep)
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.postMoney);
          })
      );

    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 1)
      .attr(
        "d",
        shape
          .line()
          .curve(shape.curveMonotoneX)
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return yPercent(d.founderShare);
          })
      );
  }
</script>

<div class="my-4" bind:this={el} />
