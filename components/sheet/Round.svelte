<script context="module">
  import Cell from "./Cell.svelte";
  import { format as formatDate, parseISO } from "date-fns";

  // function dateInputFormat(d) {
  //   return formatDate(d, "yyyy-MM-dd");
  // }

  function displayFormat(d) {
    try {
      return formatDate(parseISO(d), "yyyy/MM");
    } catch (e) {
      return formatDate(new Date(), "yyyy/MM");
    }
  }

  export const ROUND_WIDTHS = {
    founded: 200,
    common: 600,
    split: 600,
    "j-kiss": 250,
  };

  export const INVESTORS_COL_WIDTH = 200;
  export const calculateWidth = (rs) => {
    return rs instanceof Map
      ? [...rs.values()].reduce(
          (acc, { type }) => acc + ROUND_WIDTHS[type],
          INVESTORS_COL_WIDTH
        )
      : 0;
  };
</script>

<script>
  import TableData from "./TableData.svelte";
  import {
    roundOptions,
    updateSplitBy,
    renameRound,
    updateSharePrice,
    updateValuationCap,
    updateDiscount,
  } from "/utils/actions.js";
  import _ from "/utils/intl.js";
  import { format } from "/utils/index.js";

  export let type;
  export let name;
  export let date;
  export let splitBy;
  export let valuationCap;
  export let discount;
  export let id;
  export let result;

  $: width = ROUND_WIDTHS[type];
  $: options = roundOptions[type];
</script>

<div
  style="top: 0; width: {width}px; min-width: 0; min-height: 0;"
  class="round sticky border dark:border-gray-700 dark:bg-gray-800 bg-white grid grid-rows-2"
>
  <div
    class="flex flex-row justify-between px-2 items-center bg-gray-600 dark:bg-gray-900"
  >
    <Cell
      class="text-left text-gray-100 text-sm font-medium"
      on:change={({ detail }) => renameRound({ roundId: id, value: detail })}
      value={name}
    />
    <div class="text-sm text-gray-200">{displayFormat(date)}</div>
  </div>
  <div
    class="flex flex-row justify-evenly text-center text-xs items-center font-medium"
  >
    {#each Object.keys(options.cols) as colType}
      <!-- {#if hasRowspan}
        <div class="flex flex-col">
          <div class="flex-1 h-full p-1 flex items-center justify-end">
            {$_("潜在株式")}
          </div>
          <div class="flex-1 h-full p-1 flex items-center justify-end">
            {$_(label)}
          </div>
        </div>
      {:else} -->
      <div class="flex-1 h-full p-1 flex items-center justify-end truncate">
        {$_(options.cols[colType].label)}
      </div>
      <!-- {/if} -->
    {/each}
  </div>
</div>
<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-1 rounded-sm gap-0 grid grid-cols-{Object.keys(
    options.cols
  ).length}"
>
  <TableData
    roundId={id}
    readOnly={type === "split"}
    cols={options.cols}
    values={result.values}
  />
</div>

<div class="py-4 flex items-center flex-row flex-wrap" style="height: 6rem">
  {#if type === "split"}
    <div class="w-1/2 flex items-center justify-end px-4">{$_("分割数")}</div>
    <Cell
      class="flex-1 h-8 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono text-sm"
      value={splitBy}
      on:change={({ detail }) => updateSplitBy({ roundId: id, value: detail })}
    />
  {:else if type === "j-kiss"}
    <div
      class="w-1/2 flex items-center justify-end px-4"
      style="font-size: 0.8rem"
    >
      {$_("ﾊﾞﾘｭｴｰｼｮﾝｷｬｯﾌﾟ")}
    </div>
    <Cell
      class="w-1/2 flex-1 h-6 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono"
      value={valuationCap}
      on:change={({ detail }) =>
        updateValuationCap({ roundId: id, value: detail })}
      >{format.currency.format(valuationCap)}</Cell
    >
    <div
      class="w-1/2 flex items-center justify-end px-4"
      style="font-size: 0.8rem"
    >
      {$_("割引率")}
    </div>
    <Cell
      class="w-1/2 flex-1 h-6 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono"
      value={discount}
      on:change={({ detail }) => updateDiscount({ roundId: id, value: detail })}
      >{discount}%</Cell
    >
  {/if}
</div>

<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 text-center p-1"
>
  {#if result && result.roundResults}
    <Cell
      editable={type !== "j-kiss" && type !== "split"}
      class="p-1 h-6 items-center"
      value={result.roundResults.sharePrice}
      on:change={({ detail }) =>
        updateSharePrice({ roundId: id, value: detail })}
    >
      {format.currency.format(result.roundResults.sharePrice)}
    </Cell>
    <div class="p-1 h-6 items-center">
      {format.currency.format(result.roundResults.newEquity)}
    </div>
    <div class="p-1 h-6 items-center">
      {format.currency.format(result.roundResults.preMoney)}
    </div>
    <div class="p-1 h-6 items-center">
      {format.currency.format(result.roundResults.postMoney)}
    </div>
    <div class="p-1 h-6 items-center">
      {format.currency.format(result.roundResults.preMoneyDiluted)}
    </div>
    <div class="p-1 h-6 items-center">
      {format.currency.format(result.roundResults.postMoneyDiluted)}
    </div>
  {/if}
</div>
