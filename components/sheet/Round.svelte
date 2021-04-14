<script context="module">
  import Cell from "./Cell.svelte";
  import { format as formatDate, parseISO } from "date-fns";

  function dateInputFormat(d) {
    return formatDate(d, "yyyy-MM-dd");
  }

  function displayFormat(d) {
    try {
      return formatDate(parseISO(d), "yyyy/MM");
    } catch (e) {
      return formatDate(new Date(), "yyyy/MM");
    }
  }

  export const ROUND_WIDTHS = {
    founded: 150,
    common: 600,
    split: 600,
    "j-kiss": 150,
  };

  export const ROUND_COLS = {
    founded: 2,
    common: 7,
    split: 7,
    "j-kiss": 2,
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
  import { roundOptions } from "/utils/actions.js";
  import _ from "/utils/intl.js";
  import { format } from "/utils/index.js";

  export let type;
  export let name;
  export let date;
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
    <Cell class="text-left text-gray-100 text-sm font-medium truncate"
      >{name}</Cell
    >
    <div class="text-sm text-gray-200">{displayFormat(date)}</div>
  </div>
  <div
    class="flex flex-row justify-evenly text-center text-xs items-center font-medium"
  >
    {#each options.cols as { label, hasRowspan }}
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
        {$_(label)}
      </div>
      <!-- {/if} -->
    {/each}
  </div>
</div>
<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm rounded-sm gap-0 grid grid-cols-{ROUND_COLS[
    type
  ]}"
>
  <TableData size={ROUND_COLS[type]} values={result.values} />
</div>

<div style="height: 4rem">controls</div>

<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 text-center p-1"
>
  {#if result && result.roundResults}
    <Cell
      editable={type !== "j-kiss" && type !== "split"}
      class="p-1 h-6 items-center"
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
