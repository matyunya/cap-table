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

  const width = 180;
  const height = 60;

  onMount(() => {
    try {
      if (roundsCount(id) <= 1) return;

      const data = chartData(id);

      const chart = d3
        .select(el)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

      const x = scale
        .scaleTime()
        .domain(
          extent.extent(data, function (d) {
            return d.date;
          })
        )
        .range([0, width]);

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
        .range([height - 2, 2]);

      const yPercent = scale
        .scaleLinear()
        .domain([
          0,
          extent.max(data, function (d) {
            return +d.founderShare;
          }),
        ])
        .range([height - 2, 2]);

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
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return yPercent(d.founderShare);
            })
        );
    } catch (e) {
      console.log(e);
    }
  });
</script>

<div class="my-4" bind:this={el} />
